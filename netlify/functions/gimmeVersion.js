exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({message: "v1 - Send email working"})
    };
}