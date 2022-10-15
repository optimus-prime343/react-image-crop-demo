import React from 'react'
import { ReactImageCropper } from '../components/react-image-cropper'

const Home = () => {
  return (
    <div>
      <ReactImageCropper onCropComplete={console.log} />
    </div>
  )
}

export default Home
