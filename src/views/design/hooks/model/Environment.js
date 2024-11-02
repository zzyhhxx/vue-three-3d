import {
  AmbientLight,
  HemisphereLight,
  PMREMGenerator,
  Texture,
  LinearFilter,
  Color
} from 'three/build/three.module.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
const eachOf = (a, e) => {
  var i = 0
  const t = a.length
  for (; i < t; ) e(a[i], i++)
}
export class $Environment {
  constructor(Scene, Renderer, Camera, lightConfig) {
    // 环境光
    this.ambient = new AmbientLight(
      lightConfig.ambient.color,
      lightConfig.ambient.intensity
    )
    // 户外环境光源
    this.hemiLight = new HemisphereLight(
      lightConfig.hemiLight.skyColor,
      lightConfig.hemiLight.groundColor,
      lightConfig.hemiLight.intensity
    )
    this.Scene = Scene
    this.Renderer = Renderer
    this.gradientCanvas = null
    this.Camera = Camera
    this.width = 0
    this.height = 0
  }
  init() {
    const { hemiLight, ambient, Scene } = this
    // 添加自然光
    hemiLight.position.set(0, 500, 0)
    Scene.add(hemiLight)
    // 添加环境光
    Scene.add(ambient)
  }
  getAmbient() {
    return this.ambient
  }
  getHemiLight() {
    return this.hemiLight
  }
  loadHdrEnv() {
    const { Renderer, Scene } = this
    const pmremGenerator = new PMREMGenerator(Renderer)
    pmremGenerator.compileEquirectangularShader()
    return (url) => {
      return new Promise((resolve) => {
        new RGBELoader().load(url, function (texture) {
          const envMap = pmremGenerator.fromEquirectangular(texture).texture
          // envMap.isPmremTexture = true;
          pmremGenerator.dispose()

          Scene.environment = envMap // 给场景添加环境光效果
          // Scene.background = envMap // 给场景添加背景图
          resolve()
        })
      })
    }
  }
  changeBgColor(color) {
    if(!color) {
      return
    }
    this.Renderer.setClearColor(color, 0)
    this.Scene.background = new Color(color)
  }
  createGradientBackground(e) {
    this.width = e.width;
    this.height = e.height;
    this.Renderer.setClearColor(0, 0)
    this.gradientCanvas = document.createElement('canvas')
    this.gradientCanvas.id = 'new'
    const t = this.gradientCanvas.getContext('2d')
    t.canvas.width = e.width
    t.canvas.height = e.height
    const n = (e.angle + 90) * (Math.PI / 180)
    t.fillStyle = this.createGradient(n, [e.color, e.color2], t)
    t.fillRect(0, 0, e.width, e.height)
    const r = new Texture(this.gradientCanvas)
    r.minFilter = LinearFilter
    r.needsUpdate = true
    this.Scene.background = r
  }
  changeGradientBackground(e) {
    this.width = e.width;
    this.height = e.height;
    this.Renderer.setClearColor(0, 0)
    const t = this.gradientCanvas.getContext('2d')
    let n = (e.angle + 90) * (Math.PI / 180)
    t.fillStyle = this.createGradient(n, [e.color, e.color2], t)
    t.fillRect(0, 0, e.width, e.height)
    this.Scene.background.needsUpdate = true
  }
  createGradient(e, t, n) {
    let r =
        Math.sqrt(this.width * this.width + this.height * this.height) /
        2,
      o = Math.asin(this.height / 2 / r),
      l = ((e % (2 * Math.PI)) + 4 * Math.PI) % (2 * Math.PI)
    l > Math.PI && (l -= Math.PI),
      l > Math.PI / 2 &&
        l <= Math.PI &&
        (l = Math.PI / 2 - (l - Math.PI / 2))
    let c = Math.PI / 2 - o - Math.abs(l),
      h = Math.abs(o - Math.abs(l)),
      d = Math.cos(c) * this.height,
      f = Math.cos(h) * this.width,
      m = Math.max(f, d) / 2,
      v = Math.cos(e) * m,
      y = Math.sin(e) * m
    const g = n.createLinearGradient(
      this.width / 2 + v,
      this.height / 2 + y,
      this.width / 2 - v,
      this.height / 2 - y
    )
    return (
      eachOf(
        t,
        (col, i) => col && g.addColorStop(i / (t.length - 1), col)
      ),
      g
    )
  }
}
