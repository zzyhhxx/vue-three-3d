import {
  PlaneGeometry,
  MeshBasicMaterial,
  MeshDepthMaterial,
  OrthographicCamera,
  WebGLRenderTarget,
  Mesh,
  Group,
  ShaderMaterial,
  Color
} from 'three/build/three.module.js'
const HorizontalBlurShader = {
  uniforms: { tDiffuse: { value: null }, h: { value: 1 / 512 } },
  vertexShader:
    '\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvUv = uv;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n\t\t}',
  fragmentShader:
    '\n\n\t\tuniform sampler2D tDiffuse;\n\t\tuniform float h;\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvec4 sum = vec4( 0.0 );\n\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;\n\n\t\t\tgl_FragColor = sum;\n\n\t\t}'
}
const VerticalBlurShader = {
  uniforms: { tDiffuse: { value: null }, v: { value: 1 / 512 } },
  vertexShader:
    '\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvUv = uv;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n\t\t}',
  fragmentShader:
    '\n\n\t\tuniform sampler2D tDiffuse;\n\t\tuniform float v;\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvec4 sum = vec4( 0.0 );\n\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;\n\n\t\t\tgl_FragColor = sum;\n\n\t\t}'
}
export class $Shadow {
  constructor(Scene, Renderer, ModuleGroup) {
    this.Scene = Scene
    this.Renderer = Renderer
    this.group = ModuleGroup
    this.shadow = null
    this.shadowCamera = null
    this.blurPlane = null
    this.renderTarget = null
    this.shadowGroup = null
  }
  // 添加阴影
  addLightShadow() {
    const { Scene } = this
    return (options) => {
      if (this.shadowGroup) {
        return this.shadowGroup
      }
      let t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 200,
        n =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 200,
        r =
          arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 100,
        o =
          arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1028
      this.settings = options
      this.resolution = o
      this.shadowCamera = new OrthographicCamera(
        -t / 2,
        t / 2,
        n / 2,
        -n / 2,
        0,
        r
      )
      this.shadowCamera.rotation.x = Math.PI / 2
      this.renderTarget = new WebGLRenderTarget(o, o)
      this.renderTargetBlur = new WebGLRenderTarget(o, o)
      this.renderTargetBlur.texture.generateMipmaps =
        this.renderTarget.texture.generateMipmaps = !1
      this.planeGeometry = new PlaneGeometry(t, n).rotateX(Math.PI / 2)
      this.blurPlane = new Mesh(this.planeGeometry)
      this.depthMaterial = new MeshDepthMaterial()
      this.depthMaterial.depthTest = this.depthMaterial.depthWrite = !1
      this.depthMaterial.onBeforeCompile = (e) => {
        e.fragmentShader = `\n                ${e.fragmentShader.replace(
          'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
          'gl_FragColor = vec4( vec3( 0.5 ), ( 1.0 - fragCoordZ ) * 1.0 );'
        )}\n        \t\t\t`
      }
      this.horizontalBlurMaterial = new ShaderMaterial(HorizontalBlurShader)
      this.verticalBlurMaterial = new ShaderMaterial(VerticalBlurShader)
      this.verticalBlurMaterial.depthTest =
        this.horizontalBlurMaterial.depthTest = !1
      const l = new MeshBasicMaterial({
        map: this.renderTarget.texture,
        opacity: this.settings.opacity,
        transparent: !0,
        color: new Color(this.settings.color)
      })
      this.shadow = new Mesh(this.planeGeometry, l)
      this.shadow.scale.y = -1
      // this.shadow.position.y = this.settings.height
      this.shadow.material.color = new Color(this.settings.color)
      console.log('color', this.settings)
      this.animate()
      this.shadowGroup = new Group()
      this.shadowGroup.name = 'shadow-group'
      this.shadowGroup.add(...[this.shadowCamera, this.shadow, this.blurPlane])
      Scene.add(this.shadowGroup)
      this.shadowGroup.visible = true
      this.shadowGroup.position.y = this.settings.height
      return this.shadowGroup
    }
  }
  animate(color) {
    const { Scene, Renderer } = this
    const e = Scene.background
    Scene.background = null
    Scene.overrideMaterial = this.depthMaterial
    Renderer.setRenderTarget(this.renderTarget)
    Renderer.render(this.group, this.shadowCamera)
    Scene.overrideMaterial = null
    this.blurShadow(this.settings.blur)
    this.blurShadow(0.4 * this.settings.blur)
    this.shadow.material.opacity = this.settings.opacity
    this.shadow.material.color = new Color(this.settings.color)
    // this.shadow.position.y = this.settings.height
    Renderer.setRenderTarget(null)
    Scene.background = e
  }
  blurShadow(e) {
    const { Renderer } = this
    this.blurPlane.visible = !0
    this.blurPlane.material = this.horizontalBlurMaterial
    this.blurPlane.material.uniforms.tDiffuse.value = this.renderTarget.texture
    this.horizontalBlurMaterial.uniforms.h.value = (1 * e) / this.resolution
    Renderer.setRenderTarget(this.renderTargetBlur)
    Renderer.render(this.blurPlane, this.shadowCamera)
    this.blurPlane.material = this.verticalBlurMaterial
    this.blurPlane.material.uniforms.tDiffuse.value =
      this.renderTargetBlur.texture
    this.verticalBlurMaterial.uniforms.v.value = (1 * e) / this.resolution
    Renderer.setRenderTarget(this.renderTarget)
    Renderer.render(this.blurPlane, this.shadowCamera)
    this.blurPlane.visible = !1
  }
  // 显示隐藏阴影
  shadowSwitch() {
    return () => {
      if (!this.shadowGroup) {
        return
      }
      this.shadowGroup.visible = !this.shadowGroup.visible
    }
  }
  getShadowStatus() {
    return !!(this.shadowGroup && this.shadowGroup.visible)
  }
  // 阴影颜色
  changeLightShadow() {
    return (option) => {
      const { shadow } = this
      if (!shadow || !shadow.visible) {
        return
      }
      this.settings = {
        ...this.settings,
        ...option
      }
      if (option.height !== undefined) {
        this.shadowGroup.position.y = option.height
      }
    }
  }
}
