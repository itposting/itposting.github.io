const fs = require("fs");
const globby = require("globby");
const path = require("path");
const prettier = require("prettier");

const YOUR_AWESOME_DOMAIN = `https://itposting.github.io`;

const formatted = (sitemap) => prettier.format(sitemap, { parser: "html" });

const pagesSitemapGenerator = async () => {
  const pages = await globby([
    // include
    "pages/**/*.tsx",
    "pages/**/**/*.tsx",
    "pages/*.tsx",
    "pages/_*.tsx",
    // exclude
    "!pages/_*.tsx",
    "!pages/index.tsx",
    "!pages/[slug].tsx",
    "!pages/**/[slug].tsx",
    "!pages/**/**/[slug].tsx",
  ]);

  return pages
    .map((page) => {
      console.log(page);
      const path = page
        .replace("pages/", "")
        .replace(".tsx", "")
        .replace(/\/index/g, "");

      const routePath = path === "index" ? "" : path;

      return `
      <url>
        <loc>${YOUR_AWESOME_DOMAIN}/${routePath}</loc>
      </url>
    `;
    })
    .join("");
};

const postsSitemapGenerator = async () => {
  const posts = await globby([
    // include
    "_posts/*.md",
    "_posts/**/*.md",
    "_posts/**/**/*.md",
  ]);

  return posts
    .map((page) => {
      const path = page
        .replace("_posts", "post")
        .replace(".md", "")
        .replace(/\/index/g, "");
      let routePath = path === "index" ? "" : path;

      return `
    <url>
      <loc>${YOUR_AWESOME_DOMAIN}/${routePath}</loc>
    </url>
  `;
    })
    .join("");
};

(async () => {
  console.log(await postsSitemapGenerator());
  // ${await pagesSitemapGenerator()}
  const generatedSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${YOUR_AWESOME_DOMAIN}</loc>
    </url>
  		${await postsSitemapGenerator()}
    </urlset>
  `;

  const formattedSitemap = [formatted(generatedSitemap)];

  fs.writeFileSync("public/sitemap.xml", formattedSitemap.join(""), "utf8");
})();
