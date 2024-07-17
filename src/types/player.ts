export interface Player {
  id: string
  name: string
  modifier: number
  imgUrl: string //should be base64 encoded image later
  roll: number
  reroll?: number | null
}
