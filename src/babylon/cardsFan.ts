import { PlayerCard, type CardInfo } from './playerCard'
import * as BABYLON from 'babylonjs'
import { degToRad } from './utils'
import type { Player } from '@/types/player'

export class CardsFan {
  scene: BABYLON.Scene
  cards: Array<PlayerCard>
  body: BABYLON.Mesh
  frame : number
  players: Array<Player>
    initialCardInfo: { cardAngle: number; cardPosition: BABYLON.Vector3; cardOrigin: BABYLON.Vector3; index: number }
    initialized: boolean

  constructor(scene: BABYLON.Scene, players: Array<Player>) {
    this.scene = scene
    this.players = players
    this.cards = []
    this.frame = 0
    this.initialized = false
    this.init()
  }

  async init() {
    this.body = new BABYLON.Mesh('body', this.scene)
    // const range = degToRad(140)
    // const initialAngle  = degToRad(110)

    for (let i = 0; i < this.players.length - 1; i++) {
      const cardInfo = await this.calcAlignment(i, this.players.length - 1)
      if (!this.initialCardInfo) {
        this.initialCardInfo = cardInfo
      }

      const card = await this.createCard(this.players[i], i + 1, cardInfo)
      this.cards.push(card)
      card.setPosition(this.initialCardInfo.cardPosition)
    
      card.setRotation(BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 0, 0), this.initialCardInfo.cardAngle))
      card.setPosition(this.initialCardInfo.cardPosition)
    }

    this.initialized = true
  }

  update(){
    if (!this.initialized) return 
    for (const card of this.cards){
        const target =  BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 0, 0), card.cardInfo.cardAngle)
        const current = card.rotation
        const movement = BABYLON.Quaternion.Slerp(current, target, 0.1)
        card.setRotation(movement)

        const pos = BABYLON.Vector3.Lerp(card.position, card.cardInfo.cardPosition,this.frame/100000)
        console.log(this.scene.deltaTime)
        card.setPosition(pos)
        this.frame+= this.scene.deltaTime || 0
    }
  }

  calcAlignment = (cardIndex: number, cardCount: number) => {
    const maxRotation = degToRad(45) //The absolute value of the rotation for the leftmost and rightmost cards (in degrees)
    const xOffset = 0 //The horizontal center of the card fan (in worldspace units)
    const xRange = 3 //The horizontal range of the card fan (in worldspace units)

    let alignResult = 0.5
    if (cardCount >= 2) alignResult = cardIndex / (cardCount - 1.0)
    const rotZ = BABYLON.Scalar.Lerp(-maxRotation, maxRotation, alignResult)
    const xPos = BABYLON.Scalar.Lerp(xOffset - xRange, xOffset + xRange, alignResult)

    if (alignResult > 0.5) alignResult = 1 - alignResult
    alignResult *= 2

    return {
      cardAngle: -rotZ,
      cardPosition: new BABYLON.Vector3(cardIndex * 0.25, 0, -xPos * 2.5),
      cardOrigin: new BABYLON.Vector3(0, 0, 0),
      index: cardIndex
    }
  }

  async createCard(
    player: Player,
    initiative: number,
    cardInfo: CardInfo,
  ) {
    const playerCard = new PlayerCard({
      xPos: 0,
      yPos: 0,
      name: player.name,
      imgUrl: player.imgUrl,
      modifier: initiative, //allPlayers.indexOf(player) + 1,
      scene: this.scene,
      parent: this.body,
      cardInfo: cardInfo,
      rotation: BABYLON.Quaternion.Zero()
    })
    await playerCard.loadModel()
    return playerCard
  }

  async revealCards() {
    for (const card of this.cards) {
      await card.reveal()
    }
  }
}
