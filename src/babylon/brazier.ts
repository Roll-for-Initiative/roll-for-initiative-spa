import * as BABYLON from 'babylonjs'
export default class Brazier {
  scene: BABYLON.Scene
  position: BABYLON.Vector3
  mesh: BABYLON.Mesh
  shadowGenerator: BABYLON.ShadowGenerator

  constructor(scene: BABYLON.Scene, position: BABYLON.Vector3, shadowGenerator:BABYLON.ShadowGenerator) {
    this.scene = scene
    this.position = position
    this.shadowGenerator = shadowGenerator
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

    for (const m of model.meshes){
      this.shadowGenerator.addShadowCaster(m)
      
    }
    // console.log("stone",)
    // "brazier_gold"
    console.log(model)

    const partStone = model.meshes[2]
    const stoneMat = new BABYLON.PBRMaterial('stone_mat')
    stoneMat.albedoColor = new BABYLON.Color3(138 / 255, 129 / 255, 124 / 255)
    stoneMat.roughness = 1
    partStone.material = stoneMat

    const main = model.meshes[0]
    main.scaling = new BABYLON.Vector3(2.5, 2.5, 2.5)
    main.position = this.position

    const partGold = model.meshes[1]
    const goldMat = new BABYLON.PBRMaterial('stone_mat')
    goldMat.albedoColor = new BABYLON.Color3(250 / 255, 214 / 255, 55 / 255)
    goldMat.roughness = 1
    partGold.material = goldMat
    BABYLON.ParticleHelper.BaseAssetsUrl = './'
    const fireSystem = await BABYLON.ParticleHelper.CreateAsync('fire2System', this.scene, false)

    const fireLight1 = new BABYLON.PointLight('fire1', this.mesh.position, this.scene)
    fireLight1.diffuse = new BABYLON.Color3(255 / 255, 100 / 255, 0)
    fireLight1.intensity = 15

    fireSystem.systems[0].maxSize = 3
    // fireSystem.systems[0].emitter.overlayColor = new BABYLON.Color4(0,0,1,1)
    fireSystem.systems[0].color1 = new BABYLON.Color4(0, 0, 1, 1)
    fireSystem.systems[0].color2 = new BABYLON.Color4(0, 0, 1, 1)
    console.log(fireSystem.systems[0])
    fireSystem.start(this.mesh)
  }
}
