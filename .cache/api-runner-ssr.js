var plugins = [{
      plugin: require('/Users/lars/dev/fileparty/node_modules/gatsby-plugin-plausible/gatsby-ssr'),
      options: {"plugins":[],"domain":"fileparty.co"},
    },{
      plugin: require('/Users/lars/dev/fileparty/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/lars/dev/fileparty/node_modules/gatsby-plugin-google-analytics/gatsby-ssr'),
      options: {"plugins":[],"trackingId":"UA-186177730-1","head":false,"anonymize":false,"respectDNT":false,"exclude":[],"pageTransitionDelay":0},
    },{
      plugin: require('/Users/lars/dev/fileparty/node_modules/gatsby-plugin-canonical-urls/gatsby-ssr'),
      options: {"plugins":[],"siteUrl":"https://fileparty.co","stripQueryString":true},
    },{
      plugin: require('/Users/lars/dev/fileparty/node_modules/gatsby-plugin-manifest/gatsby-ssr'),
      options: {"plugins":[],"name":"FileParty","short_name":"FileParty","start_url":"/","background_color":"#f7f0eb","theme_color":"#a2466c","display":"standalone","icon":"src/square_logo.svg","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"134f1f72ff463d5c534351b543120e23"},
    },{
      plugin: require('/Users/lars/dev/fileparty/node_modules/gatsby-plugin-sitemap/gatsby-ssr'),
      options: {"plugins":[],"output":"/sitemap.xml","createLinkInHead":true},
    },{
      plugin: require('/Users/lars/dev/fileparty/gatsby-ssr'),
      options: {"plugins":[]},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn, argTransform) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  // eslint-disable-next-line no-undef
  let results = plugins.map(plugin => {
    if (!plugin.plugin[api]) {
      return undefined
    }
    const result = plugin.plugin[api](args, plugin.options)
    if (result && argTransform) {
      args = argTransform({ args, result })
    }
    return result
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
