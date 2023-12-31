const siteFeeds = require("./content/_data/multifeeds.json");
const EleventyFetch = require("@11ty/eleventy-fetch");
const feedExtractor = import("@extractus/feed-extractor");
const faviconsPlugin = require("eleventy-plugin-gen-favicons");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const addHash = require("./_11ty/helpers/addHash");
const getFulfilledValues = require("./_11ty/helpers/getFulfilledValues");
const readableDate = require("./_11ty/helpers/readableDate");
const siteConfig = require("./content/_data/siteConfig");
const stripAndTruncateHTML = require("./_11ty/helpers/stripAndTruncateHTML");

module.exports = function (eleventyConfig) {
  // --- Copy assets

  eleventyConfig.addPassthroughCopy({
    assets: ".",
    "assets/images": "images",
    "assets/js": "js",
  });

  // --- Layout aliases

  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("index", "layouts/index.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");

  // --- Filters

  eleventyConfig.addFilter("addHash", addHash);
  eleventyConfig.addFilter("readableDate", readableDate);
  eleventyConfig.addFilter(
    "alwaysProductionUrl",
    (path) => new URL(path, siteConfig.url)
  );

  // --- Collections

  eleventyConfig.addCollection("articles", async function () {
    try {
      const extractor = await feedExtractor;
      const blogs = siteFeeds;
      // blogs.slice(0, 10).forEach((item) => console.log(item));
      const allSiteFeeds = blogs.map(async (blog) => {
        try {
          const { name, url, feed, feedType } = blog;
          // console.log("feedType: " + feedType);
          const feedData = await EleventyFetch(feed, {
            duration: siteConfig.localCacheDuration,
            type: feedType,
            verbose: process.env.ELEVENTY_ENV === "development",
            fetchOptions: {
              headers: {
                "user-agent": siteConfig.userAgent,
              },
            },
          });

          const extractOptions = {
            getExtraEntryFields: (item) => {
              try {
                if (item.content["#text"]?.length > 0) {
                  const htmlDescription = stripAndTruncateHTML(
                    item.content["#text"],
                    siteConfig.maxPostLength
                  );

                  return {
                    htmlDescription,
                  };
                } else {
                  return {
                    htmlDescription: "",
                  };
                }
              } catch (error) {
                return {
                  htmlDescription: "",
                };
              }
            },
          };

          const parsedFeedData =
            feedType === "json" && typeof feedData === "string"
              ? JSON.parse(feedData)
              : feedData;

          let feedContent = "";
          if (feedType === "json") {
            // console.log("feedType: " + feedType);
            // console.log("url: " + url);
            feedContent = {
              entries: parsedFeedData.items.map((item) => ({
                ...item,
                published: item.date_published,
                description: stripAndTruncateHTML(
                  item.content_html,
                  siteConfig.maxPostLength
                ),
              })),
            };
          } else {
            try {
              feedContent = await extractor.extractFromXml(
                feedData,
                extractOptions
              );
            } catch (error) {
              console.log(error);
              console.log(
                "\nfeedType: " + feedType + ", feed url: " + feed + "\n"
              );
            }
          }

          // if there are entries, return a sorted array of entries
          if (feedContent.entries) {
            return feedContent.entries
              .map((entry) => ({
                ...entry,
                author: {
                  name,
                  url,
                },
              }))
              .sort((a, b) => new Date(b.published) - new Date(a.published))
              .slice(0, siteConfig.maxItemsPerFeed);
          }
        } catch (error) {
          console.log(error);
        }
      });

      const allArticles = await getFulfilledValues(allSiteFeeds);

      const sortedItems = allArticles
        .flat()
        .filter(
          (item) =>
            item &&
            (item.title.includes("11ty") ||
              item.title.toLowerCase().includes("eleventy"))
        )
        .sort((a, b) => new Date(b.published) - new Date(a.published));

      return sortedItems;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });

  // --- Plugins

  eleventyConfig.addPlugin(faviconsPlugin, {
    manifestData: {
      name: siteConfig.title,
      lang: siteConfig.language,
      short_name: siteConfig.title,
      description: siteConfig.description,
      start_url: "/",
      scope: "/",
      display: "standalone",
      theme_color: "#191818",
      background_color: "#191818",
      orientation: "any",
    },
  });

  eleventyConfig.addPlugin(pluginRss);

  return {
    dir: {
      input: "content",
    },
    templateFormats: ["md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
