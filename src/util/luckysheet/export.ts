//导出数据
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'

export const exportJs = (luckysheet: any, value: any) => {
  //创建工作簿
  const workBook = new ExcelJS.Workbook()
  //创建表格
  if (Object.prototype.toString.call(luckysheet) === '[object Object]') {
    luckysheet = [luckysheet]
  }
  luckysheet.forEach(function (table: any) {
    if (table.data.length === 0) return true
    //添加工作表
    const worksheet = workBook.addWorksheet(table.name)
    const merge = (table.config && table.config.merge) || {}
    const borderInfo = (table.config && table.config.borderInfo) || {}
    //设置单元格合并，单元格边框，单元格样式，设置值
    setStyleAndValue(table.data, worksheet)
    setMerge(merge, worksheet)
    setBorder(borderInfo, worksheet)
    return true
  })
  const buffer = workBook.xlsx.writeBuffer().then((data) => {
    //生成blob格式
    const blob = new Blob([data], {
      type: 'application/vnd.ms-excel;charset=utf-8'
    })
    console.log('导出成功!')
    FileSaver.saveAs(blob, `${value}.xlsx`)
  })
  return buffer
}

const setMerge = (luckyMerge = {}, worksheet: any) => {
  const mergeArr = Object.values(luckyMerge)
  mergeArr.forEach((item: any) => {
    worksheet.mergeCells(item.r + 1, item.c + 1, item.rs + item.r, item.c + item.cs)
  })
}
const setBorder = function (luckyBorderInfo: any, worksheet: any) {
  if (!Array.isArray(luckyBorderInfo)) return
  luckyBorderInfo.forEach(function (elem) {
    // 现在只兼容到borderType 为range的情况
    if (elem.rangeType === 'range') {
      const border = borderConvert(elem.borderType, elem.style, elem.color)
      const rang = elem.range[0]
      const row = rang.row
      const column = rang.column
      for (let i = row[0] + 1; i < row[1] + 2; i++) {
        for (let y = column[0] + 1; y < column[1] + 2; y++) {
          worksheet.getCell(i, y).border = border
        }
      }
    }
    if (elem.rangeType === 'cell') {
      const { col_index, row_index } = elem.value
      const borderData = Object.assign({}, elem.value)
      delete borderData.col_index
      delete borderData.row_index
      const border = addborderToCell(borderData, row_index, col_index)
      worksheet.getCell(row_index + 1, col_index + 1).border = border
    }
  })
}
const setStyleAndValue = function (cellArr: any, worksheet: any) {
  if (!Array.isArray(cellArr)) return
  cellArr.forEach(function (row, rowid) {
    row.every(function (cell: any, columnid: any) {
      if (!cell) return true
      const fill = fillConvert(cell.bg)

      const font = fontConvert(cell.ff, cell.fc, cell.bl, cell.it, cell.fs, cell.cl, cell.ul)
      const alignment = alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr)
      let value: { result: any; formula: any } = {} as { result: any; formula: any }

      if (cell.f) {
        value = { formula: cell.f, result: cell.v }
      } else if (!cell.v && cell.ct && cell.ct.s) {
        // xls转为xlsx之后，内部存在不同的格式，都会进到富文本里，即值不存在与cell.v，而是存在于cell.ct.s之后
        // value = cell.ct.s[0].v
        cell.ct.s.forEach((arr: any) => {
          value += arr.v
        })
      } else {
        value = cell.v
      }
      //  style 填入到_value中可以实现填充色
      const letter = createCellPos(columnid)
      const target = worksheet.getCell(letter + (rowid + 1))
      // console.log('1233', letter + (rowid + 1))
      for (const key in fill) {
        target.fill = fill
        break
      }
      target.font = font
      target.alignment = alignment
      target.value = value

      return true
    })
  })
}

const fillConvert = function (bg: any) {
  if (!bg) {
    return {}
  }
  // const bgc = bg.replace('#', '')
  const fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: bg.replace('#', '') }
  }
  return fill
}

const fontConvert = function (ff = 0, fc = '#000000', bl = 0, it = 0, fs = 10, cl = 0, ul = 0) {
  // luckysheet：ff(样式), fc(颜色), bl(粗体), it(斜体), fs(大小), cl(删除线), ul(下划线)
  const luckyToExcel = {
    0: '微软雅黑',
    1: '宋体（Song）',
    2: '黑体（ST Heiti）',
    3: '楷体（ST Kaiti）',
    4: '仿宋（ST FangSong）',
    5: '新宋体（ST Song）',
    6: '华文新魏',
    7: '华文行楷',
    8: '华文隶书',
    9: 'Arial',
    10: 'Times New Roman ',
    11: 'Tahoma ',
    12: 'Verdana',
    num2bl: function (num: number) {
      return num === 0 ? false : true
    }
  }
  // 出现Bug，导入的时候ff为luckyToExcel的val

  return {
    name: typeof ff === 'number' ? (luckyToExcel as any)[ff as any] : ff,
    family: 1,
    size: fs,
    color: { argb: fc.replace('#', '') },
    bold: luckyToExcel.num2bl(bl),
    italic: luckyToExcel.num2bl(it),
    underline: luckyToExcel.num2bl(ul),
    strike: luckyToExcel.num2bl(cl)
  }
}

const alignmentConvert = function (vt = 'default', ht = 'default', tb = 'default', tr = 'default') {
  // luckysheet:vt(垂直), ht(水平), tb(换行), tr(旋转)
  const luckyToExcel = {
    vertical: {
      0: 'middle',
      1: 'top',
      2: 'bottom',
      default: 'top'
    },
    horizontal: {
      0: 'center',
      1: 'left',
      2: 'right',
      default: 'left'
    },
    wrapText: {
      0: false,
      1: false,
      2: true,
      default: false
    },
    textRotation: {
      0: 0,
      1: 45,
      2: -45,
      3: 'vertical',
      4: 90,
      5: -90,
      default: 0
    }
  }

  return {
    vertical: (luckyToExcel.vertical as any)[vt as any] as any,
    horizontal: (luckyToExcel.horizontal as any)[ht as any] as any,
    wrapText: (luckyToExcel.wrapText as any)[tb as any] as any,
    textRotation: (luckyToExcel.textRotation as any)[tr as any] as any
  }
}

const borderConvert = function (borderType: any, style = 1, color = '#000') {
  // 对应luckysheet的config中borderinfo的的参数
  if (!borderType) {
    return {}
  }
  const luckyToExcel = {
    type: {
      'border-all': 'all',
      'border-top': 'top',
      'border-right': 'right',
      'border-bottom': 'bottom',
      'border-left': 'left'
    },
    style: {
      0: 'none',
      1: 'thin',
      2: 'hair',
      3: 'dotted',
      4: 'dashDot', // 'Dashed',
      5: 'dashDot',
      6: 'dashDotDot',
      7: 'double',
      8: 'medium',
      9: 'mediumDashed',
      10: 'mediumDashDot',
      11: 'mediumDashDotDot',
      12: 'slantDashDot',
      13: 'thick'
    }
  }
  const template = {
    style: (luckyToExcel.style as any)[style as any],
    color: { argb: color.replace('#', '') }
  }
  const border = {}
  if ((luckyToExcel.type as any)[borderType as any] === 'all') {
    ;(border as any)['top'] = template
    ;(border as any)['right'] = template
    ;(border as any)['bottom'] = template
    ;(border as any)['left'] = template
  } else {
    ;(border as any)[(luckyToExcel.type as any)[borderType as any]] = template
  }
  // console.log('border', border)
  return border
}

function addborderToCell(borders: any, row_index: number, col_index: number) {
  const border = {}
  const luckyExcel = {
    type: {
      l: 'left',
      r: 'right',
      b: 'bottom',
      t: 'top'
    },
    style: {
      0: 'none',
      1: 'thin',
      2: 'hair',
      3: 'dotted',
      4: 'dashDot', // 'Dashed',
      5: 'dashDot',
      6: 'dashDotDot',
      7: 'double',
      8: 'medium',
      9: 'mediumDashed',
      10: 'mediumDashDot',
      11: 'mediumDashDotDot',
      12: 'slantDashDot',
      13: 'thick'
    }
  }
  // console.log('borders', borders)
  for (const bor in borders) {
    // console.log(bor)
    if (borders[bor].color.indexOf('rgb') === -1) {
      ;(border as any)[(luckyExcel.type as any)[bor as any]] = {
        style: (luckyExcel.style as any)[(borders as any)[bor as any].style],
        color: { argb: borders[bor].color.replace('#', '') }
      }
    } else {
      ;(border as any)[(luckyExcel.type as any)[bor as any]] = {
        style: (luckyExcel.style as any)[borders[bor as any].style],
        color: { argb: borders[bor].color }
      }
    }
  }

  return border
}

function createCellPos(n: number) {
  const ordA = 'A'.charCodeAt(0)

  const ordZ = 'Z'.charCodeAt(0)
  const len = ordZ - ordA + 1
  let s = ''
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s

    n = Math.floor(n / len) - 1
  }
  return s
}
