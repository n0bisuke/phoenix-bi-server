exports.config = {
  // See http://brunch.io/#documentation for docs.
  files: {
    javascripts: {
      joinTo: "js/app.js",

      // To use a separate vendor.js bundle, specify two files path
      // http://brunch.io/docs/config#-files-
      // joinTo: {
      //   "js/app.js": /^js/,
      //   "js/vendor.js": /^(?!js)/
      // }
      //
      //To change the order of concatenation of files, explicitly mention here
      order: {
        before: [
          "vendor/spread/css/gc.spread.views.dataview.10.3.0.css",
          "vendor/spread/css/bootstrap-snippet.min.css",
          "vendor/spread/css/plugins/gc.spread.views.cardlayout.10.3.0.css",
          "vendor/spread/css/plugins/gc.spread.views.calendargrouping.10.3.0.css",
          "vendor/jquery.min.js",
          "vendor/spread/js/gc.spread.common.10.3.0.min.js",
          "vendor/spread/js/gc.spread.views.dataview.10.3.0.min.js",
          "vendor/spread/js/locale/gc.spread.views.dataview.locale.ja-JP.10.3.0.min.js",
          "vendor/spread/js/plugins/gc.spread.views.cardlayout.10.3.0.min.js",
          "vendor/spread/js/plugins/gc.spread.views.calendargrouping.10.3.0.min.js",
          "vendor/spread/js/zepto.min.js",
          "vendor/spread/js/license.js",
        ]
      }
    },
    stylesheets: {
      joinTo: "css/app.css"
    },
    templates: {
      joinTo: "js/app.js"
    }
  },

  conventions: {
    // This option sets where we should place non-css and non-js assets in.
    // By default, we set this to "/assets/static". Files in this directory
    // will be copied to `paths.public`, which is "priv/static" by default.
    assets: /^(static)/
  },

  // Phoenix paths configuration
  paths: {
    // Dependencies and current project directories to watch
    watched: ["static", "css", "js", "vendor"],
    // Where to compile files to
    public: "../priv/static"
  },

  // Configure your plugins
  plugins: {
    babel: {
      // Do not use ES6 compiler in vendor code
      ignore: [/vendor/]
    }
  },

  modules: {
    autoRequire: {
      "js/app.js": ["js/app"]
    }
  },

  npm: {
    enabled: true
  }
};
