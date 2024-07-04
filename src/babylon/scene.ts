import * as BABYLON from 'babylonjs'
import { RenderAction, type renderCallback } from './renderable'
import { PlayerCard } from './playerCard'
export default class Scene {
    engine: BABYLON.Engine
    scene: BABYLON.Scene
    canvas: HTMLCanvasElement
    camera: BABYLON.FreeCamera
    renderActions: Array<RenderAction>

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.renderActions = []
        this.init()
        this.initExampleScene()
    }

    init() {
        this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true })

        this.scene = new BABYLON.Scene(this.engine)
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)

        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), this.scene)
        this.camera.setTarget(BABYLON.Vector3.Zero())
        this.camera.attachControl(this.canvas, false)
        this.engine.runRenderLoop(this.render.bind(this))

        window.addEventListener('resize', this.onResize.bind(this))

        this.renderCards()
    }


    /*
        renders simple example scene
    */
    initExampleScene() {
        //Create a basic light, aiming 0, 1, 0 - meaning, to the sky
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene)
        // Create a built-in "sphere" shape its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
        // const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene, false, BABYLON.Mesh.FRONTSIDE)
        // // Move the sphere upward 1/2 of its height
        // sphere.position.y = 1
        // // Create a built-in "ground" shape its constructor takes 6 params : name, width, height, subdivision, scene, updatable
        // const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene, false)
    }

    renderCards(){
        const playerCard = new PlayerCard({
            xPos:0,
            yPos: 0,
            name: "Jelle",
            imgUrl: "/",
            initiatve: 0,
            scene: this.scene
        })
    }


    /*
       handle window resize event
    */
    onResize() {
        this.engine.resize()
    }

    /*
        Render function, called in the render loop
        Don't add function calls to here directly
        use registerRenderAction instead
    */
    render() {
        this.scene.render()
        this.renderActions.forEach((action: RenderAction) => action.render("add timestmap"))
    }


    /*
        register a function to the render loop and order accordingly
        actions with a lower order get executed first
    */
    registerRenderAction(name: string, order: number, callback: renderCallback) {
        const renderAction = new RenderAction(name, order, callback)
        this.renderActions.push(renderAction)
        this.renderActions.sort((a, b) => {
            return a.order - b.order
        })
    }
}