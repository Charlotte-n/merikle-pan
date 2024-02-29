/// <reference types="vite/client" />
declare module 'spark-md5'
interface ImportMetaEnv {
  readonly: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
