const packageJson = require("../../package.json");

module.exports = {
  title: "Multiplicity",
  description: "Eleventy-based RSS aggregator template",
  author: "Multiple Authors",
  url: "m10y-https://11tymulti.netlify.app/",
  github: {
    project: "https://github.com/lwojcik/eleventy-template-m10y",
  },
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
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
