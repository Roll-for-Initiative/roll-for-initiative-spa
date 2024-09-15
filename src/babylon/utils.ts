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
  })
}

export const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

export const updateBoundingBoxForMesh = (mesh: BABYLON.AbstractMesh) => {
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
