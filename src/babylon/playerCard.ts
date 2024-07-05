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
        this.parts.initiative.visibility = 0

        const backdropMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
        backdropMaterial.diffuseTexture = new BABYLON.Texture("http://localhost:5173/src/assets/models/textures/wood.jpg", this.scene);
        backdropMaterial.diffuseColor = BABYLON.Color3.FromHexString("#954535");
        this.parts.backdrop.material = backdropMaterial


        const pictureMaterial = new BABYLON.StandardMaterial("myMaterial2", this.scene);
        pictureMaterial.diffuseTexture = new BABYLON.Texture("http://localhost:5173/src/assets/models/textures/jelle.jpg", this.scene);
        this.parts.picture.material = pictureMaterial

        const font = "82px RuneScape Chat";

        const textureName = new BABYLON.DynamicTexture("dynamic texture", { width: 400, height: 100 }, this.scene);
        const materialName = new BABYLON.StandardMaterial("Mat", this.scene);
        materialName.diffuseTexture = textureName;
        textureName.drawText("Buttcheeks", 40, 80, font, "yellow", "#0101", false, true);
        this.parts.name.material = materialName



        const textureInitiative = new BABYLON.DynamicTexture("dynamic texture", { width: 400, height: 100 }, this.scene);

        const materialInitiative = new BABYLON.StandardMaterial("Mat", this.scene);
        materialInitiative.diffuseTexture = textureInitiative;
        textureInitiative.drawText("+2", 160, 80, font, "yellow", "#0101", false, true);
        this.parts.meta.material = materialInitiative

        modelImport.meshes[0].rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.LOCAL)
        modelImport.meshes[0].rotate(new BABYLON.Vector3(0, 0, 1), Math.PI, BABYLON.Space.LOCAL)

    }
}