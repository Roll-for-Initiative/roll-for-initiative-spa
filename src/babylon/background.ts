import * as BABYLON from 'babylonjs'

export class Background {
  scene: BABYLON.Scene

  constructor(scene: BABYLON.Scene) {
    this.scene = scene
    this.init()
  }

  init() {
    this.loadModels()
  }

  async loadModels() {
    const model = await BABYLON.SceneLoader.ImportMeshAsync(
      '',
      'models/background21.glb',
      '',
      this.scene
    )

    const main = model.meshes[0]

    main.scaling = new BABYLON.Vector3(5, 4, 4)

    main.position = new BABYLON.Vector3(-10, -5, 0)
    const doorframe = model.meshes[5]
    const stoneMat = new BABYLON.PBRMaterial('stoneMat')

    stoneMat.albedoColor = new BABYLON.Color3(138 / 255, 129 / 255, 124 / 255)
    stoneMat.roughness = 1
    doorframe.material = stoneMat

    const brickwall = model.meshes[3]
    const brickMat = new BABYLON.PBRMaterial('brickMat')
    brickMat.albedoColor = new BABYLON.Color3(244 / 255, 243 / 255, 238 / 255)
    brickMat.roughness = 1
    brickwall.material = brickMat

    const floor = model.meshes[1]
    const floorMat = new BABYLON.PBRMaterial('floorMat')

    const stoneText = new BABYLON.Texture('models/textures/black-stone.jpg')
      floorMat.albedoTexture = stoneText
    floorMat.albedoColor = new BABYLON.Color3(70 / 255, 63 / 255, 58 / 255)
    floorMat.roughness = 1
    floor.material = floorMat


    const door = model.meshes[2]
    const doorMat = new BABYLON.PBRMaterial('doorMat')
    doorMat.albedoColor = new BABYLON.Color3(124 / 255, 99 / 255, 84 / 255)
    doorMat.roughness = 1
    door.material = doorMat
  }
}
