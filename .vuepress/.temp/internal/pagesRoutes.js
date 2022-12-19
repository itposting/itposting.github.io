import { Vuepress } from '@vuepress/client'

const routeItems = [
  ["v-8daa1a0e","/",{"title":""},["/index.html","/README.md"]],
  ["v-3e214e9b","/About/",{"title":"Today I Learned"},["/About/index.html","/About/README.md"]],
  ["v-487af05f","/docs/Finalcut/2022-12-19-%ED%8C%8C%EC%9D%B4%EB%84%90%EC%BB%B7-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EC%83%9D%EC%84%B1-%EB%B0%A9%EB%B2%95/",{"title":"파이널컷 라이브러리 생성 방법"},["/docs/Finalcut/2022-12-19-파이널컷-라이브러리-생성-방법/","/docs/Finalcut/2022-12-19-%ED%8C%8C%EC%9D%B4%EB%84%90%EC%BB%B7-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EC%83%9D%EC%84%B1-%EB%B0%A9%EB%B2%95/index.html","/docs/Finalcut/2022-12-19-파이널컷-라이브러리-생성-방법/README.md","/docs/Finalcut/2022-12-19-%ED%8C%8C%EC%9D%B4%EB%84%90%EC%BB%B7-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EC%83%9D%EC%84%B1-%EB%B0%A9%EB%B2%95/README.md"]],
  ["v-3706649a","/404.html",{"title":""},["/404"]],
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
