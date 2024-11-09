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
      'models/background_01.glb',
      '',
      this.scene
    )

    const main = model.meshes[0]

    main.scaling = new BABYLON.Vector3(5, 4, 4)

    main.position = new BABYLON.Vector3(-10, -5, 0)
    const doorframe = model.meshes[5]
    const stoneMat = new BABYLON.PBRMaterial('stoneMat')
    stoneMat.albedoTexture = new BABYLON.Texture('models/textures/marble/Substance_Graph_BaseColor.jpg')
    stoneMat.bumpTexture = new BABYLON.Texture('models/textures/marble/Substance_Graph_Normal.jpg')
    stoneMat.metallicTexture = new BABYLON.Texture('models/textures/marble/Substance_Graph_Roughness.jpg')

    doorframe.material = stoneMat

    const brickwall = model.meshes[3]
    const brickMat = new BABYLON.PBRMaterial('brickMat')
    brickMat.metallicTexture = new BABYLON.Texture('models/textures/rock/Rock_Moss_001_roughness.jpg')
    brickwall.material = brickMat
    brickMat.albedoTexture = new BABYLON.Texture('models/textures/rock/Rock_Moss_001_basecolor.jpg')
    brickMat.bumpTexture = new BABYLON.Texture('models/textures/rock/Rock_Moss_001_normal.jpg')

    // brickMat.

    model.meshes[1].dispose()
    const floor = BABYLON.CreateGround('floor', {
      width: 80,
      height: 80,
    })
    floor.position = new BABYLON.Vector3(0,-5,0)
    const floorMat = new BABYLON.PBRMaterial('floorMat')
    floorMat.albedoTexture = new BABYLON.Texture('models/textures/path2/Stylized_Stone_Floor_005_basecolor.jpg')
    floorMat.metallicTexture = new BABYLON.Texture('models/textures/path2/Stylized_Stone_Floor_005_roughness.jpg')
    floorMat.bumpTexture = new BABYLON.Texture('models/textures/path2/Stylized_Stone_Floor_005_normal.jpg')

    floor.material = floorMat

    const door = model.meshes[2]
    const doorMat = new BABYLON.PBRMaterial('doorMat')
    doorMat.albedoTexture = new BABYLON.Texture('models/textures/door3/Wood_011_basecolor.jpg')
    doorMat.bumpTexture = new BABYLON.Texture('models/textures/door3/Wood_011_normal.jpg')
    doorMat.metallicTexture = new BABYLON.Texture('models/textures/door3/Wood_011_roughness.jpg')
    door.material = doorMat
  }
}
