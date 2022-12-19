import { defineAsyncComponent } from 'vue'

export const layoutComponents = {
  "404": defineAsyncComponent(() => import("/Users/user/Desktop/Blog/itposting.github.io/node_modules/@vuepress/theme-default/lib/client/layouts/404.vue")),
  "Layout": defineAsyncComponent(() => import("/Users/user/Desktop/Blog/itposting.github.io/.vuepress/theme/layouts/Layout.vue")),
}
