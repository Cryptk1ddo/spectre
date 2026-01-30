import { Composition } from 'remotion'
import { SpectreDemo } from './SpectreDemo'

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="SpectreDemo"
        component={SpectreDemo}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}

export default RemotionRoot
