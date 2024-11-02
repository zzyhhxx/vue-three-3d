import { getEnvironmentsData } from '@/utils/data'
const envConfigs = getEnvironmentsData()
// 灯光初始化配置
export const lightConfig = {
  // 环境光
  ambient: {
    visible: true,
    intensity: 0.5, // 强度
    color: '#ffffff' // 颜色
  },
  // 自然光
  hemiLight: {
    visible: true,
    intensity: 0.5, // 强度
    rotation: 0, // 角度
    skyColor: '#ffffff', // 天空颜色
    groundColor: '#949fe7' // 地板颜色
  },
  // 点光源
  pointLight: {
    color: '#ffffff',
    position: { x: 0, y: 0, z: 0 },
    distance: 100,
    intensity: 1
  },
  // 平行光
  directLight: {
    color: '#ffffff',
    position: { x: 0, y: 0, z: 0 },
    intensity: 1
  },
  // 聚光灯
  spotLight: {
    color: '#ffffff',
    position: { x: 10, y: 20, z: 10 },
    distance: 20,
    intensity: 1,
    angle: 24
  },
  hdrEnv: envConfigs[1]
}
