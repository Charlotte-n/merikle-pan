/// <reference types="vite/client" />
declare module 'spark-md5'
interface ImportMetaEnv {
  readonly: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import { Component } from 'vue'
  const component: Component
  export default component
}
