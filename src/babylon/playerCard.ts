

type PlayerData = {
    xPos: number
    yPos: number
    name: string
    initiatve?: number
    imgUrl: string
}

export class PlayerCard {
    xPos: number
    yPos: number
    name: string
    initiatve?: number
    imgUrl: string

    constructor(playerData: PlayerData) {
        Object.assign(this, playerData)
        console.log(this)
    }
}