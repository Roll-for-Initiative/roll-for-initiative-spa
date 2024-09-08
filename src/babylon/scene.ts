import * as BABYLON from 'babylonjs'
import { RenderAction, type renderCallback } from './renderable'
import { PlayerCard } from './playerCard'
import type { PlayerStore } from '@/stores/players'
import { degToRad } from './utils'
import Brazier from './brazier'

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

  constructor(canvas: HTMLCanvasElement, store: PlayerStore) {
    this.canvas = canvas
    this.store = store
    this.renderActions = []
    this.players = []
    this.init()
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
      10,
      new BABYLON.Vector3(0, 0, -3),
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

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, -3), this.scene)
    light.intensity = .75

    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP

    this.scene.fogColor = new BABYLON.Color3(1, 1, 1)
    this.scene.fogDensity = 0.00005

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
    
    new Brazier(this.scene, new BABYLON.Vector3(0,0,-10))
    new Brazier(this.scene, new BABYLON.Vector3(0,0,10))
   
  }

  async readPlayersFromLocalStore() {
    this.store.roll()
    const allPlayers = this.store.results

    this.cardParent = new BABYLON.Mesh('cardParent', this.scene)
    // const range = degToRad(140)
    // const initialAngle  = degToRad(110)

    const calcAlignment = async (cardIndex, cardCount, player) => {
      const maxRotation = degToRad(45); //The absolute value of the rotation for the leftmost and rightmost cards (in degrees)
      const xOffset = 0; //The horizontal center of the card fan (in worldspace units)
      const xRange = 3; //The horizontal range of the card fan (in worldspace units)

      let alignResult = 0.5;
      if (cardCount >= 2) alignResult = cardIndex / (cardCount - 1.0);
      const rotZ = BABYLON.Scalar.Lerp(-maxRotation, maxRotation, alignResult);
      const xPos = BABYLON.Scalar.Lerp(xOffset - xRange, xOffset + xRange, alignResult);

      if (alignResult > 0.5) alignResult = 1 - alignResult;
      alignResult *= 2;
      
      return {
        cardAngle: rotZ,
        cardPos: xPos,
        cardOrigin: new BABYLON.Vector3(0, 0, 0),
        index: cardIndex
      }

    }

    let initialCardInfo = null

    for (let i = 0; i < allPlayers.length -1 ; i++) {
      const cardInfo = await calcAlignment(i, allPlayers.length-1,allPlayers[i])
      if (!origin) {
        initialCardInfo = cardInfo
      }
      
      this.createCard(allPlayers[i],i+ 1,cardInfo, origin)
    }
  }

  async createCard( player, initiative, cardInfo: {cardPos, cardAngle, cardOrigin, cardIndex}, startInfo) {
    const playerCard = new PlayerCard({
      xPos: cardInfo.cardPos * (8 * 0.25),
      yPos: 0,
      name: player.name,
      imgUrl: player.imgUrl,
      modifier: initiative,//allPlayers.indexOf(player) + 1,
      scene: this.scene,
      parent: this.cardParent,
      cardInfo: cardInfo,
      startInfo:startInfo
    })
    await playerCard.loadModel()
    this.players.push(playerCard)
  }

  async revealCards() {
    for (const player of this.players) {
      await player.reveal()
    }
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
    for (const player of this.players) {
      // player.idleLerp()
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