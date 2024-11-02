import { Group, Color } from 'three/build/three.module.js'
import { ref, onMounted, onUnmounted } from 'vue'
import { $Camera } from './model/Camera'
import { $OrbitControls } from './model/OrbitControls'
import { $TransformControls } from './model/TransformControls'
import { $Renderer } from './model/Renderer'
import { $GLTFLoader } from './model/GLTFLoader'
import { $FontLoader } from './model/FontLoader'
import { $Environment } from './model/Environment'
import { $Light } from './model/Light'
import { $Shadow } from './model/Shadow'
import { $Scene } from './model/Scene'
import { $GeometryHandler } from './model/GeometryLoader'
import { lightConfig } from '@/config/light-config'

export function initScene() {
  const threeDom = ref(null)
  const loading = ref(false)
  const $SceneInstance = new $Scene()
  const Scene = $SceneInstance.getScene()

  // 相机
  const $CameraInstance = new $Camera()
  let Camera = $CameraInstance.getPreCamera()

  // 渲染器
  const $RendererInstance = new $Renderer(Camera)
  const Renderer = $RendererInstance.getRenderer()
  const RendererDom = $RendererInstance.getRendererDom()

  // 轨道控制器
  const $OrbitControlsInstance = new $OrbitControls(Camera, RendererDom)
  const Controls = $OrbitControlsInstance.getControls()

  // 鼠标控制器
  const $TransformControlInstance = new $TransformControls(
    Camera,
    RendererDom,
    Scene,
    Controls
  )
  // 设置控制模式
  const setControlMode = $TransformControlInstance.setControlMode()
  // 移除控制器
  const removeTransformControl =
    $TransformControlInstance.removeTransformControl()
  // 添加控制器
  const addTransformControl = $TransformControlInstance.addTransformControl()

  // 模型组
  const ModuleGroup = new Group()
  ModuleGroup.name = 'module-group'
  Scene.add(ModuleGroup)

  // gltf模型加载器
  const $GltfloaderInstance = new $GLTFLoader(Scene, Camera, ModuleGroup)

  // 文字加载
  const $FontLoaderInstance = new $FontLoader(ModuleGroup)

  const $GeometryHandlerInstance = new $GeometryHandler(ModuleGroup)

  // 环境光源
  const $EnvironmentInstance = new $Environment(
    Scene,
    Renderer,
    Camera,
    lightConfig
  )

  // 其他光源
  const $LightInstance = new $Light(Scene, ModuleGroup)

  // 阴影
  const $ShadowInstance = new $Shadow(Scene, Renderer, ModuleGroup)

  // 相机重置
  const cameraReset = $CameraInstance.resetCamera(Controls)

  // 使用透视相机 默认
  const usePerCamera = () => {
    Camera = $CameraInstance.usePreCamera()
    _updateCamera()
  }
  // 使用正交相机
  const useOrtCamera = () => {
    Camera = $CameraInstance.useOrtCamera()
    _updateCamera()
  }
  // 相机切换后重置
  const _updateCamera = () => {
    removeTransformControl()
    $OrbitControlsInstance.setCamera(Camera)
    $TransformControlInstance.setCamera(Camera)
    $CameraInstance.init()
    $OrbitControlsInstance.init()
    $TransformControlInstance.resetControlMode()
  }
  const initThreeScene = () => {
    $EnvironmentInstance.init()
    $CameraInstance.init()
    $OrbitControlsInstance.init()
    $RendererInstance.init()
    $SceneInstance.init()
    // 将renderer渲染进DOM里面
    threeDom.value.appendChild(Renderer.domElement)
  }

  const Render = () => {
    requestAnimationFrame(Render)
    Controls.update() // 轨道控制器的更新
    Renderer.clear() // 清除画布
    Renderer.render(Scene, Camera)
    if ($ShadowInstance.shadowGroup && $ShadowInstance.shadowGroup.visible) {
      $ShadowInstance.animate()
    }
  }

  const IMAGETYPE = {
    PNG: 'image/png',
    JPG: 'image/jpeg'
  }
  let imgType = IMAGETYPE.PNG
  const downloadImg = (type) => {
    if (!type) {
      imgType = IMAGETYPE.PNG
    } else {
      imgType = type
    }
    return new Promise((resolve) => {
      Renderer.render(Scene, Camera)
      resolve(Renderer.domElement.toDataURL(imgType))
    })
  }
  onMounted(() => {
    initThreeScene()
    Render()
  })
  onUnmounted(() => {
    $SceneInstance.destroyed()
    $RendererInstance.destroyed()
  })
  // setup中将threejs的dom返回
  return {
    threeDom,
    Scene,
    Renderer,
    Camera,
    IMAGETYPE,
    ModuleGroup,
    Color,
    loading,
    $GltfloaderInstance,
    $EnvironmentInstance,
    $LightInstance,
    $ShadowInstance,
    $CameraInstance,
    $GeometryHandlerInstance,
    $FontLoaderInstance,
    setControlMode,
    downloadImg,
    cameraReset,
    removeTransformControl,
    addTransformControl,
    usePerCamera,
    useOrtCamera
  }
}
