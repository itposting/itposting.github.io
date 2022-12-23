import { Vuepress } from '@vuepress/client'

const routeItems = [
  ["v-8daa1a0e","/",{"title":""},["/index.html","/README.md"]],
  ["v-3e214e9b","/About/",{"title":"Today I Learned"},["/About/index.html","/About/README.md"]],
  ["v-4aa051bd","/docs/Finalcut/2022-12-19-Mac-%EC%B5%9C%EC%8B%A0-%EB%A3%A8%EB%A8%B8-Apple%EC%9D%98-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%AA%A8%EB%8D%B8-%EC%B6%9C%EC%8B%9C-%EC%8B%9C%EA%B8%B0%20/",{"title":"Mac 최신 루머: Apple의 새로운 모델 출시 시기는? (2022년12월)"},["/docs/Finalcut/2022-12-19-Mac-최신-루머-Apple의-새로운-모델-출시-시기 /","/docs/Finalcut/2022-12-19-Mac-%EC%B5%9C%EC%8B%A0-%EB%A3%A8%EB%A8%B8-Apple%EC%9D%98-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%AA%A8%EB%8D%B8-%EC%B6%9C%EC%8B%9C-%EC%8B%9C%EA%B8%B0%20/index.html","/docs/Finalcut/2022-12-19-Mac-최신-루머-Apple의-새로운-모델-출시-시기 /README.md","/docs/Finalcut/2022-12-19-Mac-%EC%B5%9C%EC%8B%A0-%EB%A3%A8%EB%A8%B8-Apple%EC%9D%98-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%AA%A8%EB%8D%B8-%EC%B6%9C%EC%8B%9C-%EC%8B%9C%EA%B8%B0%20/README.md"]],
  ["v-3706649a","/404.html",{"title":""},["/404"]],
  ["v-1ee56904","/docs/Finalcut/2022-12-19-Mac-%EC%B5%9C%EC%8B%A0-%EB%A3%A8%EB%A8%B8-Apple%EC%9D%98-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%AA%A8%EB%8D%B8-%EC%B6%9C%EC%8B%9C-%EC%8B%9C%EA%B8%B0/",{"title":"Mac 최신 루머: Apple의 새로운 모델 출시 시기는? (2022년12월)"},["/docs/Finalcut/2022-12-19-Mac-최신-루머-Apple의-새로운-모델-출시-시기/","/docs/Finalcut/2022-12-19-Mac-%EC%B5%9C%EC%8B%A0-%EB%A3%A8%EB%A8%B8-Apple%EC%9D%98-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%AA%A8%EB%8D%B8-%EC%B6%9C%EC%8B%9C-%EC%8B%9C%EA%B8%B0/index.html","/docs/Finalcut/2022-12-19-Mac-최신-루머-Apple의-새로운-모델-출시-시기/README.md","/docs/Finalcut/2022-12-19-Mac-%EC%B5%9C%EC%8B%A0-%EB%A3%A8%EB%A8%B8-Apple%EC%9D%98-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%AA%A8%EB%8D%B8-%EC%B6%9C%EC%8B%9C-%EC%8B%9C%EA%B8%B0/README.md"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, meta, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta,
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: '404',
      path: '/:catchAll(.*)',
      component: Vuepress,
    }
  ]
)
