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
  camera2: BABYLON.ArcRotateCamera

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
    this.initShader()
    this.initPostProcessing()
    this.readPlayersFromLocalStore()
  }

  initScene() {
    this.engine = new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true
    })

    this.scene = new BABYLON.Scene(this.engine)
    this.scene.useRightHandedSystem = true
    this.scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.001, 1)
    this.scene.fogMode = 1

    this.scene.fogEnabled = true
    this.scene.fogDensity = 0.0025
    this.scene.fogColor = new BABYLON.Color3(0.25, 0.25, 0.25)

    window.addEventListener('resize', this.onResize.bind(this))
    this.engine.runRenderLoop(this.render.bind(this))

    BABYLON.ParticleHelper.CreateAsync('rain', this.scene, false).then((set) => {
      set.systems[0].updateSpeed = 0.1
      set.start()
    })

  }

  initCamera() {
    const MASK = 0x10000000;
    this.camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      Math.PI / 2,
      20,
      new BABYLON.Vector3(4, 0, 0),
      this.scene
    )

    this.camera.setTarget(new BABYLON.Vector3(0, 2, 0))
    this.camera.attachControl(this.canvas, false)

    this.camera2 = new BABYLON.ArcRotateCamera(
      'Camera2',
      0,
      Math.PI / 2,
      20,
      new BABYLON.Vector3(4, 0, 0),
      this.scene
    )

    this.camera2.setTarget(new BABYLON.Vector3(0, 2, 0))
    this.camera2.attachControl(this.canvas, false)
    this.camera2.layerMask=MASK

    this.scene.activeCameras = [ this.camera, this.camera2]
  }

  initWorld() {
    new Brazier(this.scene, new BABYLON.Vector3(3, -5, -12))
    new Brazier(this.scene, new BABYLON.Vector3(3, -5, 12))
    new Background(this.scene)
  }

  initShader(){

    BABYLON.Effect.ShadersStore['customFragmentShader'] = `
    #version 300 es
    precision highp float;
    
    uniform float matrixSize;
    uniform float bias;

    // Samplers
    in vec2 vUV;
    uniform sampler2D textureSampler;

    // Parameters
    uniform vec2 resolution;
    uniform float threshold;
    
    const mat2x2 bayerMatrix2x2 = mat2x2(
        0.0, 2.0,
        3.0, 1.0
    ) / 4.0;
    
    const mat4x4 bayerMatrix4x4 = mat4x4(
        0.0,  8.0,  2.0, 10.0,
        12.0, 4.0,  14.0, 6.0,
        3.0,  11.0, 1.0, 9.0,
        15.0, 7.0,  13.0, 5.0
    ) / 16.0;
    
    const float bayerMatrix8x8[64] = float[64](
        0.0/ 64.0, 48.0/ 64.0, 12.0/ 64.0, 60.0/ 64.0,  3.0/ 64.0, 51.0/ 64.0, 15.0/ 64.0, 63.0/ 64.0,
      32.0/ 64.0, 16.0/ 64.0, 44.0/ 64.0, 28.0/ 64.0, 35.0/ 64.0, 19.0/ 64.0, 47.0/ 64.0, 31.0/ 64.0,
        8.0/ 64.0, 56.0/ 64.0,  4.0/ 64.0, 52.0/ 64.0, 11.0/ 64.0, 59.0/ 64.0,  7.0/ 64.0, 55.0/ 64.0,
      40.0/ 64.0, 24.0/ 64.0, 36.0/ 64.0, 20.0/ 64.0, 43.0/ 64.0, 27.0/ 64.0, 39.0/ 64.0, 23.0/ 64.0,
        2.0/ 64.0, 50.0/ 64.0, 14.0/ 64.0, 62.0/ 64.0,  1.0/ 64.0, 49.0/ 64.0, 13.0/ 64.0, 61.0/ 64.0,
      34.0/ 64.0, 18.0/ 64.0, 46.0/ 64.0, 30.0/ 64.0, 33.0/ 64.0, 17.0/ 64.0, 45.0/ 64.0, 29.0/ 64.0,
      10.0/ 64.0, 58.0/ 64.0,  6.0/ 64.0, 54.0/ 64.0,  9.0/ 64.0, 57.0/ 64.0,  5.0/ 64.0, 53.0/ 64.0,
      42.0/ 64.0, 26.0/ 64.0, 38.0/ 64.0, 22.0/ 64.0, 41.0/ 64.0, 25.0/ 64.0, 37.0/ 64.0, 21.0 / 64.0
    );
    
    vec3 orderedDither(vec2 uv, float lum) {
      vec3 color = vec3(0.0);
    
      float threshold = 0.0;
    
      if (matrixSize == 2.0) {
        int x = int(uv.x * resolution.x) % 2;
        int y = int(uv.y * resolution.y) % 2;
        threshold = bayerMatrix2x2[y][x];
      }
    
      if (matrixSize == 4.0) {
        int x = int(uv.x * resolution.x) % 4;
        int y = int(uv.y * resolution.y) % 4;
        threshold = bayerMatrix4x4[y][x];
      }
    
      if (matrixSize == 8.0) {
        int x = int(uv.x * resolution.x) % 8;
        int y = int(uv.y * resolution.y) % 8;
        threshold = bayerMatrix8x8[y * 8 + x];
      }
    
      if (lum < threshold + bias) {
          color = vec3(0.0);
      } else {
          color = vec3(1.0); 
      }
    
      return color;
    }
    
    out vec4 fragColor;
    
    void main(void) {
        vec4 color = texture(textureSampler, vUV);
        float lum = dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
        color.rgb = orderedDither(vUV, lum);
    
      fragColor = color;
    }
    `

    var postProcess = new BABYLON.PostProcess(
      'My custom post process',
      'custom',
      ["resolution", "threshold", "matrixSize", "bias"],
      null,
      0.25,
      this.camera
    )
    postProcess.onApply = function (effect) {
      effect.setFloat2('resolution', window.innerWidth, window.innerHeight)
      effect.setFloat('matrixSize', 8.0)
      effect.setFloat('bias', 0.1)
    }
  }

  initLights() {
    const light = new BABYLON.HemisphericLight('test', new BABYLON.Vector3(0, 1, -1))
    light.intensity = 2
    light.diffuse = BABYLON.Color3.Yellow()
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

  initPostProcessing() {
    const defaultPipeline = new BABYLON.DefaultRenderingPipeline('default', true, this.scene, [
      this.camera
    ])
    const blendMode = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY

    defaultPipeline.fxaaEnabled = true
    defaultPipeline.imageProcessingEnabled = true
    defaultPipeline.imageProcessing.colorCurvesEnabled = true
    defaultPipeline.imageProcessing.vignetteEnabled = true
    defaultPipeline.imageProcessing.toneMappingEnabled = true
    defaultPipeline.imageProcessing.vignetteBlendMode = blendMode
    defaultPipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0,1, 0, 1)
    defaultPipeline.imageProcessing.vignetteWeight = 4
  }
}
