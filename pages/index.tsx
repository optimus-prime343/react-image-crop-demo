import Head from 'next/head'
import React from 'react'
import { ReactImageCropper } from '../components/react-image-cropper'

const Home = () => {
  return (
    <>
      <Head>
        <title>React image crop demo</title>
      </Head>
      <div>
        <ReactImageCropper onCropComplete={console.log} />
      </div>
    </>
  )
}

export default Home
