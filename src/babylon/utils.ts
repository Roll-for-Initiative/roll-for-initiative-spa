

export type AnimationAsync = (resolver: () => void) => void


/*
    wrapper to make it easy to for animations to finish
    param animationCallback should be a void of type animationAsync
    
    example:

    const reveal = (resolver: () => void) => {
        BABYLON.Animation.CreateAndStartAnimation('animate rotate', this.mainMesh, 'rotation',
            60, 100,
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(1, 1, 1),
            0, undefined, resolver)
    }

    resolver is injected by the wrapper and does nothing 
    more than resolve the promise after the animation is finished
*/

export const animationAsync = async (animationCallback: AnimationAsync) => {
    return new Promise((resolve, reject) => {
        const resolver = () => {
            resolve(null)
        }

        animationCallback(resolver)
    });
}


export const degToRad = (degrees: number) => {
    return degrees * (Math.PI / 180);
}