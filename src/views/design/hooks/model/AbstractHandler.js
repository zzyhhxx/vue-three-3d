import {
  Vector3,
  Color
} from 'three/build/three.module.js'
import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry'
Geometry.prototype.computeAngleVertexNormals = function (e) {
  function t(t, n) {
    for (var r = new Vector3(), i = 0, o = t.length; i < o; i++)
      t[i].angleTo(n) < e && r.add(t[i])
    return r.normalize()
  }
  this.computeFaceNormals()
  for (var n = [], i = 0, r = this.vertices.length; i < r; i++) n[i] = []
  i = 0
  for (var o = this.faces.length; i < o; i++) {
    n[(l = this.faces[i]).a].push(l.normal),
      n[l.b].push(l.normal),
      n[l.c].push(l.normal)
  }
  for (i = 0, o = this.faces.length; i < o; i++) {
    var l
    ;((l = this.faces[i]).vertexNormals[0] = t(n[l.a], l.normal)),
      (l.vertexNormals[1] = t(n[l.b], l.normal)),
      (l.vertexNormals[2] = t(n[l.c], l.normal))
  }
  this.faces.length > 0 && (this.normalsNeedUpdate = !0)
}
class AbstractHandler {
  constructor(e, t) {
    ;(this.id = t),
      (this.renderer = e),
      (this.additionalScene = null),
      (this.scene = null),
      (this.options = {}),
      (this.target = null),
      (this.product = null),
      (this.customMaterials = []),
      (this.materials = {
        clay: {
          roughness: 1,
          metalness: 0,
          transmission: 0,
          thickness: 0,
          clearcoat: 0,
          clearcoatRoughness: 0
        },
        basic: {
          roughness: 0.5,
          metalness: 0.5,
          transmission: 0,
          thickness: 1,
          clearcoat: 0,
          clearcoatRoughness: 0
        },
        metalic: {
          roughness: 0.2,
          metalness: 1,
          transmission: 0,
          thickness: 0,
          clearcoat: 0,
          clearcoatRoughness: 0
        },
        glass: {
          roughness: 0.67,
          metalness: 0,
          transmission: 1,
          thickness: 1,
          clearcoat: 0,
          clearcoatRoughness: 0
        },
        transparentPlastic: {
          metalness: 1,
          roughness: 0.25,
          opacity: 0.2,
          transparent: !0,
          transmission: 1,
          thickness: 1,
          clearcoat: 0,
          clearcoatRoughness: 0
        }
      })
  }
  changeColor(element) {
    this.scene &&
      this.scene.traverse((object) => {
        object.material.color = new Color(element.settings.color)
      })
  }
  changeEnvMap(e) {
    this.scene &&
      this.scene.traverse((object) => {
        object.isMesh &&
          (e.visible
            ? ((object.material.envMap = this.options.envMap),
              (object.material.envMapIntensity = e.intensity))
            : (object.material.envMap = null))
      })
  }
  changeEnvMapIntensity(e) {
    this.scene &&
      ((this.options.envMapIntensity = e.intensity),
      this.scene.traverse((object) => {
        object.isMesh &&
          e.visible &&
          (object.material.envMapIntensity = e.intensity)
      }))
  }
  changeType(data, e) {
    console.log('changeType', data, e)
    let scene = data.module
    let t = JSON.parse(JSON.stringify(this.materials[e]))
    this.updateMaterial(scene.material, t, data.settings),
      (scene.material.needsUpdate = !0)
  }
  updateMaterial(e, t, settings) {
    ;(e.metalness = JSON.parse(JSON.stringify(t.metalness))),
      (e.roughness = JSON.parse(JSON.stringify(t.roughness))),
      (e.thickness = JSON.parse(JSON.stringify(t.thickness))),
      t.clearcoat && (e.clearcoat = JSON.parse(JSON.stringify(t.clearcoat))),
      t.clearcoatRoughness &&
        (e.clearcoatRoughness = JSON.parse(
          JSON.stringify(t.clearcoatRoughness)
        )),
      (e.transmission = JSON.parse(JSON.stringify(t.transmission))),
      t.ior && (e.ior = JSON.parse(JSON.stringify(t.ior))),
      t.transparent &&
        (e.transparent = JSON.parse(JSON.stringify(t.transparent))),
      t.opacity && (e.opacity = JSON.parse(JSON.stringify(t.opacity))),
      e.color.set(settings.color)
    console.log('updateMaterial', e, settings.color)
  }
  changeAngle(element) {
    if (this.scene) {
      let e = element.settings.rotation
      e instanceof Array
        ? this.scene.rotation.set(...e)
        : this.scene.rotation.setFromVector3(element.settings.rotation),
        (element.settings.rotation = this.scene.rotation)
    }
  }
  changePosition(element) {
    if (this.scene) {
      let e = element.settings.position
      e instanceof Array
        ? this.scene.position.set(...e)
        : this.scene.position.set(e.x, e.y, e.z),
        (element.settings.position = this.scene.position)
    }
  }
  changeScale(element) {
    if (element.settings && this.scene) {
      let e = element.settings.scale
      this.scene &&
        element.settings.scale &&
        (e instanceof Object
          ? this.scene.scale.set(e.x, e.y, e.z)
          : this.scene.scale.set(e, e, e)),
        (element.settings.scale = this.scene.scale)
    }
  }
  updateEnvMap(e) {
    this.options.envMap = e
  }
}
const THREEx = {
  dilateGeometry: function (e, t) {
    var n = new Array(e.vertices.length)
    e.faces.forEach(function (e) {
      e instanceof Face3
        ? ((n[e.a] = e.vertexNormals[0]),
          (n[e.b] = e.vertexNormals[1]),
          (n[e.c] = e.vertexNormals[2]))
        : console.assert(!1)
    }),
      e.vertices.forEach(function (e, r) {
        var o = n[r]
        ;(e.x += o.x * t), (e.y += o.y * t), (e.z += o.z * t)
      })
  }
}

export {
  AbstractHandler,
  THREEx,
  Geometry
}
