//连接quill编辑器
//@ts-ignore
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import 'quill/dist/quill.snow.css'

export class MyQuill {
  quill
  constructor(selector: any) {
    Quill.register('modules/cursors', QuillCursors, true)
    this.quill = new Quill(selector, {
      modules: {
        cursors: true,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],
          ['link', 'image', 'video', 'formula'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],

          ['clean'] // remove formatting button
        ]
      },
      placeholder: '请输入内容',
      theme: 'snow'
    })
  }
  //获取焦点
  focus() {
    this.quill.focus()
  }

  //撤销
  undo() {
    this.quill.history.undo()
  }

  //重做
  redo() {
    this.quill.history.redo()
  }

  //清空
  clear() {
    this.quill.setText('')
    //重新获取焦点
    this.focus()
  }
  //插入文字
  insertText(_t: any) {
    const { index } = this.quill.getSelection(true)
    this.quill.insertText(index, _t)
  }
  //获取当前光标
  getCurrentCursor() {
    return this.quill.getSelection(true)
  }
  //添加嵌入式内容
  insertEmbed(index: number, type: any, value: any) {
    this.quill.insertEmbed(index || this.getCurrentCursor(), type, value)
  }
  //获取当前编辑器的detail数据格式
  getDetail() {
    return this.quill.getContents()
  }

  //初始化文本编辑器
  init(data: any) {
    let detail: any = ''
    const _T = data.replace(/[\r]/g, '#r#').replace(/[\n]/g, '#n#').replace(/[\t]/g, '#t#')
    try {
      detail = JSON.parse(_T)
      console.log(detail)
    } catch (e) {}
    /**
     * 需要先处理特殊字符，不然转不了JSON
     * 然后再根据特性，转回来，不然该换行的地方没有换行
     * emoji 转码
     */
    this.quill.setContents(detail)
  }
}
