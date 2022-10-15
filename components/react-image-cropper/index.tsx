import { useState, useRef } from 'react'
import {
  Box,
  FileInput,
  Divider,
  Modal,
  Slider,
  Button,
  Stack,
  Text,
  Image,
  Title,
} from '@mantine/core'
import { createStyles } from '@mantine/styles'
import EasyCrop from 'react-easy-crop'
import type { Point, Area } from 'react-easy-crop/types'

import { getCroppedImg } from '../../utils/crop-image'

export interface ReactImageCropperProps {
  onCropComplete: (formData: FormData) => void
}
export const ReactImageCropper = ({ onCropComplete }: ReactImageCropperProps) => {
  const [previewImage, setPreviewImage] = useState<string | undefined>()
  const [croppedImage, setCroppedImage] = useState<string | undefined>()
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | undefined>()

  const { classes } = useStyles()

  const handleFileUpload = (file: File | null) => {
    if (!file) return
    const preview = URL.createObjectURL(file)
    setPreviewImage(preview)
  }
  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const cropImage = async () => {
    if (!previewImage) return
    try {
      const blob = await getCroppedImg(previewImage, croppedAreaPixels, rotation)
      console.log('🚀 ~ file: index.tsx ~ line 34 ~ cropImage ~ blob', blob)

      if (!blob) return

      const file = new File([blob], 'Cropped image')
      const formData = new FormData()
      formData.append('profileImage', file)
      onCropComplete(formData)
      setCroppedImage(blob as string)
      setPreviewImage(undefined)
    } catch (error) {
      console.log('Error cropping image')
    }
  }

  return (
    <>
      <Modal
        centered
        closeOnClickOutside={false}
        opened={!!previewImage}
        onClose={() => setPreviewImage(undefined)}
        size='xl'
      >
        <Box className={classes.cropContainer}>
          <EasyCrop
            zoomWithScroll
            cropShape='round'
            aspect={1}
            objectFit='horizontal-cover'
            crop={crop}
            image={previewImage}
            zoom={zoom}
            rotation={rotation}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            // disableAutomaticStylesInjection
          />
        </Box>
        <Divider my='md' />
        <Stack spacing='xs'>
          <Slider
            label={`Zoom: ${zoom}`}
            min={1}
            max={100}
            value={zoom}
            onChange={setZoom}
          />
          <Slider
            label={`Rotation: ${rotation}`}
            min={0}
            max={360}
            value={rotation}
            onChange={setRotation}
          />
          <Button onClick={cropImage}>Crop image</Button>
        </Stack>
      </Modal>
      {croppedImage ? (
        <Stack align='center' justify='center' sx={{ minHeight: '100vh' }}>
          <Title>Cropped Image</Title>
          <Image width={400} height={400} src={croppedImage} alt='cropped result' />
          <Button onClick={() => setCroppedImage(undefined)}>
            Crop another image
          </Button>
        </Stack>
      ) : (
        <Box className={classes.container}>
          <FileInput
            variant='filled'
            placeholder='Upload an image'
            accept='image/*'
            onChange={handleFileUpload}
          />
        </Box>
      )}
    </>
  )
}
const useStyles = createStyles(() => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropContainer: {
    position: 'relative',
    width: '100%',
    height: '30rem',
  },
  croppedImageContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    objectFit: 'cover',
  },
}))
