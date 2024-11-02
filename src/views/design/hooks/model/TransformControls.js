import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

export class $TransformControls {
  constructor(Camera, Dom, Scene, Controls) {
    this.transformControls = new TransformControls(Camera, Dom)
    this.Scene = Scene
    this.Controls = Controls
  }
  init() {}
  getTransformControls() {
    return this.transformControls
  }
  setControlMode() {
    return (obj, model = 'translate') => {
      if (!obj) {
        return
      }
      this.currentModel = model
      this.currentModule = obj
      const transformControls = this.transformControls

      transformControls.setMode(model) // 控制模式 scale/rotate/translate
      transformControls.attach(obj) // 控制对象
      // 解决鼠标控制器和轨迹控制器冲突
      transformControls.addEventListener(
        'dragging-changed',
        (event) => {
          this.Controls.enabled = !event.value
        },
        false
      )
      this.Scene.add(transformControls)
    }
  }
  resetControlMode() {
    if (!this.currentModule) {
      return
    }
    const setControlMode = this.setControlMode()
    setControlMode(this.currentModule, this.currentModel)
  }
  setCamera(Camera) {
    this.transformControls.camera = Camera
  }
  removeTransformControl() {
    return () => {
      this.Scene.remove(this.transformControls)
    }
  }
  addTransformControl() {
    return () => {
      this.Scene.add(this.transformControls)
    }
  }
}
