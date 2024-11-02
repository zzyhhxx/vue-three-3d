import { __NUXT__ } from './mesh-state'
export function getModulesData() {
  return __NUXT__.state.main.data.devices
}

export function getElementsData() {
  return __NUXT__.state.main.data.elements
}

export function getEnvironmentsData() {
  return __NUXT__.state.main.data.environments
}

export function getBackgrounds() {
  return __NUXT__.state.main.main.backgrounds
}

export function getCameraSettings() {
  return __NUXT__.state.main.main.camera
}
export function getMain() {
  return __NUXT__.state.main
}

export function getGeometryData() {
  return [
    {
      name: '立方体',
      type: 'Cube',
      icon: require('../assets/image/icon/cube.svg'),
      isGeometry: true,
      settings: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 10,
        color: '#322aff',
        materialType: 'basic',
        morphTargetInfluences: [0.8],
        canSetDevel: true
      }
    },
    {
      name: '圆柱',
      type: 'Cylinder',
      isGeometry: true,
      icon: require('../assets/image/icon/cylinder.svg'),
      settings: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 10,
        color: '#322aff',
        materialType: 'basic',
        canSetExtrude: true,
        canSetDevel: true,
        morphTargetInfluences: [0.8, 0.8]
      }
    },
    {
      name: '圆形',
      type: 'Sphere',
      isGeometry: true,
      icon: require('../assets/image/icon/sphere.svg'),
      settings: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 10,
        color: '#322aff',
        materialType: 'basic'
      }
    },
    {
      name: '环形',
      type: 'Torus',
      isGeometry: true,
      icon: require('../assets/image/icon/torus.svg'),
      settings: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 10,
        color: '#322aff',
        materialType: 'basic'
      }
    },
    {
      name: '锥体',
      type: 'Cone',
      isGeometry: true,
      icon: require('../assets/image/icon/cone.svg'),
      settings: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 10,
        color: '#322aff',
        materialType: 'basic'
      }
    },
    {
      name: '金字塔',
      type: 'Pyramid',
      isGeometry: true,
      icon: require('../assets/image/icon/pyramid.svg'),
      settings: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 10,
        color: '#322aff',
        materialType: 'basic'
      }
    },
    {
      name: '胶囊',
      type: 'Capsule',
      isGeometry: true,
      icon: require('../assets/image/icon/capsule.svg'),
      settings: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 10,
        color: '#322aff',
        materialType: 'basic',
        canSetExtrude: true,
        canSetDevel: true,
        morphTargetInfluences: [0.3, 0.7]
      }
    },
    {
      name: '形状',
      type: 'Shape',
      isGeometry: true,
      icon: require('../assets/image/icon/shape.svg'),
      settings: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 10,
        color: '#322aff',
        materialType: 'basic',
        canSetExtrude: true,
        canSetDevel: true,
        canSetRound: true,
        morphTargetInfluences: [0.91, 0.91, 0.43]
      }
    },
    {
      name: '卡片',
      type: 'Card',
      isGeometry: true,
      icon: require('../assets/image/icon/card.svg'),
      settings: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 10,
        color: '#322aff',
        materialType: 'basic',
        canSetExtrude: true,
        canSetDevel: true,
        canSetRound: true,
        morphTargetInfluences: [0.8, 0.8, 0.15]
      }
    },
    {
      name: '文字',
      type: 'Text',
      isText: true,
      icon: require('../assets/image/icon/text.svg'),
      settings: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1,
        color: '#322aff',
        materialType: 'basic'
      }
    }
  ]
}

export function getModuleCanvasData() {
  return [
    {
      name: 'iphone-11',
      width: 129.4,
      height: 280
    },
    {
      name: 'iphone-12',
      width: 129.4,
      height: 280
    },
    {
      name: 'basic-phone',
      width: 129.4,
      height: 280
    },
    {
      name: 'macbook',
      width: 270,
      height: 168.8
    },
    {
      name: 'imac',
      width: 270,
      height: 152
    },
    {
      name: 'imac-21',
      width: 270,
      height: 152
    },
    {
      name: 'pro-display',
      width: 270,
      height: 152
    },
    {
      name: 'ipad',
      width: 194.5,
      height: 280
    },
    {
      name: 'basic-tablet',
      height: 194.5,
      width: 280
    },
    {
      name: 'basic-plane',
      width: 270,
      height: 168.8
    },
    {
      name: 'tv',
      width: 270,
      height: 152
    }
  ]
}
