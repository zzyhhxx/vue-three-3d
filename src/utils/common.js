// 图片转base64
export function getBase64Image(img, type = 'png') {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var dataURL = canvas.toDataURL('image/' + type)
  return dataURL
}
// 转换图片获取
export function getImageWithChange(
  imgUrl,
  rotate = 0,
  flip = 1,
  upsideDown = 1
) {
  return new Promise((resolve) => {
    var img = new Image()
    img.setAttribute('crossOrigin', 'Anonymous')
    img.src = imgUrl
    img.onload = function () {
      var canvas = document.createElement('canvas')

      canvas.width = img.width
      canvas.height = img.height
      if (rotate % 360 === 90 || rotate % 360 === 270) {
        canvas.width = img.height
        canvas.height = img.width
      }
      var ctx = canvas.getContext('2d')
      let tranX = canvas.width / 2
      let tranY = canvas.height / 2
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'destination-over'
      // 将画布的0点（旋转中心点）平移到图片的中心再进行旋转
      ctx.translate(tranX, tranY)
      // 旋转
      ctx.rotate((rotate * Math.PI) / 180)
      // 翻转
      ctx.scale(flip, upsideDown)

      ctx.translate(-tranX, -tranY)
      ctx.drawImage(
        img,
        canvas.width / 2 - img.width / 2,
        canvas.height / 2 - img.height / 2
      )
      ctx.translate(tranX, tranY)
      // 旋转
      ctx.rotate((-rotate * Math.PI) / 180)
      // 翻转
      ctx.scale(flip, upsideDown)
      ctx.translate(-tranX, -tranY)
      ctx.restore()

      var dataURL = canvas.toDataURL('image/png', 1)
      resolve(dataURL)
    }
  })
}
export function generateUUID() {
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    }
  )
  return uuid
}

export function colorChangeRgbToHex(options = {}) {
  if (Object.keys(options).length) {
    let { r, g, b } = options
    r = Number((255 * r).toFixed(0))
    g = Number((255 * g).toFixed(0))
    b = Number((255 * b).toFixed(0))
    let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    return hex
  } else {
    return options
  }
}
export function colorChangeHexToRgb(val) {
  //HEX十六进制颜色值转换为RGB(A)颜色值
  // 16进制颜色值的正则
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 把颜色值变成小写
  var color = val.toLowerCase()
  var result = ''
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      var colorNew = '#'
      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
      }
      color = colorNew
    }
    // 处理六位的颜色值，转为RGB
    var colorChange = []
    for (var i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
    }
    result = 'rgb(' + colorChange.join(',') + ')'
    return {
      rgb: result,
      r: colorChange[0],
      g: colorChange[1],
      b: colorChange[2]
    }
  } else {
    return false
  }
}

// 深拷贝
export function deepClone(obj) {
  var objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object' && obj != null) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key])
        } else {
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}
//'yyyy-MM-dd hh:mm:ss', new Date(timestamp * 1000)
export function timeFormat(timestamp, format = 'yyyy-MM-dd hh:mm:ss') {
  let d = new Date(timestamp * 1000)
  if (d == null) {
    d = new Date()
  }
  var date = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    'S+': d.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (d.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? date[k]
          : ('00' + date[k]).substr(('' + date[k]).length)
      )
    }
  }
  return format
}

export function formatFix2(index) {
  return Number(parseFloat(index).toFixed(2))
}
