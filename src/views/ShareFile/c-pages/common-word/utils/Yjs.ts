//封装一下Yjs
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from 'y-quill'

export class MyYjs {
  ydoc: any
  constructor(quill: any, roomName: string) {
    this.ydoc = new Y.Doc()
    const yText = this.ydoc.getText('quill')
    const provider = new WebsocketProvider('ws://localhost:1234', roomName, this.ydoc)
    //y-websocket
    new QuillBinding(yText, quill.quill)
  }
}
