
/*
    Small interface for render functions
*/
export interface renderCallback { (timestamp: string): void }


/*
    Simple wrapper to enable order of execution for render loop

    ** todo:
        add timestamp

    example:
    this.registerRenderAction("test", 0, ()=>{console.log('hi from renderloop 0')})
*/
export class RenderAction {
    name: string
    order: number
    render: renderCallback

    constructor(name: string, order:number, callback:renderCallback){
        this.name = name
        this.order = order
        this.render = callback
    }
}