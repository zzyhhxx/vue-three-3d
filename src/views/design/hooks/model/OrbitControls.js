import { Vector3 } from 'three/build/three.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' //控制器

export class $OrbitControls {
  constructor(Camera, Dom) {
    this.Controls = new OrbitControls(Camera, Dom)
  }
  init() {
    const Controls = this.Controls
    Controls.target = new Vector3(0, 0, 0)
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    Controls.enableDamping = false
    // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
    Controls.dampingFactor = 20
    // 是否可以旋转
    Controls.enableRotate = true
    // 是否可以缩放与速度
    Controls.enableZoom = true
    // 设置相机距离原点的最远距离
    Controls.minDistance = 1
    // 设置相机距离原点的最远距离
    Controls.maxDistance = 2000
    // 是否开启右键拖拽 shift加左键也可以
    Controls.enablePan = true
  }
  getControls() {
    return this.Controls
  }
  setCamera(Camera) {
    this.Controls.object = Camera
  }
}
