import * as BABYLON from 'babylonjs'
import modelUrl from './../assets/models/card.gltf?url'
import 'babylonjs-loaders';
import { animationAsync } from './utils';

type PlayerData = {
    xPos: number
    yPos: number
    name: string
    modifier: number
    imgUrl: string
    scene: BABYLON.Scene
    parent: BABYLON.AbstractMesh
    mainMesh?: BABYLON.AbstractMesh
}

type cardParts = {
    backdrop: BABYLON.AbstractMesh,
    name: BABYLON.AbstractMesh,
    initiative: BABYLON.AbstractMesh,
    meta: BABYLON.AbstractMesh,
    picture: BABYLON.AbstractMesh,
}

const IMAGES = [
    "dragon.jpg",
    "dwarf.jpg",
    "jelle.jpg",
    "wizard.jpg"
]

const MONSTERS = [
    "monsters.jpg",
]

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
    dir: number
    speed: number;
    startPos: BABYLON.Vector3
    endPos: BABYLON.Vector3;

    constructor(playerData: PlayerData) {
        Object.assign(this, playerData)
    }

    async loadModel() {
        const pathParts = modelUrl.split('/')
        const fileName = pathParts.pop()
        const path = pathParts.join("/")
        console.log(`${path}${fileName}`)
        const model = await BABYLON.SceneLoader.ImportMeshAsync("", "src/assets/models/card.glb", "", this.scene)
        console.log("meshe", model.meshes[0].getChildren())

        this.parts = {
            backdrop: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === "backdrop")[0],
            name: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === "name")[0],
            initiative: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === "initiative")[0],
            meta: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === "meta")[0],
            picture: model.meshes[0].getChildMeshes(false, (mesh) => mesh.name === "picture")[0]
        }
        this.mainMesh = model.meshes[0]


        this.parts.initiative.visibility = 0

        const backdropMaterial = new BABYLON.StandardMaterial("backdropMaterial", this.scene);
        backdropMaterial.diffuseTexture = new BABYLON.Texture("src/assets/models/textures/wood.jpg", this.scene);
        backdropMaterial.diffuseColor = BABYLON.Color3.FromHexString("#954535");
        this.parts.backdrop.material = backdropMaterial
        this.dir = 1
        this.speed = Math.random()


        // const pictureMaterial = new BABYLON.StandardMaterial("pictureMaterial", this.scene);
        // console.log(imgName)
        // pictureMaterial.diffuseTexture = new BABYLON.Texture(`http://localhost:5173/src/assets/models/textures/${imgName}`, this.scene);
        // this.parts.picture.material = pictureMaterial
        // console.log(this.name)


        // console.log(myNodeMaterial)
        const imgName = this.name === "Monsters" ? MONSTERS[Math.floor(Math.random() * MONSTERS.length)] : IMAGES[Math.floor(Math.random() * IMAGES.length)]
        const nm = await BABYLON.NodeMaterial.ParseFromSnippetAsync("IG38UL#15", this.scene)

        console.log(this.parts.picture)
        //   console.log('before',  mat.getBlockByPredicate(input => input.name === "pic    ture").texture as)
        const textureBlock = nm.getBlockByPredicate(input => input.name === "picture") as BABYLON.TextureBlock;
        console.log("texture block", textureBlock)
        const interval = setInterval(()=>{
            console.log(textureBlock.isReady())
            if (textureBlock.isReady()){
                const imgName = this.name === "Monsters" ? MONSTERS[Math.floor(Math.random() * MONSTERS.length)] : IMAGES[Math.floor(Math.random() * IMAGES.length)]
                console.log(imgName)
                const text = new BABYLON.Texture(`src/assets/models/textures/${imgName}`, this.scene);
                console.log(text)
                textureBlock.texture = text
                clearInterval(interval)
                textureBlock.visibleOnFrame = true
                console.log('texture block',textureBlock.texture)


            }
        }, 200)
        this.parts.picture.material = nm
        

        //   mat.getBlockByPredicate(input => input.name === "picture").source = 
        //   console.log('after',  mat.getBlockByPredicate(input => input.name === "picture").texture)

        // });


        const font = "82px RuneScape Chat";




        const textureName = new BABYLON.DynamicTexture("nameTexture", { width: 400, height: 100 }, this.scene);
        const materialName = new BABYLON.StandardMaterial("nameMaterial", this.scene);
        materialName.diffuseTexture = textureName;
        textureName.drawText(this.name, 40, 80, font, "yellow", "#0101", false, true);
        this.parts.name.material = materialName


        const textureInitiative = new BABYLON.DynamicTexture("initiativeTexture", { width: 400, height: 100 }, this.scene);
        const materialInitiative = new BABYLON.StandardMaterial("initiativeMaterial", this.scene);
        materialInitiative.diffuseTexture = textureInitiative;
        textureInitiative.drawText(`+${this.modifier}`, 160, 80, font, "yellow", "#0101", false, true);
        this.parts.meta.material = materialInitiative

        model.meshes[0].rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.LOCAL)
        model.meshes[0].rotate(new BABYLON.Vector3(0, 0, 1), -Math.PI / 2, BABYLON.Space.LOCAL)
        model.meshes[0].rotate(new BABYLON.Vector3(0, 1, 0), -Math.PI, BABYLON.Space.WORLD)


        this.parent.addChild(model.meshes[0])
        model.meshes[0].position._z = this.xPos * 5

        this.startPos = this.mainMesh.position
        const moveDistance = new BABYLON.Vector3(0,5,0)

        this.endPos = this.mainMesh.position.add(BABYLON.Vector3.Up().multiply(moveDistance))

    }
    
    idleLerp(){
        // const amplitude = 1
        // const period = 1000000
        // const theta = BABYLON.Tools.Now / period
        // const distance = amplitude * Math.sin(theta)
        // const scalar = BABYLON.Vector3.Up().multiplyByFloats(0, distance, 0)
        // this.mainMesh.position = this.startPos.addInPlace(scalar)
        let t = BABYLON.Tools.Now / 10000 * this.speed;
        t = Math.sin(t * Math.PI * 0.5);
        this.mainMesh.position = BABYLON.Vector3.Lerp(this.startPos, this.endPos, t);

    }

    async reveal() {
        return await animationAsync((resolver) => {
            BABYLON.Animation.CreateAndStartAnimation(
                'reveal',
                this.mainMesh,
                'rotation',
                160,
                120,
                new BABYLON.Vector3(Math.PI / 2., -Math.PI / 2, 0),
                new BABYLON.Vector3(Math.PI / 2., Math.PI / 2, 0),
                0,
                undefined,
                resolver
            )
        })
    }

    idle() {
        if (this.mainMesh.position.y >= 1.5){
            this.dir = -1
        }else if (this.mainMesh?.position.y <= -1.5){
            this.dir = 1
        }
        this.mainMesh.position.y +=  this.speed * this.dir
    }

}