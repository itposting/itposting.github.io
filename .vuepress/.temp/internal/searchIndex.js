export const searchIndex = [
  {
    "title": "",
    "headers": [],
    "path": "/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Today I Learned",
    "headers": [],
    "path": "/About/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Mac 최신 루머: Apple의 새로운 모델 출시 시기는? (2022년12월)",
    "headers": [
      {
        "level": 2,
        "title": "맥북 프로",
        "slug": "맥북-프로",
        "children": []
      },
      {
        "level": 2,
        "title": "IMAC",
        "slug": "imac",
        "children": []
      },
      {
        "level": 2,
        "title": "Mac mini",
        "slug": "mac-mini",
        "children": []
      },
      {
        "level": 2,
        "title": "Macbook Air",
        "slug": "macbook-air",
        "children": []
      },
      {
        "level": 2,
        "title": "Mac Pro",
        "slug": "mac-pro",
        "children": []
      },
      {
        "level": 2,
        "title": "Mac Studio",
        "slug": "mac-studio",
        "children": []
      }
    ],
    "path": "/docs/Finalcut/2022-12-19-Mac-%EC%B5%9C%EC%8B%A0-%EB%A3%A8%EB%A8%B8-Apple%EC%9D%98-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%AA%A8%EB%8D%B8-%EC%B6%9C%EC%8B%9C-%EC%8B%9C%EA%B8%B0%20/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/404.html",
    "pathLocale": "/",
    "extraFields": []
  }
]

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSearchIndex) {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ searchIndex }) => {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  })
}
