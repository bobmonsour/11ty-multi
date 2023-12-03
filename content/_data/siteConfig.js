const packageJson = require("../../package.json");

module.exports = {
  title: "11ty Multi",
  description: "Eleventy-based RSS aggregator for 11Bundle.dev",
  author: "Multiple Authors",
  url: "https://11ty-multi.netlify.app/",
  github: {
    project: "https://github.com/bobmonsour/11ty-multi",
  },
  userAgent: "m10y-https://11ty-multi.netlify.app/",
  language: "en",
  generator: {
    name: "Eleventy",
    version: packageJson.dependencies["@11ty/eleventy"].replace("^", ""),
  },
  dateFormats: {
    readable: "d LLL yyyy", // date format used alongside posts
  },
  maxPostLength: 150, // How many characters per each post excerpt?
  maxItemsPerFeed: 10, // How many items should be fetched from each feed?
  enablePWA: false, // If true, service worker is registered to make the site behave like a mobile app (PWA)
  localCacheDuration: "*", // For how long should network calls be cached locally? See https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration
};
