//封装一下Yjs
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from 'y-quill'

export class MyYjs {
  ydoc: any
  provider: any
  quill: any
  updateCursor: any
  deleteCursor: any
  constructor(
    quill: any,
    roomName: string,
    username: string,
    updateCursor: (clientId: number, user: { name: string; color: string }, index: number) => void,
    deleteCursor: (clientId: number) => void
  ) {
    //创建文档
    this.ydoc = new Y.Doc()
    this.quill = quill.quill
    this.updateCursor = updateCursor
    this.deleteCursor = deleteCursor
    //创建共享类型
    const yText = this.ydoc.getText('quill')
    //websocket连接
    const provider = new WebsocketProvider('ws://localhost:1234', `${roomName}/merikle`, this.ydoc)
    this.provider = provider
    this.setupAwareness(username)
    this.setupCursorTracking()

    //监听事件
    provider.on('status', (event: any) => {
      if (event.status === 'connected') {
        console.log('连接成功')
      }
    })

    // 错误处理
    provider.on('error', (event: any) => {
      console.log('连接失败', event)
    })
    //y-websocket
    new QuillBinding(yText, quill.quill)
  }

  setupAwareness(userName: string) {
    this.provider.awareness.setLocalState({
      user: {
        name: userName,
        color: this.getRandomColor()
      }
    })
  }

  //光标的追踪，获取到这个用户在文档上的位置
  setupCursorTracking() {
    //追踪用户的位置
    this.quill.on('selection-change', (range: any) => {
      if (range) {
        this.provider.awareness.setLocalState({
          ...this.provider.awareness.getLocalState(),
          cursor: range
        })
      }
    })

    this.provider.awareness.on('change', () => {
      this.updateRemoteCursors()
    })
  }

  //对获取到的光标进行处理，然后去展示光标
  updateRemoteCursors() {
    const states = this.provider.awareness.getStates()
    console.log(states)
    states.forEach((state: any, clientId: number) => {
      if (state.user) {
        if (clientId !== this.provider.awareness.clientID && state.cursor) {
          this.updateCursor(clientId, state.user, state.cursor.index)
        }
      } else {
        //如果用户离开就移除用户
        this.deleteCursor(clientId)
      }
    })
  }

  getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  }
}
