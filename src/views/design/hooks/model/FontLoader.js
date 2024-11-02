import { MeshPhysicalMaterial, Mesh } from 'three/build/three.module.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { deepClone } from '../../../../utils/common'
const fontConfg = require('@/config/font-config')
export class $FontLoader {
  constructor(group) {
    this.group = group
    this.Textloader = new FontLoader()
    this.fontConfg = [...fontConfg.fonts.enFonts, ...fontConfg.fonts.chFonts]
    this.materials = {
      clay: {
        roughness: 1,
        metalness: 0,
        transmission: 0,
        thickness: 0,
        clearcoat: 0,
        clearcoatRoughness: 0
      },
      basic: {
        roughness: 0.5,
        metalness: 0.5,
        transmission: 0,
        thickness: 1,
        clearcoat: 0,
        clearcoatRoughness: 0
      },
      metalic: {
        roughness: 0.2,
        metalness: 1,
        transmission: 0,
        thickness: 0,
        clearcoat: 0,
        clearcoatRoughness: 0
      },
      glass: {
        roughness: 0.67,
        metalness: 0,
        transmission: 1,
        thickness: 1,
        clearcoat: 0,
        clearcoatRoughness: 0
      },
      transparentPlastic: {
        metalness: 1,
        roughness: 0.25,
        opacity: 0.2,
        transparent: !0,
        transmission: 1,
        thickness: 1,
        clearcoat: 0,
        clearcoatRoughness: 0
      }
    }
    this.fonts = {}
  }
  async load(options) {
    const { uuname, settings } = options || {}
    let type = settings.font || fontConfg.defaultFont
    let textContent = settings.text || fontConfg.defaultText
    const font = await this.loadFont(type)
    if (!font) {
      return {}
    }
    this.fonts[type] = font
    let textgeometry = new TextGeometry(textContent, {
      font: font,
      size: 14, // 字号
      height: 1, // 文字厚度
      weight: 'normal', // 字粗细 normal bold
      curveSegments: 24, // 弧线分段数，使得文字的曲线更加光滑
      bevelEnabled: true, // 布尔值，是否使用倒角，意为在边缘处斜切
      bevelThickness: 0, // 倒角厚度
      bevelSize: 0, // 倒角宽度
      // bevelSegments: 50
      ...(settings.fontConfig || {})
    })
    let meshMaterial = new MeshPhysicalMaterial()
    let mesh = new Mesh(textgeometry, meshMaterial)
    mesh.position.set(-300, 0, 0)
    this.group.add(mesh)
    mesh.uuname = uuname
    return { scene: mesh }
  }
  loadFont(type) {
    let selectedFont = this.fontConfg.find((item) => item.type === type)
    return new Promise((resolve) => {
      if (this.fonts[type]) {
        resolve(this.fonts[type])
        return
      }
      if (!selectedFont) {
        resolve()
        return
      }
      this.Textloader.load(
        selectedFont.url,
        //加载好字体后创建三维文字
        function (font) {
          resolve(font)
        },
        //加载进度
        function (xhr) {},
        //出现错误
        function (err) {
          resolve()
          console.log(err)
        }
      )
    })
  }
  async changeFont(scene, text, type) {
    const font = await this.loadFont(type)
    if (!font) {
      return
    }
    scene.geometry = new TextGeometry(text, {
      ...scene.geometry.parameters.options,
      font
    })
  }

  changeText(scene, text) {
    scene.geometry = new TextGeometry(text, {
      ...scene.geometry.parameters.options
    })
  }
  changeConfig(scene, text, config) {
    scene.geometry = new TextGeometry(text, {
      ...scene.geometry.parameters.options,
      ...config
    })
  }
  changeType(data, type) {
    if (!data) {
      return
    }
    const scene = data.module
    const settings = data.settings
    const material = scene.material
    const config = deepClone(this.materials[type])
    material.metalness = config.metalness
    material.roughness = config.roughness
    material.thickness = config.thickness
    material.clearcoat = config.clearcoat
    material.clearcoatRoughness = config.clearcoatRoughness
    material.transmission = config.transmission
    material.needsUpdate = true
    material.color.set(settings.color)
  }
}
