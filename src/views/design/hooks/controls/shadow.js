import bus from '@/libs/mitt/mitt'
import { computed, provide, reactive } from 'vue'
import { useStore } from 'vuex'
import { deepClone } from '@/utils/common'
const ShadowConfig = require('@/config/shadow-config')

export function shadowControl(options) {
  const { $ShadowInstance } = options
  const store = useStore()
  // 添加阴影
  const addLightShadow = $ShadowInstance.addLightShadow()
  // 移除阴影
  const shadowSwitch = $ShadowInstance.shadowSwitch()
  // 阴影颜色
  const changeLightShadow = $ShadowInstance.changeLightShadow()
  const state = reactive({
    shadowSettings: deepClone(ShadowConfig)
  })
  provide(
    'shadowSettings',
    computed({
      get: () => {
        return state.shadowSettings
      }
    })
  )
  // 阴影开关
  let isCreateShadow = false
  const switchShadow = (e) => {
    console.log('switchShadow', e, isCreateShadow)
    if (e && !isCreateShadow) {
      addLightShadow({
        ...state.shadowSettings
      })
      isCreateShadow = true
      state.shadowSettings.visible = $ShadowInstance.getShadowStatus()
      return
    }
    shadowSwitch()
    state.shadowSettings.visible = $ShadowInstance.getShadowStatus()
  }
  bus.on('switchShadow', switchShadow)

  const init = (options) => {
    const { shadow = deepClone(ShadowConfig) } = options || {}
    switchShadow(shadow.visible)
    changeShadow(shadow)
  }

  const changeShadow = (option) => {
    changeLightShadow(option)
    state.shadowSettings = {
      ...state.shadowSettings,
      ...option
    }
  }
  bus.on('changeShadow', changeShadow)
  store.commit('setGetShadowDataFun', () => {
    return {
      ...state.shadowSettings
    }
  })
  return {
    init
  }
}
