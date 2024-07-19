import * as BABYLON from 'babylonjs'
import { RenderAction, type renderCallback } from './renderable'
import { PlayerCard } from './playerCard'
import type { PlayerStore } from '@/stores/players'

export default class Scene {
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  canvas: HTMLCanvasElement
  camera: BABYLON.ArcRotateCamera
  renderActions: Array<RenderAction>
  players: Array<PlayerCard>
  cardParent: BABYLON.AbstractMesh
  store: PlayerStore

  constructor(canvas: HTMLCanvasElement, store: PlayerStore) {
    this.canvas = canvas
    this.store = store
    this.renderActions = []
    this.players = []
    this.init()
  }

  init() {
    this.engine = new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true
    })

    this.scene = new BABYLON.Scene(this.engine)
    this.scene.useRightHandedSystem = true
    this.scene.clearColor = new BABYLON.Color4(0,0, 0, 0)
    this.camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      Math.PI / 2,
      10,
      new BABYLON.Vector3(0, 0,-3),
      this.scene
    ) //new BABYLON.ArcRotateCamera('camera', new BABYLON.Vector3(0, 5, -10), this.scene)
    this.camera.setTarget(BABYLON.Vector3.Zero())
    this.camera.attachControl(this.canvas, false)

    // this.camera.lowerRadiusLimit = 6
    // this.camera.upperRadiusLimit = 20
    this.camera.useFramingBehavior = true

    if (this.camera.framingBehavior) {
      this.camera.framingBehavior.mode = BABYLON.FramingBehavior.FitFrustumSidesMode
    }

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, -3), this.scene)
    light.intensity = 1.5

    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP

    this.scene.fogColor = new BABYLON.Color3(1, 1, 1)
    this.scene.fogDensity = 0.00005

    window.addEventListener('resize', this.onResize.bind(this))

    this.readPlayersFromLocalStore()

    this.engine.runRenderLoop(this.render.bind(this))

    // const rotState = { x: this.camera.alpha, y: this.camera.beta }
    // this.scene.registerBeforeRender(() => {
    //   this.camera.alpha = rotState.x;
    //   this.camera.beta = rotState.y;
    // })

  }


  async readPlayersFromLocalStore() {
    // const { dungeonMaster, players } = JSON.parse(localStorage.players)
    this.store.roll()
    const allPlayers = this.store.results

    this.cardParent = new BABYLON.Mesh('cardParent', this.scene)
    let idx = 1
    for (const player of allPlayers) {
      const playerCard = new PlayerCard({
        xPos: this.players.length * -0.75 + +0.5, //ugly fixed when model is less crappy
        yPos: 0,
        name: player.name,
        imgUrl: player.imgUrl,
        modifier: idx,
        scene: this.scene,
        parent: this.cardParent
      })
      await playerCard.loadModel()
      this.players.push(playerCard)
      idx ++
    }

    this.updateBoundingBoxForMesh(this.cardParent)
    this.cardParent._updateBoundingInfo()
    this.camera.setTarget(this.cardParent)

    this.revealCards()
  }

  async revealCards() {
    for (const player of this.players) {
      await player.reveal()
    }
  }

  // async hideCards(){
  //     for(const player of this.players){
  //         await player.hide()
  //     }
  // }

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
    this.renderActions.forEach((action: RenderAction) => action.render("add timestmap"))
    for (const player of this.players){
      player.idleLerp()
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
