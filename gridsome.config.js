// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
    siteName: 'rafadpedrosa',
    pathPrefix: '/',
    titleTemplate: '',
    transformers: {
        remark: {
            externalLinksTarget: '_blank',
            externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
            anchorClassName: 'icon icon-link',
            plugins: [
                // ...global plugins
            ]
        }
    },

    plugins: [
        {
            use: '@gridsome/source-filesystem',
            options: {
                path: 'collections/posts/**/*.json',
                typeName: 'posts'
            }
        },
        {
            use: '@gridsome/source-filesystem',
            options: {
                path: 'collections/blogs/**/*.json',
                typeName: 'blogs'
            }
        },
        {
            use: '@gridsome/source-filesystem',
            options: {
                path: 'collections/techs/**/*.json',
                typeName: 'techs'
            }
        },
        {
            use: `gridsome-plugin-netlify-cms`,
            options: {
                publicPath: `/admin`,
                modulePath: `src/admin/index.js`,
            }
        },
    ]
}
