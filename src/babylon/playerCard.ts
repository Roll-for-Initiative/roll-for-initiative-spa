import * as BABYLON from 'babylonjs'
import modelUrl from './../assets/models/card.gltf?url'
import 'babylonjs-loaders';

type PlayerData = {
    xPos: number
    yPos: number
    name: string
    initiatve?: number
    imgUrl: string
    scene: BABYLON.Scene
}

type cardParts = {
    backdrop: BABYLON.AbstractMesh,
    name: BABYLON.AbstractMesh,
    initiative: BABYLON.AbstractMesh,
    meta: BABYLON.AbstractMesh,
    picture: BABYLON.AbstractMesh,
}

export class PlayerCard {
    xPos: number
    yPos: number
    name: string
    initiatve?: number
    imgUrl: string
    scene: BABYLON.Scene
    parts: cardParts

    constructor(playerData: PlayerData) {
        Object.assign(this, playerData)
        console.log(this)

        this.loadModel()
    }

    async loadModel() {
        const pathParts = modelUrl.split('/')
        const fileName = pathParts.pop()
        const path = pathParts.join("/")
        console.log(`${path}${fileName}`)
        const modelImport = await BABYLON.SceneLoader.ImportMeshAsync("", "http://localhost:5173/src/assets/models/card.glb", "", this.scene)
        console.log("meshe", modelImport.meshes[0].getChildren())

        console.log(modelImport.meshes[0].getChildMeshes(true, (mesh) => mesh.name === "name")[0])
        this.parts = {
            backdrop: modelImport.meshes[0].getChildMeshes(false, (mesh) => mesh.name === "backdrop")[0],
            name: modelImport.meshes[0].getChildMeshes(false, (mesh) => mesh.name === "name")[0],
            initiative: modelImport.meshes[0].getChildMeshes(false, (mesh) => mesh.name === "initiative")[0],
            meta: modelImport.meshes[0].getChildMeshes(false, (mesh) => mesh.name === "meta")[0],
            picture: modelImport.meshes[0].getChildMeshes(false, (mesh) => mesh.name === "picture")[0]
        }

        const myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);

        myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
        this.parts.backdrop.material = myMaterial


        const myMaterial2 = new BABYLON.StandardMaterial("myMaterial2", this.scene);

        myMaterial2.diffuseColor = new BABYLON.Color3(0, 0, 1);
        this.parts.backdrop.material = myMaterial
        this.parts.picture.material = myMaterial2
        modelImport.meshes[0].rotation.x = 180
        modelImport.meshes[0].rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.LOCAL)
        modelImport.meshes[0].rotate(new BABYLON.Vector3(0, 0, 1), 0, BABYLON.Space.LOCAL)
        modelImport.meshes[0].rotate(new BABYLON.Vector3(0, 1, 0), Math.PI, BABYLON.Space.LOCAL)

    }
}