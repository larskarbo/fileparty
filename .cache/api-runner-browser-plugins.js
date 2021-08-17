module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-plausible/gatsby-browser.js'),
      options: {"plugins":[],"domain":"fileparty.co"},
    },{
      plugin: require('../node_modules/gatsby-remark-images/gatsby-browser.js'),
      options: {"plugins":[],"maxWidth":640,"linkImagesToOriginal":true,"showCaptions":false,"markdownCaptions":false,"sizeByPixelDensity":false,"backgroundColor":"white","quality":50,"withWebp":false,"tracedSVG":false,"loading":"lazy","disableBgImageOnAlpha":false,"disableBgImage":false},
    },{
      plugin: require('../node_modules/gatsby-plugin-google-analytics/gatsby-browser.js'),
      options: {"plugins":[],"trackingId":"UA-186177730-1","head":false,"anonymize":false,"respectDNT":false,"exclude":[],"pageTransitionDelay":0},
    },{
      plugin: require('../node_modules/gatsby-plugin-canonical-urls/gatsby-browser.js'),
      options: {"plugins":[],"siteUrl":"https://fileparty.co","stripQueryString":true},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"FileParty","short_name":"FileParty","start_url":"/","background_color":"#f7f0eb","theme_color":"#a2466c","display":"standalone","icon":"src/square_logo.svg","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"134f1f72ff463d5c534351b543120e23"},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
