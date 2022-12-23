export const siteData = {
  "base": "/",
  "lang": "en-US",
  "title": "itposting",
  "description": "Today I leanred",
  "head": [
    [
      "link",
      {
        "rel": "apple-touch-icon",
        "sizes": "180x180",
        "href": "/assets/favicons/apple-touch-icon.png"
      }
    ],
    [
      "link",
      {
        "rel": "icon",
        "type": "image/png",
        "sizes": "32x32",
        "href": "/assets/favicons/favicon-32x32.png"
      }
    ],
    [
      "link",
      {
        "rel": "icon",
        "type": "image/png",
        "sizes": "16x16",
        "href": "/assets/favicons/favicon-16x16.png"
      }
    ],
    [
      "link",
      {
        "rel": "manifest",
        "href": "/manifest.webmanifest"
      }
    ],
    [
      "link",
      {
        "rel": "mask-icon",
        "href": "/assets/favicons/safari-pinned-tab.svg",
        "color": "#3a0839"
      }
    ],
    [
      "link",
      {
        "rel": "shortcut icon",
        "href": "/assets/favicons/favicon.ico"
      }
    ],
    [
      "link",
      {
        "rel": "stylesheet",
        "href": "https://fonts.googleapis.com/css?family=Noto+Serif+KR&display=swap"
      }
    ],
    [
      "meta",
      {
        "name": "msapplication-TileColor",
        "content": "#3a0839"
      }
    ],
    [
      "meta",
      {
        "name": "msapplication-config",
        "content": "/browserconfig.xml"
      }
    ],
    [
      "meta",
      {
        "name": "theme-color",
        "content": "#ffffff"
      }
    ],
    [
      "script",
      {
        "async": true,
        "crossorigin": "anonymous",
        "src": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877378276818686"
      }
    ],
    [
      "script",
      {
        "async": true,
        "src": "https://www.googletagmanager.com/gtag/js?id=G-DY9TJ8NGRE"
      }
    ],
    [
      "script",
      {},
      "  window.dataLayer = window.dataLayer || [];\n      function gtag(){dataLayer.push(arguments);}\n      gtag('js', new Date());\n    \n      gtag('config', 'G-DY9TJ8NGRE');"
    ]
  ],
  "locales": {}
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
