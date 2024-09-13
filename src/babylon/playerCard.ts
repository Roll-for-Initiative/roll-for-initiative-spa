import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import { animationAsync, degToRad } from './utils'

type PlayerData = {
  xPos: number
  yPos: number
  name: string
  roll: number
  imgUrl: string
  scene: BABYLON.Scene
  parent: BABYLON.AbstractMesh
  mainMesh?: BABYLON.AbstractMesh
  cardInfo: {
    cardOrigin: BABYLON.Vector3
    cardAngle: number
    index: number
  }
  rotation: BABYLON.Quaternion
  initiatve: number
}

type cardParts = {
  backdrop: BABYLON.AbstractMesh
  name: BABYLON.AbstractMesh
  initiative: BABYLON.AbstractMesh
  meta: BABYLON.AbstractMesh
  picture: BABYLON.AbstractMesh
}

export type CardInfo = {
  cardPosition: BABYLON.Vector3
  cardOrigin: BABYLON.Vector3
  cardAngle: number
  index: number
}

const IMAGES = ['dragon.jpg', 'dwarf.jpg', 'wizard.jpg']

const MONSTERS = ['monsters.jpg']

export class PlayerCard {
  xPos: number
  yPos: number
  name: string
  roll: number
  imgUrl: string
  scene: BABYLON.Scene
  parts: cardParts
  parent: BABYLON.Mesh
  mainMesh: BABYLON.AbstractMesh
  position: BABYLON.Vector3
  rotation: BABYLON.Quaternion
  cardInfo: CardInfo
  loaded: boolean
  initiatve: number

  constructor(playerData: PlayerData) {
    Object.assign(this, playerData)
  }

  async loadModel(initialPos: BABYLON.Vector3, initalRot: BABYLON.Quaternion) {
    const model = await BABYLON.SceneLoader.ImportMeshAsync('', 'models/card10.glb', '', this.scene)
    this.mainMesh = model.meshes[0]
    this.parent.addChild(model.meshes[0])
    this.setPosition(initialPos)
    this.setRotation(initalRot)
    this.parts = {
      backdrop: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === 'background')[0],
      name: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === 'Cube')[0],
      initiative: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === 'initiative')[0],
      meta: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === 'Cube.001')[0],
      picture: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === 'picture')[0]
    }

    this.parent.setEnabled(false)
    await this.setMaterials()
  }

  setPosition(position: BABYLON.Vector3) {
    this.position = position
    this.mainMesh.position = position
  }

  setRotation(target: BABYLON.Quaternion) {
    this.mainMesh.rotationQuaternion = target
    this.rotation = target
  }

  async setMaterials() {
    await this.setPictureMaterial()
    const mat = new BABYLON.PBRMaterial('test')
    mat.albedoColor = new BABYLON.Color3(0, 0, 0)
    this.parts.backdrop.material = mat
    this.setDynamicTexture(this.parts.name, 'name_texture', this.name, 82, 40, 80)
    this.setDynamicTexture(
      this.parts.meta,
      'initiave_texture',
      this.roll.toString() + ' + ' + this.initiatve.toString(),
      52,
      160,
      80
    )
  }

  setDynamicTexture(
    part: BABYLON.AbstractMesh,
    name: string,
    text: string,
    fontSize: number,
    x: number,
    y: number
  ) {
    const font = `${fontSize}px RuneScape Chat`
    const textureName = new BABYLON.DynamicTexture(
      'nameTexture',
      { width: 400, height: 100 },
      this.scene
    )
    const materialName = new BABYLON.StandardMaterial(name, this.scene)
    materialName.diffuseTexture = textureName
    materialName.indexOfRefraction = 0
    textureName.drawText(text, x, y, font, 'yellow', '#000022', false, true)
    materialName.roughness = 0
    part.material = materialName
  }

  async setPictureMaterial() {
    const nm = await BABYLON.NodeMaterial.ParseFromSnippetAsync('M49UMU#10', this.scene)
    nm.getInputBlocks().forEach((e) => {
      if (e.name === 'offsets') {
        e.value._x = 1 + Math.random() * 0.25
        e.value._y = 1 + Math.random() * 0.25
        e.value._z = 1 + Math.random() * 0.25
      }

      if (e.name === 'sheen') {
        e.value = 0.8 + (1 - Math.random())
      }
    })

    const textureBlock = nm.getBlockByPredicate(
      (input) => input.name === 'picture'
    ) as BABYLON.TextureBlock

    const test = new Promise((resolve) => {
      if (this.loaded) resolve(true)

      let loaded = false
      while (!loaded) {
        if (textureBlock.isReady()) {
          this.loaded = true
          loaded = true
          const imgName =
            this.name === 'Monsters'
              ? MONSTERS[Math.floor(Math.random() * MONSTERS.length)]
              : IMAGES[Math.floor(Math.random() * IMAGES.length)]
          const text = new BABYLON.Texture(
            this.imgUrl ? this.imgUrl : `models/textures/${imgName}`,
            this.scene,
            false,
            false,
            undefined,
            () => {}
          )
          textureBlock.texture = text
        }
      }
      resolve(true)
    })

    await test

    this.parts.picture.material = nm
  }

  // idleLerp() {
  //   let t = (BABYLON.Tools.Now / 10000) * this.speed
  //   t = Math.sin(t * Math.PI * 0.5)
  //   this.mainMesh.position = BABYLON.Vector3.Lerp(this.startPos, this.endPos, t)
  // }

  async reveal() {
    return await animationAsync((resolver) => {
      BABYLON.Animation.CreateAndStartAnimation(
        'reveal',
        this.mainMesh,
        'rotation',
        160,
        120,
        this.mainMesh.rotation,
        new BABYLON.Vector3(Math.PI / 2, Math.PI / 2, 0),
        0,
        undefined,
        resolver
      )
    })
  }

  async hide() {
    return await animationAsync((resolver) => {
      BABYLON.Animation.CreateAndStartAnimation(
        'hide',
        this.mainMesh,
        'rotation',
        160,
        120,
        this.mainMesh.rotation,
        new BABYLON.Vector3(-Math.PI / 2, -Math.PI / 2, 0),
        0,
        undefined,
        resolver
      )
    })
  }

  // idle() {
  //   if (this.mainMesh.position.y >= 1.5) {
  //     this.dir = -1
  //   } else if (this.mainMesh?.position.y <= -1.5) {
  //     this.dir = 1
  //   }
  //   this.mainMesh.position.y += this.speed * this.dir
  // }
}
