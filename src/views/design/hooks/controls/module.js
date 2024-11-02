import { ref, reactive, watch, provide, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import bus from '@/libs/mitt/mitt'
import { saveImg } from '@/utils/download'
import CONFIG from '@/config/module-config'
import { generateUUID, deepClone, colorChangeRgbToHex } from '@/utils/common'
import { lightControl } from './light'
const fontConfig = require('@/config/font-config')
export function moduleControl(options) {
  const {
    threeDom,
    ModuleGroup,
    setControlMode,
    downloadImg,
    $GltfloaderInstance,
    removeTransformControl,
    addTransformControl,
    loading,
    $GeometryHandlerInstance,
    $FontLoaderInstance
  } = options || {}

  // 加载外部模型
  const loadGltf = $GltfloaderInstance.loadModule()
  // 给模型贴图
  const moduleMapping = $GltfloaderInstance.moduleMapping()
  // 点击模型选中
  const getClickModule = $GltfloaderInstance.getClickModule()
  // 更换模型材质
  const moduleChangeMaterial = $GltfloaderInstance.moduleChangeMaterial()

  const store = useStore()
  const state = reactive({
    modulesSetting: [], // 模型配置数组
    mappingData: [] // 贴图数据
  })
  const modules = [] // 模型数组
  let currentIndex = ref(-1) // 当前控制模型索引
  let currentModule = {} // 当前模型对象
  let geometries = [] // 缓存的形状对象

  const currentModuleSetting = computed({
    get: () => {
      return currentIndex.value > -1
        ? state.modulesSetting[currentIndex.value]
        : {}
    },
    set: (setting) => {
      state.modulesSetting[currentIndex.value] = setting
    }
  })
  watch(currentIndex, (index) => {
    currentModule =
      index > -1 && index < modules.length ? modules[index].module : null
  })
  provide(
    'currentModuleSetting',
    computed({
      get: () => {
        return currentModuleSetting.value
      }
    })
  )
  // 加载模型
  const loadModule = async (data) => {
    console.log('加载模型：', data)
    let { url, settings = {}, isGeometry, isText, type } = data || {}
    let uuid = generateUUID()
    loading.value = true
    let loadResult = {
      moduleScene: {},
      materialConfig: {}
    }
    if (isGeometry) {
      let { scene: geoResult } = await $GeometryHandlerInstance.load(
        {
          name: type,
          uuname: uuid,
          settings
        },
        {},
        { geometries }
      )
      loadResult.moduleScene = geoResult
    } else if (isText) {
      let { scene: textResult } = await $FontLoaderInstance.load({
        uuname: uuid,
        settings
      })
      loadResult.moduleScene = textResult
    } else if (url) {
      let { gltfScene, materialConfig } = await loadGltf(
        url,
        CONFIG,
        settings,
        uuid
      )
      loadResult.moduleScene = gltfScene
      loadResult.materialConfig = materialConfig
    }
    data.materialConfig = loadResult.materialConfig
    addModuleSetting(loadResult.moduleScene, uuid, data)
    loading.value = false
  }
  bus.on('loadModule', loadModule)
  // 加载模型后添加配置
  const addModuleSetting = (moduleScene, uuid, data = {}) => {
    setControlMode(moduleScene)
    data.settings = data.settings || {}
    if (
      data.type !== 'device' &&
      !data.isGeometry &&
      !data.isText &&
      !data.settings.mesh
    ) {
      const mesh = []
      moduleScene.traverse((obj) => {
        if (obj.isMesh) {
          mesh.push({
            name: obj.name,
            color:
              data.settings.color || colorChangeRgbToHex(obj.material.color)
          })
        }
      })
      data.settings.mesh = mesh
    }
    modules.push({
      ...data,
      module: moduleScene,
      uuid
    })
    state.modulesSetting.push({
      ...data,
      visible: moduleScene.visible
    })
    console.log('模型加载完成', state.modulesSetting, data, moduleScene)
    currentIndex.value = modules.length - 1
    currentModule = moduleScene
    currentModule.uuid = uuid

    // 初始化
    const settings = data.settings
    let position = settings.position || [0, 0, 0]
    let scale = { scale: settings.scale || 1 }
    let rotation = settings.rotation || [0, 0, 0]
    let color = settings.color || null
    let materialType = settings.materialType || null
    // 位置
    setPosition(position)
    // 缩放
    setScale(scale)
    // 角度
    setRotation(rotation)
    // 颜色
    if (settings.mesh) {
      settings.mesh.forEach((item) => {
        changeColor({ color: item.color, extra: item.name })
      })
    } else {
      changeColor(color)
    }
    // 材质
    changeMaterial(materialType)
    // 隐藏
    if (data.visible === false) {
      switchModule(modules.length - 1)
    }
  }

  const getCurrentModule = () => {
    return currentModule
  }

  const getCurrentModuleSettings = () => {
    return state.modulesSetting[currentIndex.value]
  }

  // 光源模型
  const lightControlData = lightControl({
    ...options,
    addModuleSetting,
    getCurrentModule,
    getCurrentModuleSettings
  })

  const init = async (options, mappingData) => {
    const { modules: initModules } = options || {}
    let lightOptions = deepClone(options)
    console.log('initModules', initModules, mappingData)
    if (!Array.isArray(initModules) || !initModules.length) {
      const modulesLength = modules.length
      for (let i = 0; i < modulesLength - 1; i++) {
        removeModule(0)
      }
      setTimeout(() => {
        removeModule(0)
      })
      lightControlData.init(lightOptions)
      return
    }
    state.mappingData = mappingData
    for (let i = 0; i < initModules.length; i++) {
      if (!initModules[i].lightType) {
        await loadModule(initModules[i])
      }
    }

    lightControlData.init(lightOptions)
  }

  // 点击选中模型
  let isClick = false
  let startTime = ''
  let isMouseDown = false
  const selectMouseDown = () => {
    startTime = new Date().getTime()
    isMouseDown = true
  }
  const selectMouseUp = () => {
    isClick = new Date().getTime() - startTime < 200
    isMouseDown = false
  }
  // 防止点击事件与拖拽事件冲突  按点击的时间200ms来判定
  const clickSelectModule = (event) => {
    if (!isClick) {
      return
    }
    const selectModuleUUname = getClickModule(event)
    if (selectModuleUUname) {
      if (!currentModule || selectModuleUUname !== currentModule.uuid) {
        modules.forEach((item, index) => {
          if (item.uuid === selectModuleUUname) {
            changeModule(index)
          }
        })
      }
    } else {
      changeModule(-1)
    }
  }
  // 画布鼠标移动事件,响应模型变化
  const threeDomMouseMove = (e) => {
    if (isMouseDown && currentModule) {
      currentModuleSetting.value.settings.position = {
        ...currentModule.position
      }
      if (currentModule.light && currentModule.update) {
        currentModule.update()
      }
    }
  }

  // 切换控制模式
  const changeModel = (model) => {
    currentModule && setControlMode(currentModule, model)
  }
  bus.on('changeModel', changeModel)
  // 给模型贴图
  const moduleMappingImage = (options) => {
    let { img } = options || {}
    if (!img) {
      return
    }
    let texture = moduleMapping(img, currentModule, CONFIG.SCREEN_OBJECT)
    currentModuleSetting.value.settings.mappingImg = img
    currentModuleSetting.value.imgTexture = texture
  }
  bus.on('moduleMappingImage', moduleMappingImage)

  // 控制贴图位置角度等
  const moduleMappingImageChange = (e) => {
    currentModuleSetting.value.imgTexture.needsUpdate = true
  }
  bus.on('moduleMappingImageChange', moduleMappingImageChange)
  // 变更模型材质
  const changeMaterial = (e) => {
    let data = modules[currentIndex.value]
    if (!data || !e) {
      return
    }
    let _setting = currentModuleSetting.value || {}
    if (_setting.isGeometry) {
      $GeometryHandlerInstance.changeType(data, e)
    } else if (_setting.isText) {
      $FontLoaderInstance.changeType(data, e)
    } else {
      moduleChangeMaterial(data, e, CONFIG)
    }
    _setting.settings.materialType = e
  }
  bus.on('changeMaterial', changeMaterial)

  // 控制位置
  const setPosition = (e) => {
    if (!currentModule) {
      return
    }
    if (Array.isArray(e)) {
      currentModule.position.set(...e)
    } else {
      let { x, y, z } = e || {}
      currentModule.position.set(x, y, z)
    }
    currentModuleSetting.value.settings.position = { ...currentModule.position }
  }
  bus.on('setPosition', setPosition)

  // 控制角度
  const setRotation = (e) => {
    if (!currentModule) {
      return
    }
    if (Array.isArray(e)) {
      currentModule.rotation.set(...e)
    } else {
      let { x, y, z } = e || {}
      currentModule.rotation.set(x, y, z)
    }
    currentModuleSetting.value.settings.rotation = {
      x: currentModule.rotation._x,
      y: currentModule.rotation._y,
      z: currentModule.rotation._z
    }
  }
  bus.on('setRotation', setRotation)

  // 设置屏幕折叠角度
  const setScreenRotation = (e) => {
    if (!currentModule) {
      return
    }
    currentModule.traverse((obj) => {
      if (CONFIG.ROTATION_OBJECT.includes(obj.name)) {
        obj.rotation.x = e
        currentModuleSetting.value.settings.screenRotation = e
      }
    })
  }
  bus.on('setScreenRotation', setScreenRotation)

  // 控制缩放
  const setScale = (e) => {
    let { scale } = e || {}
    if (!currentModule) {
      return
    }
    if (Array.isArray(scale)) {
      currentModule.scale.set(...scale)
    } else {
      currentModule.scale.set(scale, scale, scale)
    }
    currentModuleSetting.value.settings.scale = currentModule.scale.x
  }
  bus.on('setScale', setScale)

  // 控制几何形状配置
  const changeGeomtryShape = (e) => {
    if (!currentModule) {
      return
    }
    const config = {
      devel: 0,
      extrude: 1,
      round: 2
    }
    const { type, value } = e || {}
    currentModule.morphTargetInfluences[config[type]] = value
    currentModuleSetting.value.settings.morphTargetInfluences = [
      ...currentModule.morphTargetInfluences
    ]
  }
  bus.on('changeGeomtryShape', changeGeomtryShape)

  // 控制颜色
  const changeColor = (option) => {
    if (!currentModule || !option) {
      return
    }
    let color = ''
    let name = ''
    if (typeof option === 'object') {
      color = option.color
      name = option.extra
    } else {
      color = option
    }

    let _setting = currentModuleSetting.value || {}
    _setting.settings.color = color
    currentModule.traverse((obj) => {
      if (!obj.isMesh) {
        return
      }

      const isDevice = _setting.type === 'device'
      const isPartChange = name && obj.name === name
      const isGeometry = _setting.isGeometry || false
      const isText = _setting.isText || false
      const isDeviceChangeClayOrGlass =
        _setting.type === 'device' &&
        (_setting.settings.materialType === 'clay' ||
          _setting.settings.materialType === 'glass') &&
        !CONFIG.SCREEN_OBJECT.includes(obj.name)

      const isDeviceNormalChange =
        _setting.type === 'device' &&
        CONFIG.CHANGEABLE_OBJECTS.includes(obj.name) &&
        !CONFIG.SCREEN_OBJECT.includes(obj.name)
      if (isDevice) {
        if (isDeviceChangeClayOrGlass || isDeviceNormalChange) {
          obj.material.color.set(color)
          return
        }
      } else if (isPartChange) {
        obj.material.color.set(color)
        if (!_setting.settings.mesh) {
          return
        }
        _setting.settings.mesh.forEach((item) => {
          if (item.name === name) {
            item.color = color
          }
        })
      } else if (isGeometry || isText) {
        obj.material.color && obj.material.color.set(color)
      }
    })
  }
  bus.on('changeColor', changeColor)
  // 删除模型
  const removeModule = (index) => {
    if (index >= modules.length) {
      return
    }
    const moduleData = modules[index]
    ModuleGroup.remove(moduleData.module)
    if (moduleData.isLight && moduleData.lightType === 'spot') {
      ModuleGroup.remove(moduleData.module.light)
    }
    modules.splice(index, 1)
    state.modulesSetting.splice(index, 1)
    let modulesLength = modules.length
    if (modulesLength) {
      currentIndex.value = Math.max(modulesLength - 1, 0)
      setControlMode(modules[modulesLength - 1].module)
    } else {
      changeModule(-1)
    }
    if (!Object.keys(state.mappingData).length) {
      return
    }
    let mappingDataIndex = -1
    state.mappingData.forEach((item, mIndex) => {
      if (item.index == mIndex) {
        mappingDataIndex = mIndex
      }
    })
    if (mappingDataIndex === -1) {
      return
    }
    state.mappingData.splice(mappingDataIndex, 1)
  }
  bus.on('removeModule', removeModule)

  // 替换模型
  const replaceModule = (data) => {
    removeTransformControl()
    ModuleGroup.remove(currentModule)
    modules.splice(currentIndex.value, 1)
    state.modulesSetting.splice(currentIndex.value, 1)
    loadModule(data)
  }
  bus.on('replaceModule', replaceModule)

  // 显示/隐藏模型
  const switchModule = (index) => {
    let thisModule = modules[index]
    if (!thisModule) {
      return
    }
    let thisModuleData = thisModule.module
    thisModuleData && (thisModuleData.visible = !thisModuleData.visible)
    state.modulesSetting[index].visible = !!thisModuleData.visible
    if (thisModule.light) {
      this.Module.light.visible = !this.Module.light.visible
    }
  }
  bus.on('switchModule', switchModule)

  // 切换模型
  const changeModule = (index) => {
    //记录上一个模型的数据
    currentIndex.value = index
    if (index > -1) {
      let { module } = modules[index] || {}
      module && setControlMode(module)
      // 显示右侧状态框
      bus.emit('showStyleDrawer')
    } else {
      removeTransformControl()
      // 关闭右侧状态框
      bus.emit('closeStyleDrawer')
    }
  }
  bus.on('changeModule', changeModule)

  // 复制模型
  const copyModule = (index) => {
    let module = deepClone(state.modulesSetting[index])
    if (module.isLight) {
      lightControlData.addLightControl(module.lightType, module.settings)
    } else {
      loadModule(module)
    }
  }
  bus.on('copyModule', copyModule)
  // 修改文字内容
  const changeText = (text) => {
    currentModuleSetting.value.settings.text = text
    $FontLoaderInstance.changeText(currentModule, text)
  }
  bus.on('changeText', changeText)
  // 修改字体
  const changeFont = (font) => {
    const settings = currentModuleSetting.value.settings
    settings.font = font
    $FontLoaderInstance.changeFont(
      currentModule,
      settings.text || fontConfig.defaultText,
      font
    )
  }
  bus.on('changeFont', changeFont)
  // 修改字体其他配置
  const changeFontConfig = (config) => {
    if (!config) {
      return
    }
    const settings = currentModuleSetting.value.settings
    settings.fontConfig = {
      ...(settings.fontConfig || {}),
      ...config
    }
    $FontLoaderInstance.changeConfig(
      currentModule,
      settings.text || fontConfig.defaultText,
      config
    )
  }
  bus.on('changeFontConfig', changeFontConfig)
  // 下载模型图片
  const download = async (e) => {
    removeTransformControl()
    setTimeout(async () => {
      const imgData = await downloadImg(e)
      addTransformControl()
      saveImg(imgData)
    })
  }
  bus.on('download', download)

  onMounted(() => {
    document.onkeydown = function () {
      if (!currentModule) {
        return
      }
      let key = window.event.keyCode
      const position = currentModule.position
      let positionX = position.x
      let positionY = position.y
      // 上  38，下  40，左 37，右39
      if (key === 38) {
        setPosition({
          ...position,
          y: ++positionY
        })
      } else if (key === 40) {
        setPosition({
          ...position,
          y: --positionY
        })
      } else if (key === 37) {
        setPosition({
          ...position,
          x: --positionX
        })
      } else if (key === 39) {
        setPosition({
          ...position,
          x: ++positionX
        })
      }
    }
  })
  store.commit('setGetModulesDataFun', async () => {
    removeTransformControl()
    const imgData = await downloadImg('image/jpeg')
    addTransformControl()
    return deepClone({
      modules: state.modulesSetting,
      coverImg: imgData
    })
  })

  return {
    loading,
    threeDom,
    currentIndex,
    currentModule,
    state,
    clickSelectModule,
    selectMouseDown,
    selectMouseUp,
    threeDomMouseMove,
    ...lightControlData,
    init,
    currentModuleSetting
  }
}
