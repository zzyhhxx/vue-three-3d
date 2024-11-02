import {
  Mesh,
  MeshPhysicalMaterial,
  Vector3,
  Float32BufferAttribute,
  ExtrudeGeometry,
  Shape,
  Plane,
  SphereGeometry,
  TorusGeometry,
  ConeGeometry
} from 'three/build/three.module.js'
import { AbstractHandler, THREEx, Geometry} from './AbstractHandler'
export class $GeometryHandler extends AbstractHandler {
  constructor(group) {
    super()
    this.moduleGroup = group
  }
  load(e, t, n) {
    return (
      (this.options = t),
      (this.product = e),
      (this.global = n),
      (this.realMaterials = []),
      (this.clayMaterials = []),
      (this.customMaterials = []),
      new Promise((t) => {
        let n = new MeshPhysicalMaterial({ flatShading: !1 }),
          r = null,
          o = this.global.geometries.find((t) => t.name === e.name)
        o = null
        if (o) {
          r = o
          let t = this.getDefaultMorph(e.name)
          t && this.setDefaultMorph(t)
        } else (r = this.createGeometry(e)), this.global.geometries.push(r)
        let l = new Mesh(r, n)
        if (
          (e.settings.morphTargetInfluences &&
            (l.morphTargetInfluences = e.settings.morphTargetInfluences),
          (e.settings.morphTargetInfluences = l.morphTargetInfluences),
          e.innerScale)
        ) {
          // const t = new Object3D()
          // t.add(...l.children),
          //   t.scale.set(e.innerScale, e.innerScale, e.innerScale),
          //   l.add(t)
        }
        ;(this.additionalScene = l),
          (this.scene = l),
          (this.scene.name = 'geometry'),
          // e.settings.elements && e.settings.elements.length
          //   ? e.settings.elements.forEach((element) => {
          //       this.changeColor(element)
          //     })
          //   : this.changeColor(e),
          // this.changeScale(e),
          // this.changeAngle(e),
          // this.changePosition(e),
          // this.changeType(e.settings.type),
          // (this.scene.visible = e.settings.visible),
          (l.uuname = e.uuname)
        this.moduleGroup.add(l)
        t({ scene: l })
      })
    )
  }
  createFinalGeometryFromShape(e, t, n, r) {
    let o = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
      l = arguments.length > 5 && void 0 !== arguments[5] && arguments[5],
      c = arguments.length > 6 ? arguments[6] : void 0,
      h = e,
      d = o ? 20 * t : t,
      f = l ? 0.3 : 1,
      m = this.createGeometryFromShape(h, r, r, d, 0.03 / 9, n, f)
    m.morphAttributes.position = []
    const v = this.createGeometryFromShape(h, r, r, d, 0.03 / 9, n, 0)
        .attributes.position,
      y = new Vector3(),
      x = []
    for (let i = 0; i < v.count; i++)
      y.fromBufferAttribute(v, i).toArray(x, x.length)
    if (
      ((m.morphAttributes.position[0] = new Float32BufferAttribute(x, 3)), o)
    ) {
      const e = this.createGeometryFromShape(h, r, r, t, 0.03 / 9, n, f)
          .attributes.position,
        o = new Vector3(),
        l = []
      for (let i = 0; i < v.count; i++)
        o.fromBufferAttribute(e, i).toArray(l, l.length)
      m.morphAttributes.position[1] = new Float32BufferAttribute(l, 3)
    }
    if (l && c) {
      const t = this.createGeometryFromShape(
          l && c ? c : e,
          r,
          r,
          d,
          0.03 / 9,
          n,
          f
        ).attributes.position,
        o = new Vector3(),
        h = []
      for (let i = 0, e = t.count; i < e; i++)
        o.fromBufferAttribute(t, i).toArray(h, h.length)
      m.morphAttributes.position[2] = new Float32BufferAttribute(h, 3)
    }
    return m
  }
  createGeometryFromShape(e, t, n, r, o, l, c) {
    let h = new ExtrudeGeometry(e, {
      depth: r,
      bevelEnabled: !0,
      bevelSegments: l,
      steps: 5,
      bevelSize: o,
      bevelThickness: o,
      curveSegments: l
    })
    h.scale(t, t, t)
    let d = new Geometry().fromBufferGeometry(h)
    d.mergeVertices(),
      d.computeFaceNormals(),
      d.computeVertexNormals(),
      THREEx.dilateGeometry(d, c)
    let f = d.toBufferGeometry()
    return f.center(), f
  }
  getFinalCapsule() {
    let e = this.createCapsule(2, 2, 10, 1, 20),
      t = this.createCapsule(2, 2, 10, 1 / 9, 20),
      n = this.createCapsule(2, 2, 1, 1, 20)
    e.morphAttributes.position = []
    const r = t.attributes.position,
      o = new Vector3(),
      l = []
    for (let i = 0, e = r.count; i < e; i++)
      o.fromBufferAttribute(r, i).toArray(l, l.length)
    const c = n.attributes.position,
      h = new Vector3(),
      d = []
    for (let i = 0, e = c.count; i < e; i++)
      h.fromBufferAttribute(c, i).toArray(d, d.length)
    return (
      (e.morphAttributes.position[0] = new Float32BufferAttribute(l, 3)),
      (e.morphAttributes.position[1] = new Float32BufferAttribute(d, 3)),
      e
    )
  }
  createCapsule(e, t, n, r, o) {
    let l = new Shape(),
      c = 1e-5,
      h = r - c
    l.absarc(c, c, c, -Math.PI / 2, -Math.PI, !0),
      l.absarc(c, t - 1.99998, c, Math.PI, Math.PI / 2, !0),
      l.absarc(e - 1.99998, t - 1.99998, c, Math.PI / 2, 0, !0),
      l.absarc(e - 1.99998, c, c, 0, -Math.PI / 2, !0)
    let d = new ExtrudeGeometry(l, {
        depth: n - 2 * r,
        bevelEnabled: !0,
        bevelSegments: 2 * o,
        steps: 1,
        bevelSize: h,
        bevelThickness: r,
        curveSegments: o
      }),
      f = new Geometry().fromBufferGeometry(d)
    f.mergeVertices(), f.computeFaceNormals(), f.computeVertexNormals()
    let m = f.toBufferGeometry()
    return m.center(), m
  }
  createGeometry(e) {
    let t = null,
      n = new Shape(),
      r = new Shape(),
      o = 1e-5,
      l = 0.03 / 9 - o,
      c = 1,
      h = 1,
      d = 0.99,
      f = null
    switch (e.name) {
      case 'Cube':
        n.absarc(o, o, o, -Math.PI / 2, -Math.PI, !0),
          n.absarc(o, c - 2 * l, o, Math.PI, Math.PI / 2, !0),
          n.absarc(h - 2 * l, c - 2 * l, o, Math.PI / 2, 0, !0),
          n.absarc(h - 2 * l, o, o, 0, -Math.PI / 2, !0),
          (t = this.createFinalGeometryFromShape(n, 1, 16, 2)),
          this.setDefaultMorph([0.8])
        break
      case 'Sphere':
        t = new SphereGeometry(1, 64, 32)
        break
      case 'Cylinder':
        let e = 16,
          m = 6 * e
        n.moveTo(0, 1)
        for (let i = 1; i < m; i++)
          n.lineTo(
            Math.sin((i / m) * Math.PI * 2),
            Math.cos((i / m) * Math.PI * 2)
          )
        ;(t = this.createFinalGeometryFromShape(n, 1, e, 1, !0)),
          this.setDefaultMorph([0.8, 0.8])
        break
      case 'Torus':
        t = new TorusGeometry(1, 0.3, 64, 128)
        break
      case 'Cone':
        t = new ConeGeometry(1, 3, 64)
        break
      case 'Pyramid':
        ;(t = new ConeGeometry(1, 2, 4)),
          (f = new Geometry().fromBufferGeometry(t)),
          f.computeAngleVertexNormals(Math.PI / 4),
          (t = f.toBufferGeometry())
        break
      case 'Capsule':
        ;(t = this.getFinalCapsule()), this.setDefaultMorph([0.3, 0.7])
        break
      case 'Shape':
        ;(c = 2),
          (h = 2),
          n.moveTo(0, 0 + l),
          n.lineTo(0, 0 + c - l),
          n.quadraticCurveTo(0, 0 + c, 0 + l, 0 + c),
          n.lineTo(0 + h - l, 0 + c),
          n.quadraticCurveTo(0 + h, 0 + c, 0 + h, 0 + c - l),
          n.lineTo(0 + h, 0 + l),
          n.quadraticCurveTo(0 + h, 0, 0 + h - l, 0),
          n.lineTo(0 + l, 0),
          n.quadraticCurveTo(0, 0, 0, 0 + l),
          r.moveTo(0, 0.99),
          r.lineTo(0, 0 + c - d),
          r.quadraticCurveTo(0, 0 + c, 0.99, 0 + c),
          r.lineTo(0 + h - d, 0 + c),
          r.quadraticCurveTo(0 + h, 0 + c, 0 + h, 0 + c - d),
          r.lineTo(0 + h, 0.99),
          r.quadraticCurveTo(0 + h, 0, 0 + h - d, 0),
          r.lineTo(0.99, 0),
          r.quadraticCurveTo(0, 0, 0, 0.99),
          (t = this.createFinalGeometryFromShape(n, 0.1, 32, 2, !0, !0, r)),
          this.setDefaultMorph([0.91, 0.91, 0.43])
        break
      case 'Card':
        ;(c = 3.2),
          (h = 2),
          n.moveTo(0, 0 + l),
          n.lineTo(0, 0 + c - l),
          n.quadraticCurveTo(0, 0 + c, 0 + l, 0 + c),
          n.lineTo(0 + h - l, 0 + c),
          n.quadraticCurveTo(0 + h, 0 + c, 0 + h, 0 + c - l),
          n.lineTo(0 + h, 0 + l),
          n.quadraticCurveTo(0 + h, 0, 0 + h - l, 0),
          n.lineTo(0 + l, 0),
          n.quadraticCurveTo(0, 0, 0, 0 + l),
          r.moveTo(0, 0.99),
          r.lineTo(0, 0 + c - d),
          r.quadraticCurveTo(0, 0 + c, 0.99, 0 + c),
          r.lineTo(0 + h - d, 0 + c),
          r.quadraticCurveTo(0 + h, 0 + c, 0 + h, 0 + c - d),
          r.lineTo(0 + h, 0.99),
          r.quadraticCurveTo(0 + h, 0, 0 + h - d, 0),
          r.lineTo(0.99, 0),
          r.quadraticCurveTo(0, 0, 0, 0.99),
          (t = this.createFinalGeometryFromShape(n, 0.01, 32, 2, !0, !0, r)),
          this.setDefaultMorph([0.8, 0.8, 0.15])
        break
      default:
        t = new Plane()
    }
    return (t.name = e.name), t
  }
  getDefaultMorph(e) {
    switch (e) {
      case 'Cube':
        return [0.8]
      case 'Cylinder':
        return [0.8, 0.8]
      case 'Capsule':
        return [0.3, 0.7]
      case 'Shape':
        return [0.91, 0.91, 0.43]
      case 'Card':
        return [0.8, 0.8, 0.15]
      default:
        return null
    }
  }
  setDefaultMorph(e) {
    // this.product.settings.morphTargetInfluences ||
    //   (this.product.settings.morphTargetInfluences = e)
  }
}
