import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import { animationAsync, degToRad } from './utils'

type PlayerData = {
  xPos: number
  yPos: number
  name: string
  modifier: number
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
  modifier: number
  imgUrl: string
  scene: BABYLON.Scene
  parts: cardParts
  parent: BABYLON.AbstractMesh
  mainMesh: BABYLON.AbstractMesh
  position: BABYLON.Vector3
  rotation: BABYLON.Quaternion
  cardInfo: CardInfo

  constructor(playerData: PlayerData) {
    Object.assign(this, playerData)
  }

  async loadModel() {
    const model = await BABYLON.SceneLoader.ImportMeshAsync('', 'models/card9.glb', '', this.scene)
    this.mainMesh = model.meshes[0]

    this.parts = {
      backdrop: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === 'background')[0],
      name: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === 'Cube')[0],
      initiative: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === 'initiative')[0],
      meta: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === 'Cube.001')[0],
      picture: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === 'picture')[0]
    }

    this.parent.addChild(model.meshes[0])

    this.setMaterials()
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
    this.setPictureMaterial()
    this.setDynamicTexture(this.parts.name, 'name_texture', this.name)
    this.setDynamicTexture(this.parts.meta, 'initiave_texture', this.modifier.toString())
  }

  setDynamicTexture(part: BABYLON.AbstractMesh, name: string, text: string) {
    const font = '82px RuneScape Chat'
    const textureName = new BABYLON.DynamicTexture(
      'nameTexture',
      { width: 400, height: 100 },
      this.scene
    )
    const materialName = new BABYLON.StandardMaterial(name, this.scene)
    materialName.diffuseTexture = textureName
    textureName.drawText(text, 40, 80, font, 'yellow', '#0101', false, true)
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
        e.value = 0.2 + (1 - Math.random())
      }
    })

    const textureBlock = nm.getBlockByPredicate(
      (input) => input.name === 'picture'
    ) as BABYLON.TextureBlock
    let loaded = false

    // await new Promise((resolve) => {
    //   const interval = setInterval(() => {
    //     if (textureBlock.isReady()) {
    //       clearInterval(interval)
    //       const imgName =
    //         this.name === 'Monsters'
    //           ? MONSTERS[Math.floor(Math.random() * MONSTERS.length)]
    //           : IMAGES[Math.floor(Math.random() * IMAGES.length)]
    //       const text = new BABYLON.Texture(
    //         this.imgUrl ? this.imgUrl : `models/textures/${imgName}`,
    //         this.scene, true, true, undefined, ()=>{
    //           if (!loaded){
    //             textureBlock.texture = text
    //             loaded=true
    //             resolve(true)
    //           }
    //         }
    //       )
    //     }
    //   }, 500)
    // })

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

  // idle() {
  //   if (this.mainMesh.position.y >= 1.5) {
  //     this.dir = -1
  //   } else if (this.mainMesh?.position.y <= -1.5) {
  //     this.dir = 1
  //   }
  //   this.mainMesh.position.y += this.speed * this.dir
  // }
}
