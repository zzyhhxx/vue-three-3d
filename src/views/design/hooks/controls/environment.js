import bus from '@/libs/mitt/mitt'
import { ref, provide, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { deepClone } from '@/utils/common'
const defaultSettings = require('@/config/env-config')
export function environmentControl(options) {
  const { Scene, Renderer, Color, $EnvironmentInstance } = options
  const store = useStore()
  const state = reactive({
    environmentSettings: deepClone(defaultSettings)
  })
  const showFullScreen = ref(false) // 全屏显示，收起左右控制栏
  const init = (options) => {
    const { environment } = options || {}
    const {
      sceneBgColor,
      backgroundType,
      sceneBgColorFirst,
      sceneBgColorSecond,
      bgColorAngle
    } = environment || defaultSettings
    changeBackgroundType(backgroundType)
    if (backgroundType === 'blank') {
      changeBgColor(sceneBgColor)
    } else if (backgroundType === 'gradient') {
      changeGradientBg({
        color: sceneBgColorFirst,
        color2: sceneBgColorSecond,
        angle: bgColorAngle
      })
    }
    if (showFullScreen.value) {
      onShowFullScreen()
    }
  }

  // 画布背景色
  Renderer.setClearColor(state.environmentSettings.sceneBgColor, 0)
  Scene.background = new Color(state.environmentSettings.sceneBgColor)

  provide(
    'environmentSettings',
    computed({
      get: () => {
        return state.environmentSettings
      }
    })
  )

  // 控制背景色
  const changeBgColor = (color) => {
    if (!color) {
      return
    }
    $EnvironmentInstance.changeBgColor(color)
    state.environmentSettings.sceneBgColor = color
  }
  bus.on('changeBgColor', changeBgColor)

  // 变更背景类型
  const changeBackgroundType = (type) => {
    if (type === 'blank') {
      $EnvironmentInstance.changeBgColor(state.environmentSettings.sceneBgColor)
    } else if (type === 'gradient') {
      $EnvironmentInstance.createGradientBackground({
        ...getWindowSize(),
        color: state.environmentSettings.sceneBgColorFirst,
        color2: state.environmentSettings.sceneBgColorSecond,
        angle: state.environmentSettings.bgColorAngle
      })
    }
    state.environmentSettings.backgroundType = type
  }
  bus.on('changeBackgroundType', changeBackgroundType)

  // 变更渐变背景
  const changeGradientBg = ({ color, color2, angle }) => {
    $EnvironmentInstance.changeGradientBackground({
      ...getWindowSize(),
      color: color || state.environmentSettings.sceneBgColorFirst,
      color2: color2 || state.environmentSettings.sceneBgColorSecond,
      angle: angle || state.environmentSettings.bgColorAngle
    })
    color && (state.environmentSettings.sceneBgColorFirst = color)
    color2 && (state.environmentSettings.sceneBgColorSecond = color2)
    angle && (state.environmentSettings.bgColorAngle = angle)
  }
  bus.on('changeGradientBg', changeGradientBg)

  // 全屏显示
  const onShowFullScreen = () => {
    showFullScreen.value = !showFullScreen.value
  }
  bus.on('showFullScreen', onShowFullScreen)

  const getWindowSize = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
  store.commit('setGetEnvironmentDataFun', () => {
    return {
      ...state.environmentSettings
    }
  })
  return {
    showFullScreen,
    init
  }
}
