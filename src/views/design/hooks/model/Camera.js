import {
  PerspectiveCamera,
  OrthographicCamera
} from 'three/build/three.module.js'
import gsap from 'gsap'
import { CSSRulePlugin } from 'gsap/CSSRulePlugin'
gsap.registerPlugin(CSSRulePlugin)
const defaultCameraSetting = require('@/config/camera-config')
export class $Camera {
  constructor() {
    // 透视相机
    const { innerWidth, innerHeight } = window
    this.preCamera = new PerspectiveCamera(
      45,
      innerWidth / innerHeight,
      1,
      1000
    )
    // 正交相机
    let width = innerWidth //窗口宽度
    let height = innerHeight //窗口高度
    let k = width / height //窗口宽高比
    let s = 150 //三维场景显示范围控制系数，系数越大，显示的范围越大
    this.ortCamera = new OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)

    this.currentCamera = this.preCamera

    // 首页进入相机的视角
    this.cameraPosition = { ...defaultCameraSetting.position }
    this.cameraLookat = { ...defaultCameraSetting.lookAt }
  }
  init() {
    this.currentCamera.position.set(...Object.values(this.cameraPosition))
    this.currentCamera.lookAt(...Object.values(this.cameraLookat))
    this.currentCamera.updateProjectionMatrix()
  }
  getPreCamera() {
    return this.preCamera
  }
  usePreCamera() {
    this.currentCamera = this.preCamera
    return this.getPreCamera()
  }
  getOrtCamera() {
    return this.ortCamera
  }
  useOrtCamera() {
    this.currentCamera = this.ortCamera
    return this.getOrtCamera()
  }
  resetCamera(Controls) {
    return (position, lookAt, time = 1) => {
      const Camera = this.currentCamera
      if (!position) {
        position = this.cameraPosition
      }
      if (!lookAt) {
        lookAt = this.cameraLookat
      }
      gsap.to(Camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: time,
        ease: 'power4.out'
        // onComplete: function () {
        // 这是相机运动完成的回调,可以执行其他的方法.
        // }
      })
      gsap.to(Camera.lookAt, {
        x: lookAt.x,
        y: lookAt.y,
        z: lookAt.z,
        duration: time,
        ease: 'power4.out'
      })
      gsap.to(Controls.target, {
        x: lookAt.x,
        y: lookAt.y,
        z: lookAt.z,
        duration: time,
        ease: 'power4.out'
      })
    }
  }
  changeZoom(zoom) {
    this.currentCamera.zoom = zoom
  }
}
