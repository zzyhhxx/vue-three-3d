import {
  PointLight,
  PointLightHelper,
  DirectionalLight,
  DirectionalLightHelper,
  SpotLight,
  SpotLightHelper
} from 'three/build/three.module.js'

export class $Light {
  constructor(Scene, group) {
    this.Scene = Scene
    this.group = group
  }
  // 添加点光源和辅助对象
  addPointLight() {
    return (options) => {
      const { color = '#ffffff', position, distance, intensity } = options || {}
      const pointLight = new PointLight(color, intensity, distance)
      this.group.add(pointLight)
      const pointLightHelper = new PointLightHelper(pointLight, 1, '#666666')
      pointLightHelper.matrixAutoUpdate = true // 可使用鼠标控制器移动位置
      this.group.add(pointLightHelper)
      return pointLightHelper
    }
  }
  // 添加平行光源和辅助对象
  addDirectLight() {
    return (options) => {
      const { color = '#ffffff', position, intensity } = options || {}
      const light = new DirectionalLight(color, intensity)
      this.group.add(light)
      const helper = new DirectionalLightHelper(light, 1, '#666666')
      helper.matrixAutoUpdate = true // 可使用鼠标控制器移动位置
      this.group.add(helper)
      return helper
    }
  }
  // 添加聚光源和辅助对象
  addSpotLight() {
    return (options) => {
      const {
        color = '#ffffff',
        position,
        distance,
        intensity,
        angle
      } = options || {}
      const spotLight = new SpotLight(color, intensity)
      spotLight.angle = Math.PI / angle
      spotLight.distance = distance
      this.group.add(spotLight)
      const spotLightHelper = new SpotLightHelper(spotLight, '#666666')
      spotLightHelper.matrixAutoUpdate = true // 可使用鼠标控制器移动位置
      this.group.add(spotLightHelper)
      return spotLightHelper
    }
  }
}
