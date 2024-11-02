import { WebGLRenderer, sRGBEncoding } from 'three/build/three.module.js'

export class $Renderer {
  constructor(Camera) {
    this.Renderer = new WebGLRenderer({
      antialias: true,
      alpha: true //开启alpha 是否可以设置背景色透明
    })
    this.Camera = Camera
    this.addAutoResize()
  }
  init() {
    const Renderer = this.Renderer
    Renderer.setPixelRatio(window.devicePixelRatio)
    Renderer.setSize(window.innerWidth, window.innerHeight)
    Renderer.inputEncoding = true
    Renderer.outputEncoding = sRGBEncoding
  }
  getRenderer() {
    return this.Renderer
  }
  getRendererDom() {
    return this.Renderer.domElement
  }
  // 自适应
  addAutoResize() {
    const { Camera, Renderer } = this
    const onWindowResize = () => {
      Camera.aspect = window.innerWidth / window.innerHeight
      Camera.updateProjectionMatrix()
      Renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onWindowResize, false)
    this.onWindowResize = onWindowResize
  }
  removeAutoResize() {
    window.removeEventListener('resize', this.onWindowResize, false)
  }
  destroyed() {
    const { Renderer } = this
    Renderer.dispose()
    Renderer.content = null
    this.removeAutoResize()
  }
}
