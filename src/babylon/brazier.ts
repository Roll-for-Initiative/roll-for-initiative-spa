import * as BABYLON from 'babylonjs'
export default class Brazier {
  scene: BABYLON.Scene
  position: BABYLON.Vector3
  mesh: BABYLON.Mesh
  shadowGenerator: BABYLON.ShadowGenerator

  constructor(scene: BABYLON.Scene, position: BABYLON.Vector3) {
    this.scene = scene
    this.position = position
    this.init()
  }

  async init() {
    this.mesh = new BABYLON.Mesh('brazier', this.scene)
    

    this.mesh.position = this.position.add(new BABYLON.Vector3(0, 9, 0))
    const model = await BABYLON.SceneLoader.ImportMeshAsync(
      '',
      'models/brazier2.glb',
      '',
      this.scene
    )

    const main = model.meshes[0]
    main.scaling = new BABYLON.Vector3(2.5, 2.5, 2.5)
    main.position = this.position

    const partStone = model.meshes[2]
    const stoneMat = new BABYLON.PBRMaterial('stone_mat')
    stoneMat.albedoColor = new BABYLON.Color3(138 / 255, 129 / 255, 124 / 255)
    stoneMat.roughness = 1
    partStone.material = stoneMat

    const partGold = model.meshes[1]
    const goldMat = new BABYLON.PBRMaterial('goldMat')
    goldMat.albedoColor = new BABYLON.Color3(250 / 255, 214 / 255, 55 / 255)
    goldMat.roughness = 1
    partGold.material = goldMat
    BABYLON.ParticleHelper.BaseAssetsUrl = './'
    const fireSystem = await BABYLON.ParticleHelper.CreateAsync('fire2System', this.scene, false)

    const fireLight1 = new BABYLON.PointLight('fire1', this.position.add(new BABYLON.Vector3(0, 12, 0)), this.scene)
    fireLight1.diffuse = new BABYLON.Color3(0, 100 / 255, 0)
    fireLight1.intensity = 100

    fireSystem.start(this.mesh)
  }
}
