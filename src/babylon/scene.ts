import * as BABYLON from 'babylonjs'
import { RenderAction, type renderCallback } from './renderable'
import { PlayerCard } from './playerCard'
import type { PlayerStore } from '@/stores/players'
import Brazier from './brazier'
import { CardsFan } from './cardsFan'
import { Background } from './background'

export default class Scene {
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  canvas: HTMLCanvasElement
  camera: BABYLON.ArcRotateCamera
  renderActions: Array<RenderAction>
  players: Array<PlayerCard>
  cardParent: BABYLON.AbstractMesh
  store: PlayerStore
  backgroundCamera: BABYLON.ArcRotateCamera
  fan: CardsFan

  constructor(canvas: HTMLCanvasElement, store: PlayerStore) {
    this.canvas = canvas
    this.store = store
    this.renderActions = []
    this.players = []
  }

  async init() {
    this.initScene()
    this.initCamera()
    this.initLights()
    this.initWorld()
    this.initPostProcessing()
    this.readPlayersFromLocalStore()
  }

  initScene(){
    this.engine = new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true
    })

    this.scene = new BABYLON.Scene(this.engine)
    this.scene.useRightHandedSystem = true
    this.scene.clearColor = new BABYLON.Color4(0.001, 0.001, 0.001, 1)
    this.scene.fogMode = 3

    this.scene.fogEnabled = true
    this.scene.fogDensity = 2
   
    window.addEventListener('resize', this.onResize.bind(this))
    this.engine.runRenderLoop(this.render.bind(this))
  }

  initCamera(){
    this.camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      Math.PI / 2,
      20,
      new BABYLON.Vector3(8, 2, 0),
      this.scene
    )

    this.camera.setTarget(new BABYLON.Vector3(0,2,0))
    this.camera.attachControl(this.canvas, false)
  }

  initWorld(){
    new Brazier(this.scene, new BABYLON.Vector3(3, -5, -12))
    new Brazier(this.scene, new BABYLON.Vector3(3, -5, 12))
    new Background(this.scene)
  }

  initLights(){
    const light = new BABYLON.HemisphericLight("test", new BABYLON.Vector3(-1,1,-1));
    light.intensity = 2
  }

  async clearScene() {
    if (this.fan) {
      return await this.fan.destroy()
    }
  }

  async readPlayersFromLocalStore() {
    const allPlayers = this.store.results
    this.fan = new CardsFan(this.scene, allPlayers)
    this.fan.init()
  }

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
    this.renderActions.forEach((action: RenderAction) => action.render('add timestmap'))
    if (this.fan) {
      this.fan.update()
    }
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

  initPostProcessing(){
    const defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, this.scene, [this.camera])
    const blendMode = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY

    defaultPipeline.fxaaEnabled = true
    defaultPipeline.imageProcessingEnabled = true
    defaultPipeline.imageProcessing.colorCurvesEnabled = true
    defaultPipeline.imageProcessing.vignetteEnabled = true
    defaultPipeline.imageProcessing.toneMappingEnabled = true
    defaultPipeline.imageProcessing.vignetteBlendMode = blendMode;
    defaultPipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0.5,0, 0, 1)
    defaultPipeline.imageProcessing.vignetteWeight = 4
  }
}
