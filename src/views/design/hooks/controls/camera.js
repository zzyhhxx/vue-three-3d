import bus from '@/libs/mitt/mitt'
import { useStore } from 'vuex'
import { reactive, provide, computed } from 'vue'
import { deepClone } from '@/utils/common'
const defaultCameraSetting = require('@/config/camera-config')

export function cameraControl(options) {
  const { Camera, cameraReset, usePerCamera, useOrtCamera, $CameraInstance } =
    options
  const store = useStore()
  const state = reactive({
    cameraSettings: deepClone(defaultCameraSetting)
  })

  provide(
    'cameraSettings',
    computed({
      get: () => {
        return state.cameraSettings
      }
    })
  )

  // 重置相机
  const resetCamera = () => {
    cameraReset()
  }
  bus.on('resetCamera', resetCamera)

  const init = (options) => {
    const { camera } = options || {}
    if (!camera) {
      changeCamera(defaultCameraSetting.type)
      changeCameraDirect(defaultCameraSetting.direct)
      return
    }
    changeCamera(camera.type)
    cameraReset(camera.position)
    // changeCameraZoom(camera.zoom)
  }

  // 设置相机的透视比例
  const changeCameraZoom = (zoom) => {
    console.log('设置相机透视比例', zoom)
    if (Camera.isPerspectiveCamera) {
      Camera.zoom = zoom
      Camera.updateProjectionMatrix()
      state.cameraSettings.zoom = zoom
    }
  }
  bus.on('changeCameraZoom', changeCameraZoom)

  // 切换相机位置
  const changeCameraDirect = (dir) => {
    switch (dir) {
      case 'top':
        cameraReset({ x: 0, y: 100, z: 0 })
        break
      case 'right':
        cameraReset({ x: 100, y: 0, z: 0 })
        break
      case 'left':
        cameraReset({ x: -100, y: 0, z: 0 })
        break
      case 'front':
        cameraReset()
        break
    }
    state.cameraSettings.direct = dir
  }
  bus.on('changeCameraDirect', changeCameraDirect)

  // 点击放大
  const enlargeModule = () => {
    Camera.fov = Camera.fov - 10
    Camera.updateProjectionMatrix()
  }
  bus.on('enlargeModule', enlargeModule)

  // 点击缩小
  const reduceModule = () => {
    Camera.fov = Camera.fov + 10
    Camera.updateProjectionMatrix()
  }
  bus.on('reduceModule', reduceModule)

  // 切换相机
  const changeCamera = (type) => {
    switch (type) {
      case 'ort':
        useOrtCamera()
        break
      case 'per':
        usePerCamera()
        break
    }
    state.cameraSettings.type = type
  }
  bus.on('changeCamera', changeCamera)

  store.commit('setGetCameraDataFun', () => {
    return {
      ...state.cameraSettings,
      position: {
        x: Camera.position.x,
        y: Camera.position.y,
        z: Camera.position.z
      },
      lookAt: {
        x: Camera.lookAt.x,
        y: Camera.lookAt.y,
        z: Camera.lookAt.z
      }
    }
  })
  return {
    init
  }
}
