import bus from '@/libs/mitt/mitt'
import { generateUUID, deepClone } from '@/utils/common'
import { getEnvironmentsData } from '@/utils/data'
import { useStore } from 'vuex'
import { lightConfig } from '@/config/light-config'
export function lightControl(options) {
  const {
    Scene,
    loading,
    $LightInstance,
    $EnvironmentInstance,
    addModuleSetting,
    getCurrentModule,
    getCurrentModuleSettings
  } = options || {}
  const store = useStore()
  const ambient = $EnvironmentInstance.getAmbient()
  const hemiLight = $EnvironmentInstance.getHemiLight()
  const loadHdrEnv = $EnvironmentInstance.loadHdrEnv()
  // 添加点光源和辅助对象
  const addPointLight = $LightInstance.addPointLight()
  // 添加平行光源和辅助对象
  const addDirectLight = $LightInstance.addDirectLight()
  // 添加聚光源和辅助对象
  const addSpotLight = $LightInstance.addSpotLight()

  const envConfig = getEnvironmentsData()

  const lightSettings = deepClone(lightConfig)

  const init = (options = {}) => {
    const { modules: initModules } = options || {}
    if (initModules) {
      initModules.forEach((item) => {
        if (item.lightType) {
          addLightControl(item.lightType, deepClone(item.settings))
        }
      })
    }
    const {
      ambient = lightConfig.ambient,
      hemiLight = lightConfig.hemiLight,
      hdrEnv = lightConfig.hdrEnv
    } = options.light || {}
    bus.emit('lightAmbient', ambient)
    bus.emit('lightHemiLight', hemiLight)
    bus.emit('lightHdrEnv', hdrEnv)
  }

  // 控制环境光
  const setAmbient = (options) => {
    console.log('setAmbient', options)
    let { intensity, color } = options
    if (intensity) {
      ambient.intensity = intensity
      lightSettings.ambient.intensity = intensity
    }
    if (color) {
      ambient.color.set(color)
      lightSettings.ambient.color = color
    }
  }
  bus.on('setAmbient', setAmbient)
  // 环境光开关
  let currentEnvMap = null
  const switchAmbient = (e) => {
    if (!e) {
      currentEnvMap = Scene.environment
      Scene.remove(ambient)
      Scene.environment = null
    } else {
      Scene.add(ambient)
      Scene.environment = currentEnvMap
    }
    lightSettings.ambient.visible = !!e
  }
  bus.on('switchAmbient', switchAmbient)
  // 控制自然光
  const setHemLight = (options) => {
    let { intensity, color, groundColor } = options
    if (intensity) {
      hemiLight.intensity = intensity
      lightSettings.hemiLight.intensity = intensity
    }
    if (color) {
      hemiLight.color.set(color)
      lightSettings.hemiLight.skyColor = color
    }
    if (groundColor) {
      hemiLight.groundColor.set(groundColor)
      lightSettings.hemiLight.groundColor = groundColor
    }
  }
  bus.on('setHemLight', setHemLight)
  // 自然光开关
  const switchHemLight = (e) => {
    if (!e) {
      Scene.remove(hemiLight)
    } else {
      Scene.add(hemiLight)
    }
    lightSettings.hemiLight.visible = !!e
  }
  bus.on('switchHemLight', switchHemLight)
  // 添加光源
  const addLightControl = (type, settings) => {
    switch (type) {
      case 'point':
        doAddPointLight(settings)
        break
      case 'direct':
        doAddDirectLight(settings)
        break
      case 'spot':
        doAddSpotLight(settings)
        break
    }
  }
  bus.on('addLight', addLightControl)
  // 添加点光源
  const doAddPointLight = (settings) => {
    const lightSettings = settings || lightConfig.pointLight
    let uuid = generateUUID()
    let light = addPointLight(lightSettings)
    light.uuname = uuid
    console.log('添加点光源', lightSettings)
    addModuleSetting(light, uuid, {
      name: '点光源',
      lightType: 'point',
      isLight: true,
      settings: {
        ...lightSettings
      }
    })
  }
  // 添加平行光
  const doAddDirectLight = (settings) => {
    const lightSettings = settings || lightConfig.directLight
    let uuid = generateUUID()
    let light = addDirectLight(lightSettings)
    light.uuname = uuid
    console.log('添加平行光', lightSettings)
    addModuleSetting(light, uuid, {
      name: '平行光',
      lightType: 'direct',
      isLight: true,
      settings: {
        ...lightSettings
      }
    })
  }
  // 添加聚光灯
  const doAddSpotLight = (settings) => {
    const lightSettings = settings || lightConfig.spotLight
    console.log('添加聚光灯')
    let uuid = generateUUID()
    let light = addSpotLight(lightSettings)
    light.uuname = uuid
    addModuleSetting(light, uuid, {
      name: '聚光灯',
      lightType: 'spot',
      isLight: true,
      settings: {
        ...lightSettings
      }
    })
  }
  // 光源变化响应
  const changeLightSetting = (e) => {
    let { intensity, distance, color, angle } = e || {}
    const currentModule = getCurrentModule()
    const currentModuleSettings = getCurrentModuleSettings()
    if (!currentModule.light) {
      return
    }
    let isSet = false
    if (intensity !== undefined) {
      currentModule.light.intensity = intensity
      currentModuleSettings.settings.intensity = intensity
      isSet = true
    }
    if (distance !== undefined) {
      currentModule.light.distance = distance
      currentModuleSettings.settings.distance = distance
      isSet = true
    }
    if (color !== undefined) {
      currentModule.light.color.set(color)
      currentModuleSettings.settings.color = color
      isSet = true
    }
    if (angle !== undefined) {
      currentModule.light.angle = Math.PI / angle
      currentModuleSettings.settings.angle = angle
      isSet = true
    }
    if (isSet && currentModule.update) {
      currentModule.update()
    }
  }
  bus.on('changeLightSetting', changeLightSetting)

  // 切换Hdr环境光
  const changeHdr = async (index) => {
    let env = envConfig[index]
    if (!env) {
      return
    }
    loading.value = true
    await loadHdrEnv(env.url)
    loading.value = false
    lightSettings.hdrEnv = env
  }
  bus.on('changeHdr', changeHdr)
  changeHdr(lightConfig.ambient.hdrDefault)

  store.commit('setGetLightDataFun', () => {
    return {
      ambient: {
        ...lightSettings.ambient
      },
      hemiLight: {
        ...lightSettings.hemiLight
      },
      hdrEnv: {
        ...lightSettings.hdrEnv
      }
    }
  })

  return {
    addLightControl,
    init
  }
}
