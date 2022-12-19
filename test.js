// import { chalk as f, withSpinner as b, fs as O } from "@vuepress/utils";
const f = requre("@vuepress/utils/chalk");
const b = requre("@vuepress/utils/withSpinner");
const O = requre("@vuepress/utils/fs");
// import { Logger as k } from "vuepress-shared/node";
const k = requre("vuepress-shared/node/Logger");
// import { isLinkHttp as D, removeEndingSlash as F, removeLeadingSlash as S } from "@vuepress/shared";
const D = requre("@vuepress/shared/isLinkHttp");
const F = requre("@vuepress/shared/removeEndingSlash");
const S = requre("@vuepress/shared/removeLeadingSlash");

// import { SitemapStream as G } from "sitemap";
const G = requre("sitemap/SitemapStream");

const w = new k("vuepress-plugin-sitemap2"),
  x = ({ options: e, deprecatedOption: n, newOption: a, msg: s = "", scope: p = "" }) => {
    if (n in e) {
      if (
        (w.warn(
          `${f.magenta(n)} is ${f.yellow("deprecated")}${p ? ` in ${p}` : ""}, please use "${f.magenta(a)}" instead.${
            s
              ? `
${s}`
              : ""
          }`
        ),
        a.includes("."))
      ) {
        const l = a.split(".");
        let r = e;
        l.forEach((o, d) => {
          d !== l.length - 1 ? ((r[o] = r[o] || {}), (r = r[o])) : (r[o] = e[n]);
        });
      } else e[a] = e[n];
      delete e[n];
    }
  },
  U = (e) => {
    x({ options: e, deprecatedOption: "urls", newOption: "extraUrls" }),
      x({ options: e, deprecatedOption: "exclude", newOption: "excludeUrls" }),
      x({ options: e, deprecatedOption: "outFile", newOption: "sitemapFilename" }),
      x({ options: e, deprecatedOption: "dateFormatter", newOption: "modifyTimeGetter" });
  },
  E = [],
  P = (e) => ({ defaultPath: e.path.replace(e.pathLocale, "/"), pathLocale: e.pathLocale }),
  q = (e, n) => {
    const {
        changefreq: a,
        excludeUrls: s = ["/404.html"],
        modifyTimeGetter: p = (t) => {
          var m;
          return (m = t.data.git) != null && m.updatedTime ? new Date(t.data.git.updatedTime).toISOString() : "";
        },
      } = n,
      {
        pages: l,
        options: { base: r, locales: o },
      } = e,
      d = l.reduce((t, m) => {
        const { defaultPath: u, pathLocale: h } = P(m),
          c = t.get(u) || [];
        return c.push(h), t.set(u, c);
      }, new Map()),
      g = new Map();
    return (
      l.forEach((t) => {
        const m = t.frontmatter.sitemap || {},
          u = (t.frontmatter.head || []).find((i) => i[1].name === "robots");
        if (
          (u
            ? (u[1].content || "")
                .split(/,/u)
                .map((i) => i.trim())
                .includes("noindex")
            : m.exclude) ||
          s.includes(t.path)
        )
          return;
        const h = p(t),
          { defaultPath: c } = P(t),
          $ = d.get(c) || [];
        let v = [];
        $.length > 1 &&
          (e.env.isDebug &&
            $.forEach((i) => {
              !o[i].lang && !E.includes(i) && (w.warn(`'lang' option for ${i} is missing`), E.push(i));
            }),
          (v = $.map((i) => {
            var L;
            return { lang: ((L = o[i]) == null ? void 0 : L.lang) || "en", url: `${r}${S(c.replace(/^\//u, i))}` };
          })));
        const y = { ...(a ? { changefreq: a } : {}), links: v, ...(h ? { lastmod: h } : {}), ...m };
        e.env.isDebug && w.info(`sitemap option for ${t.path}: ${JSON.stringify(y, null, 2)}`), g.set(t.path, y);
      }),
      g
    );
  },
  M = async (e, n) => {
    const { extraUrls: a = [], xmlNameSpace: s } = n,
      p = D(n.hostname) ? F(n.hostname) : `https://${F(n.hostname)}`,
      l = n.sitemapFilename ? S(n.sitemapFilename) : "sitemap.xml",
      {
        dir: r,
        options: { base: o },
      } = e;
    await b(`Generating sitemap to ${f.cyan(l)}`)(
      () =>
        new Promise((g) => {
          const t = new G({ hostname: p, ...(s ? { xmlns: s } : {}) }),
            m = q(e, n),
            u = r.dest(l),
            h = O.createWriteStream(u);
          t.pipe(h),
            m.forEach((c, $) => t.write({ url: `${o}${S($)}`, ...c })),
            a.forEach((c) => t.write({ url: `${o}${S(c)}` })),
            t.end(() => {
              g();
            });
        })
    );
    const d = r.dest("robots.txt");
    O.existsSync(d) &&
      (await b(`Appended sitemap path to ${f.cyan("robots.txt")}`)(async () => {
        const g = `${(await O.readFile(d, { encoding: "utf8" })).replace(/^Sitemap: .*$/u, "")}
Sitemap: ${p}${o}${l}
`;
        await O.writeFile(d, g, { flag: "w" });
      }));
  },
  T =
    (e, n = !1) =>
    (a) => {
      n && U(e), a.env.isDebug && w.info(`Options: ${e.toString()}`);
      const s = { name: "vuepress-plugin-sitemap2" };
      return e.hostname ? { ...s, onGenerated: (p) => M(p, e) } : (w.error(`Option ${f.magenta("hostname")} is required!`), s);
    };
export { T as default, T as sitemapPlugin };
//# sourceMappingURL=index.js.map
