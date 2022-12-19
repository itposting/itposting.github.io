import { defaultTheme, DefaultThemeOptions, defineUserConfig, Theme, viteBundler } from "vuepress-vite";
import { pwaPlugin } from "@vuepress/plugin-pwa";
import { feed } from "vuepress-plugin-feed2";
import { searchPlugin } from "@vuepress/plugin-search";
import MarkdownItPlantuml from "markdown-it-plantuml";
import MarkdownItUnderline from "markdown-it-underline";
import MarkdownItTaskLists from "markdown-it-task-lists";
// import  from "vuepress-plugin-sitemap";
import * as path from "path";
import * as glob from "glob";
import * as fs from "fs";

const localTheme = (options: DefaultThemeOptions): Theme => ({
  name: "vuepress-theme-itposting",
  extends: defaultTheme(options),
  layouts: {
    Layout: path.resolve(__dirname, "theme/layouts/Layout.vue"),
  },
});

const getProperty = (data, property) => {
  const reg = new RegExp(`${property}:(.*)`);
  return data.match(reg)?.[1].trim();
};

const posts = glob
  .sync("!(node_modules)/**/*.md")
  .map((path) => {
    const data = fs.readFileSync(path, "utf8");
    if (Boolean(getProperty(data, "disabledPost"))) return;

    return {
      path: "/" + path.replace("README.md", ""),
      title: getProperty(data, "title"),
      tag: getProperty(data, "tag"),
      description: getProperty(data, "description"),
      thumbnail: getProperty(data, "thumbnail"),
      createdAt: new Date(getProperty(data, "date") || fs.statSync(path).birthtime).getTime(),
      sitemapLoc: `http://itposting.github.io/${path.replace("README.md", "")}index.html`,
    };
  })
  .filter((v) => Boolean(v?.title))
  .sort((a, b) => b.createdAt - a.createdAt);

const generateSitemap = (posts) => {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (let i in posts) {
    const post = posts[i];
    sitemap += "<url>\n";
    sitemap += `\t<loc>${post.sitemapLoc}</loc>\n`;
    sitemap += "</url>\n";
  }
  sitemap += "</urlset>";
  return sitemap;
};

console.log(generateSitemap(posts));
fs.writeFileSync(path.join(__dirname, "/public/sitemap.xml"), generateSitemap(posts));
fs.writeFileSync(path.join(__dirname, "/public/posts.json"), JSON.stringify(posts));

export default defineUserConfig({
  title: "itposting",
  description: "Today I leanred",
  theme: localTheme({
    logo: "https://user-images.githubusercontent.com/46010705/200171783-79070d74-8c1d-488c-819c-548ebd4c461f.png",
    navbar: [{ text: "Home", link: "/" }],
    sidebar: "auto",
    lastUpdated: true,
    contributors: false,
  }),
  bundler: viteBundler(),
  base: "/",
  head: [
    // ["meta", { name: "google-site-verification", content: "pvvSTvZm_50xq7R_E4wMghRYyaoQ0Of-Hf7MvqBbj8M" }],
    // ["meta", { name: "naver-site-verification", content: "d5357edfb68faf1ae15d21e0fbe3293dea724789" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/assets/favicons/apple-touch-icon.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/assets/favicons/favicon-32x32.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/assets/favicons/favicon-16x16.png" }],
    ["link", { rel: "manifest", href: "/manifest.webmanifest" }],
    ["link", { rel: "mask-icon", href: "/assets/favicons/safari-pinned-tab.svg", color: "#3a0839" }],
    ["link", { rel: "shortcut icon", href: "/assets/favicons/favicon.ico" }],
    ["link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Noto+Serif+KR&display=swap" }],
    ["meta", { name: "msapplication-TileColor", content: "#3a0839" }],
    ["meta", { name: "msapplication-config", content: "/browserconfig.xml" }],
    ["meta", { name: "theme-color", content: "#ffffff" }],
    ["script", { async: true, crossorigin: "anonymous", src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686" }],
    ["script", { async: true, src: "https://www.googletagmanager.com/gtag/js?id=G-DY9TJ8NGRE" }],
    [
      "script",
      {},
      `  window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-DY9TJ8NGRE');`,
    ],
  ],
  extendsMarkdown: (md) => {
    md.use(MarkdownItPlantuml);
    md.use(MarkdownItUnderline);
    md.use(MarkdownItTaskLists);
  },
  plugins: [
    feed({
      hostname: "https://itposting.github.io/",
      rss: true,
      atom: true,
      json: true,
    }),
    searchPlugin({}),
    // demoBlock({}),
  ],
});
