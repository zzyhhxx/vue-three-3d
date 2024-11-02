import { createStore } from 'vuex'

export default createStore({
  state: {
    projectData: {
      name: '',
      templateId: ''
    },
    getModulesData: () => {},
    getEnvironmentData: () => {},
    getLightData: () => {},
    getCameraData: () => {},
    getShadowData: () => {}
  },
  getters: {},
  mutations: {
    saveProjectData(state, payload) {
      console.log('saveProject:', payload)
      state.projectData = {
        ...state.projectData,
        ...payload
      }
    },
    setGetModulesDataFun(state, payload) {
      state.getModulesData = payload
    },
    setGetEnvironmentDataFun(state, payload) {
      state.getEnvironmentData = payload
    },
    setGetLightDataFun(state, payload) {
      state.getLightData = payload
    },
    setGetCameraDataFun(state, payload) {
      state.getCameraData = payload
    },
    setGetShadowDataFun(state, payload) {
      state.getShadowData = payload
    }
  },
  actions: {},
  modules: {}
})
