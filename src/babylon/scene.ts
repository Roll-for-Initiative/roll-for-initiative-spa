import * as BABYLON from 'babylonjs'
import { RenderAction, type renderCallback } from './renderable'
import { PlayerCard } from './playerCard'
import type { PlayerStore } from '@/stores/players'
import Brazier from './brazier'
import { CardsFan } from './cardsFan'

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
    this.engine = new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true
    })

    this.scene = new BABYLON.Scene(this.engine)
    this.scene.useRightHandedSystem = true
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)

    this.camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      Math.PI / 2,
      20,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    )

    this.backgroundCamera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      Math.PI / 2,
      10,
      new BABYLON.Vector3(0, 0, -3),
      this.scene
    )

    this.camera.setTarget(BABYLON.Vector3.Zero())
    this.camera.attachControl(this.canvas, false)

    this.camera.useFramingBehavior = true

    if (this.camera.framingBehavior) {
      this.camera.framingBehavior.mode = BABYLON.FramingBehavior.FitFrustumSidesMode
    }

    window.addEventListener('resize', this.onResize.bind(this))

    this.readPlayersFromLocalStore()

    this.engine.runRenderLoop(this.render.bind(this))

    const ground = BABYLON.CreateGround('ground', {
      width: 25,
      height: 25
    })

    ground.position.y = -5
    const groundMat = new BABYLON.PBRMaterial('ground', this.scene)
    groundMat.albedoTexture = new BABYLON.Texture('models/textures/rock.jpg')
    groundMat.roughness = 1
    ground.material = groundMat

    new Brazier(this.scene, new BABYLON.Vector3(3, -5, -10))
    new Brazier(this.scene, new BABYLON.Vector3(3, -5, 10))

    const defaultPipeline = new BABYLON.DefaultRenderingPipeline('default', true, this.scene, [
      this.camera
    ])
    defaultPipeline.bloomEnabled = true
    defaultPipeline.fxaaEnabled = true
    defaultPipeline.imageProcessingEnabled = true
    // defaultPipeline.chromaticAberrationEnabled = true
    defaultPipeline.imageProcessing.colorCurvesEnabled = true
    defaultPipeline.imageProcessing.vignetteEnabled = true
    defaultPipeline.imageProcessing.toneMappingEnabled = true
    const blendMode = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES
    defaultPipeline.imageProcessing.vignetteBlendMode = blendMode
    defaultPipeline.imageProcessing.vignetteColor = new BABYLON.Color4(166, 55, 41, 1)
    defaultPipeline.imageProcessing.vignetteWeight = 0.00005
    console.log(defaultPipeline.imageProcessing.vignetteColor)

    defaultPipeline.bloomWeight = 0.25
    defaultPipeline.bloomScale = 0.2
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
    this.camera.setTarget(this.fan.body.position.subtract(new BABYLON.Vector3(0, 0, -0)))
  }

  updateBoundingBoxForMesh(mesh: BABYLON.AbstractMesh) {
    console.log(this.cardParent.getChildMeshes(true))
    const children = mesh.getChildMeshes(false)
    let boundingInfo = children[0].getBoundingInfo()
    let min = boundingInfo.minimum.add(children[0].position)
    let max = boundingInfo.maximum.add(children[0].position)
    for (let i = 1; i < children.length; i++) {
      boundingInfo = children[i].getBoundingInfo()
      min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(children[i].position))
      max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(children[i].position))
    }
    mesh.setBoundingInfo(new BABYLON.BoundingInfo(min, max))
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
}

// var ligasdasdht = new BABYLON.HemisphericLight("test", BABYLON.Vector3.Forward());
// var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, this.scene, [this.camera]);
// defaultPipeline.bloomEnabled = true;
// defaultPipeline.fxaaEnabled = true;
// defaultPipeline.imageProcessingEnabled = true
// defaultPipeline.chromaticAberrationEnabled = true
// defaultPipeline.imageProcessing.colorCurvesEnabled = true
// defaultPipeline.imageProcessing.vignetteEnabled = true
// defaultPipeline.imageProcessing.toneMappingEnabled = true
// var blendMode = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_OPAQUE
// defaultPipeline.imageProcessing.vignetteBlendMode = blendMode;
// defaultPipeline.imageProcessing.vignetteColor = new BABYLON.Color4(Math.random() * 255, Math.random() * 255, Math.random() * 255, Math.random() * 255)
// defaultPipeline.imageProcessing.vignetteWeight = 0.005

// defaultPipeline.bloomWeight = 0.5;
// defaultPipeline.bloomScale = 0.5
