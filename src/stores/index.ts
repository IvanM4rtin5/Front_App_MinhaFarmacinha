import { createPinia } from 'pinia'
import { defineStore } from '#q-app/wrappers'
import piniaPersist from 'pinia-plugin-persistedstate'

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PiniaCustomProperties {
    // add your custom properties here, if any
  }
}



export default defineStore((/* { ssrContext } */) => {
  const pinia = createPinia()
  pinia.use(piniaPersist)

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia
})
