import * as BABYLON from 'babylonjs'
export default class Brazier {
    scene: BABYLON.Scene
    position: BABYLON.Vector3
    mesh: BABYLON.Mesh

    constructor(scene: BABYLON.Scene, position: BABYLON.Vector3){
        this.scene = scene
        this.position = position
        this.init()
    }

    async init (){
        this.mesh = new BABYLON.Mesh("brazier", this.scene)
        this.mesh.position = this.position

        const fireSystem = await BABYLON.ParticleHelper.CreateAsync("fire", this.scene)
        fireSystem.start(this.mesh)

        const fireLight1 = new BABYLON.PointLight('fire1', this.mesh.position, this.scene)
        fireLight1.diffuse = new BABYLON.Color3(252/255, 100/255,0)
        fireLight1.intensity = 50
    }
}