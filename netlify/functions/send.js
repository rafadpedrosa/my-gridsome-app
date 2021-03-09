/**
 * Sends a email from HTML form via AWS SES.
 *
 * 1. Send contact-me function validates and parses request created by
 *    submitting a form.
 * 2. Send email function calls AWS SES API with data from previous
 *    step.
 *
 * If there’s a user error, an HTTP redirect response to HTML contact-me
 * form is generated. Successful invocation also ends with HTTP
 * redirect to HTML contact-me form with `#fail` fragment.
 *
 * Configuration is via environment variable:
 *
 * - SOURCE who is sending the email. Add the validated domain or the some valid email
 * - RECEIVER: who will be receivin the email from taht site? Add an institucional email to receive this.
 *
 * - MY_AWS_REGION
 * - MY_AWS_ACCESS_KEY_ID
 * - MY_AWS_SECRET_ACCESS_KEY
 */
const AWS = require("aws-sdk")
const querystring = require("querystring")

const ses = new AWS.SES({
    apiVersion: '2010-12-01',
    region: process.env["MY_AWS_REGION"],
    credentials: new AWS.Credentials(process.env["MY_AWS_ACCESS_KEY_ID"],
        process.env["MY_AWS_SECRET_ACCESS_KEY"])
})

/** @typedef {function(Error=,Object=)} */
var NetlifyCallback

/**
 * Returns just type and subtype from Content-Type HTTP header value.
 *
 * @param {string|undefined} headerValue
 * @return {string}
 */
function parseContentType(headerValue) {
    return (headerValue || "").split(/;\s+/, 2)[0]
}

/**
 * Returns name encoded using syntax of encoded-words from MIME.
 *
 * This is a very lazy developer’s approach defaulting to BASE64
 * without trying anything else and shouldn’t be considered
 * production-ready. MIME suggests what to use when, get familiar with
 * or use some nice library.
 *
 * @param {string} name
 * @return {string}
 * @see {@link https://tools.ietf.org/html/rfc2047 RFC 2047}
 */
function mimeEncode(name) {
    return (
        "=?utf-8?b?" +
        Buffer.from(name).toString('base64') +
        "?="
    )
}

/**
 * Calls the callback so that it redirects to contact-me form URL.
 *
 * Optional code can be specified. This code is set as a fragment part
 * of the redirect location.
 *
 * @param {!NetlifyCallback} callback
 * @param code
 * @param {Object=} body
 */
function redir(callback, code= 500, body = {}) {
    callback(null, {
        statusCode: code,
        body: JSON.stringify(body)
    })
}

/**
 * Parses and validates event triggered by contact-me form submission.
 *
 * The function ends with a call to {@link sendEmail}.
 *
 * @param {!Object} event
 * @param {!Object} context
 * @param {!NetlifyCallback} callback
 */
function requestResolver(event, context, callback) {
    if (event["httpMethod"] !== "POST") {
        return callback(
            new Error(`Unexpected HTTP method "${event["httpMethod"]}"`)
        )
    }
    if (parseContentType(event["headers"]["content-type"]) !==
        "application/x-www-form-urlencoded") {
        return callback(
            new Error(`Unexpected content type "${event["headers"]["content-type"]}"`)
        )
    }

    const params = querystring.parse(event["body"])

    if (process.env["QUESTION_FORM_HONEYPOT"] &&
        params[process.env["QUESTION_FORM_HONEYPOT"]]) {
        console.info("Bot trapped in honeypot")
        return callback()
    }

    const errs = []
    if (!params["email"]) errs.push("no email")
    if (!params["subject"]) errs.push("no subject")
    if (!params["body"]) errs.push("no body")
    if (errs.length > 0) return redir(callback, { errors: errs.join(","), emailSent: 0 })

    sendEmail(
        params["name"]
            ? `${mimeEncode(params["name"])} <${params["email"]}>`
            : params["email"],

        params["subject"],
        params["body"],
        callback
    )
}


/**
 * Sends email via AWS SES API.
 *
 * @param {string} replyTo
 * @param {string} subject
 * @param {string} body
 * @param {!NetlifyCallback} callback
 */
async function sendEmail(replyTo, subject, body, callback) {
    console.log(":::INICIOU")

    ses.sendEmail({
        Source: process.env["SOURCE"],
        Destination: {
            ToAddresses: [
                process.env["RECEIVER"]
            ]
        },
        ReplyToAddresses: [
            replyTo
        ],
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: subject
            },
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: body
                }
            }
        }
    }, (err, data) => {
        if (err) {
            console.error("Error while sending email via AWS SES:", err)
            return redir(callback, 400, { message: "Email Fail", error: "Email Fail", emailSent: 0 })
        }

        callback(null, {
            statusCode: 200,

            body: JSON.stringify({ emailSent: 1, message: "Email Sent" })
        })
    })
}

exports.handler = requestResolver