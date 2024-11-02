import {
  CanvasTexture,
  sRGBEncoding,
  MeshPhongMaterial,
  Raycaster,
  Vector2,
  MeshPhysicalMaterial,
  MeshBasicMaterial
} from 'three/build/three.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js' // gltf加载器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export class $GLTFLoader {
  constructor(Scene, Camera, ModuleGroup) {
    // gltfLoader
    const Gltfloader = new GLTFLoader()
    // 添加draco 解码器
    const dLoader = new DRACOLoader()

    dLoader.setDecoderPath('/gltf/')
    dLoader.setDecoderConfig({ type: 'js' })
    dLoader.preload()

    Gltfloader.setDRACOLoader(dLoader)
    Gltfloader.setCrossOrigin('anonymous')

    this.Gltfloader = Gltfloader
    this.Scene = Scene
    this.Camera = Camera
    this.ModuleGroup = ModuleGroup
  }
  loadModule() {
    return (url, CONFIG, settings, uuid) => {
      return new Promise((resolve) => {
        let gltfScene = {}
        let doubleSide = 2
        this.Gltfloader.load(
          url,
          (gltf) => {
            gltfScene = gltf.scene
            gltfScene.uuname = uuid
            this.ModuleGroup.add(gltfScene)
            const materialConfig = {
              realMaterials: [],
              metalicMaterials: [],
              clayMaterials: [],
              glassMaterials: [],
              screenFrames: []
            }
            // 模型加载完,进行相机的初始化,传入设置的参数,模型加载为异步
            // 设置roughness粗糙度，metalness
            gltfScene.traverse(function (obj) {
              if (!obj.isMesh) {
                return
              }
              obj.castShadow = true
              const isChangeAble = CONFIG.CHANGEABLE_OBJECTS.includes(obj.name)
              const isScreenBase = CONFIG.SCREEN_BASE_OBJECT.includes(obj.name)
              const isScreen = CONFIG.SCREEN_OBJECT.includes(obj.name)
              if (isChangeAble) {
                obj.material = new MeshPhysicalMaterial({
                  color: settings.color,
                  roughness: obj.material.roughness,
                  metalness: obj.material.metalness,
                  envMap: null,
                  envMapIntensity: 1,
                  transparent: 0,
                  side: doubleSide
                })
                materialConfig.realMaterials.push(obj.material)
                materialConfig.metalicMaterials.push(
                  new MeshPhysicalMaterial({
                    color: settings.color,
                    roughness: 0.2,
                    metalness: 1,
                    transmission: 0,
                    thickness: 0,
                    clearcoat: 0,
                    clearcoatRoughness: 0,
                    envMap: null,
                    envMapIntensity: 1,
                    side: doubleSide,
                    transparent: 0
                  })
                )
                materialConfig.glassMaterials.push(
                  new MeshPhysicalMaterial({
                    color: settings.color,
                    roughness: 0.67,
                    metalness: 0,
                    transmission: 1,
                    thickness: 1,
                    clearcoat: 0,
                    clearcoatRoughness: 0,
                    envMap: null,
                    envMapIntensity: 1,
                    side: doubleSide,
                    transparent: 0
                  })
                )
                materialConfig.clayMaterials.push(
                  new MeshPhysicalMaterial({
                    color: settings.color,
                    roughness: 1,
                    metalness: 0.1,
                    envMap: null,
                    envMapIntensity: 1,
                    side: doubleSide,
                    transparent: 0
                  })
                )
              } else if (isScreenBase) {
                obj.material = new MeshPhysicalMaterial({
                  color: obj.material.color,
                  roughness: 0.1,
                  metalness: 0.61,
                  reflectivity: 1,
                  envMap: null,
                  envMapIntensity: 1
                })
                materialConfig.realMaterials.push(obj.material)
                materialConfig.metalicMaterials.push(obj.material)
                materialConfig.screenFrames.push(obj.material)
                materialConfig.clayMaterials.push(
                  new MeshPhysicalMaterial({
                    color: settings.color,
                    roughness: 1,
                    metalness: CONFIG.ONE_COLOR_DEVICES.includes(settings.name)
                      ? 0.1
                      : 0.2,
                    envMap: null,
                    envMapIntensity: 1,
                    side: doubleSide,
                    transparent: 0
                  })
                )
                materialConfig.glassMaterials.push(
                  new MeshPhysicalMaterial({
                    color: settings.color,
                    roughness: 0.75,
                    metalness: 0,
                    transmission: 1,
                    thickness: 1,
                    clearcoat: 0,
                    clearcoatRoughness: 0,
                    envMap: null,
                    envMapIntensity: 1,
                    side: doubleSide,
                    transparent: 0
                  })
                )
              } else if (isScreen) {
                obj.material = new MeshBasicMaterial()
                obj.material.envMap = null
                obj.material.map = settings.texture
              } else {
                obj.material.side = doubleSide
                materialConfig.realMaterials.push(obj.material)
                materialConfig.glassMaterials.push(
                  new MeshPhysicalMaterial({
                    color: settings.color,
                    roughness: 0.75,
                    metalness: 0,
                    transmission: 1,
                    thickness: 1,
                    clearcoat: 0,
                    clearcoatRoughness: 0,
                    envMap: null,
                    envMapIntensity: 1,
                    side: doubleSide,
                    transparent: 0
                  })
                )
                materialConfig.metalicMaterials.push(obj.material)
                materialConfig.clayMaterials.push(
                  new MeshPhysicalMaterial({
                    color: settings.color,
                    roughness: 1,
                    metalness: CONFIG.ONE_COLOR_DEVICES.includes(settings.name)
                      ? 0.1
                      : 0.2,
                    envMap: null,
                    envMapIntensity: 1,
                    side: doubleSide,
                    transparent: 0
                  })
                )
              }
            })
            resolve({ gltfScene, materialConfig })
          },
          (xhr) => {
            // 控制台查看加载进度xhr
            xhr = Math.floor((xhr.loaded / xhr.total) * 100)
            console.log('模型加载进度', xhr)
          }
        )
      })
    }
  }
  moduleMapping() {
    return (url, module, screen) => {
      let texture = new CanvasTexture(document.getElementById(url))
      texture.encoding = sRGBEncoding
      texture.flipY = false
      texture.needsUpdate = true
      texture.matrixAutoUpdate = false
      let tmaterial = new MeshPhongMaterial({ map: texture })
      this.findScreen(
        module,
        function (item) {
          item.material = tmaterial
          item.material.needsUpdate = true
        },
        screen
      )
      return texture
    }
  }
  getClickModule() {
    const raycaster = new Raycaster()
    const mouse = new Vector2()
    const { Scene, Camera } = this
    return (event) => {
      // event.preventDefault()
      // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
      raycaster.setFromCamera(mouse, Camera)

      //找到场景中所有外部模型
      let scensObjs = []
      Scene.children.forEach((child) => {
        for (let i = 0; i < child.children.length; i++) {
          let obj = child.children[i]
          scensObjs.push(obj)
        }
      })

      //返回选中的外部模型对象
      let intersects = raycaster.intersectObjects(scensObjs)

      let objs = []
      for (let i = 0; i < intersects.length; i++) {
        let intersect = intersects[i]
        if (intersect.object) {
          let obj = intersect.object.parent
          //把距离加到模型用户数据里面，方便后面排序
          obj.userData.distance = intersect.distance
          objs.push(obj)
        }
      }

      //按照距离排序
      objs = objs.sort(function (a, b) {
        return a.userData.distance - b.userData.distance
      })
      const findUuname = (obj) => {
        if (!obj) {
          return false
        }
        if (obj.uuname) {
          return obj.uuname
        } else {
          return findUuname(obj.parent)
        }
      }
      let result = ''
      for (let item of objs) {
        let uuname = findUuname(item)
        if (uuname) {
          result = uuname
          break
        }
      }
      // 如果没找到外部资源，找内部资源
      if (!result) {
        intersects = raycaster.intersectObjects(Scene.children)
        for (let i = 0; i < intersects.length; i++) {
          let intersect = intersects[i]
          if (intersect.object) {
            let obj = intersect.object
            let uuname = findUuname(obj)
            if (uuname) {
              result = uuname
              break
            }
          }
        }
      }
      return result
    }
  }
  findScreen(module, callback, screen = []) {
    if (!module.isMesh) {
      module.traverse(function (item) {
        if (screen.includes(item.name)) {
          if (item.isMesh) {
            callback(item)
          } else {
            item.children.forEach((citem) => {
              if (screen.includes(citem.name)) {
                callback(citem)
              }
            })
          }
        }
      })
    }
  }
  // 改变模型材质
  // 基本basic  金属metalic  粘土clay   玻璃glass
  moduleChangeMaterial() {
    return (data, type = 'basic', CONFIG) => {
      let { module, settings, materialConfig, type: mType } = data || {}
      if (!module) {
        return
      }
      const TYPES = {
        basic: 'realMaterials',
        metalic: 'metalicMaterials',
        glass: 'glassMaterials',
        clay: 'clayMaterials'
      }
      let i = 0
      module.traverse((obj) => {
        if (
          !obj.isMesh ||
          CONFIG.SCREEN_OBJECT.includes(obj.name) ||
          'screen_plane' === obj.name
        ) {
          return
        }
        let thisColor = obj.material.color
        let isChangeAble = CONFIG.CHANGEABLE_OBJECTS.includes(obj.name)
        if (materialConfig[TYPES[type]] && materialConfig[TYPES[type]][i]) {
          obj.material = materialConfig[TYPES[type]][i]
        }
        if (
          mType === 'device' &&
          (type === 'clay' || type === 'glass' || isChangeAble)
        ) {
          obj.material.color.set(settings.color)
        } else if (mType !== 'device') {
          obj.material.color.set(thisColor)
        }
        i++
      })
    }
  }
}
