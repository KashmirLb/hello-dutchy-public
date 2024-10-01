import type { Color, ProductImage } from '@prisma/client'
import { useEffect, useState } from 'react'
import useLanguage from '~/hooks/useLanguage'
import styles from './ProductDetailsImagesDisplay.module.css'
import Image from 'next/image'
import { Loading } from '../Loading'
import SwiperComponent from '../SwiperComponent'

type ProductDetailsImagesDisplayProps = {
  images: ProductImage[],
  colorSelected: Color | null,
}

const ImagesDesktop = ({images}: {images: ProductImage[]}) => {

  const [ thumbnails, setThumbnails ] = useState<string[]>([])
  const [ indexSelected, setIndexSelected ] = useState(0)

  useEffect(() => {
    if(images.length > 0){
      const generateThumbnailLinks = () => {  
        const imageThumbnails = images.map( image => {
          return image.url.replace("upload/", "upload/t_thumbnail/")
        })
        setThumbnails(imageThumbnails)
      }
      generateThumbnailLinks()
    }
    setIndexSelected(0)

  }, [images])

  return (
  <>
    <div className='h-product-details-desktop-image min-h-half-screen'> 
      <div className='rounded-lg h-full min-h-half-screen px-2'>
        <div className={styles.categoryProductItemImageContainer}>
          { 
            images && images.length > 0 && images.map((image, index) => (
              <Image
                key={image.url + index}
                priority
                src={image.url}
                objectFit='contain'
                fill={true}
                alt={images[index]?.name ?? ""}
                className={`bg-site-white rounded-md p-4 ${indexSelected == index ? "absolute" : "hidden"}`}
              />
            ))
          }
        </div>
      </div>
    </div>
    <div className='h-fit mt-4 flex gap-2 flex-wrap px-4 py-2 justify-center rounded-lg'>
      { thumbnails.length > 0 ?
        thumbnails.map((thumbnail, index) => (
          <div 
            className={`border-2 ${indexSelected == index ? "border-secondary" : "border-slate-200 hover:border-slate-400"} w-20 h-20 relative rounded-lg overflow-hidden hover:cursor-pointer `} 
            key={thumbnail + " " + index + "thumbnail-image"} 
            onClick={() => setIndexSelected(index)}
          >
            <Image
              src={thumbnail}
              objectFit='contain'
              fill={true}
              alt={"thumbnail "+index}
              className='z-10'
            />
          </div>
        ))
        : <div><Loading /></div>
      }
    </div>
  </>
  )
}

const ProductDetailsImagesDisplay = ({images, colorSelected}: ProductDetailsImagesDisplayProps) => {

  const { mobileDevice } = useLanguage()
  const [ displayImages, setDisplayImages ] = useState<ProductImage[]>([])

  useEffect(() => {

    if(images && images.length > 0){
      setDisplayImages([])

        /**
         * CASES:
         *  1. The color selected has a related image with the same colorCode. There are also images without colorCode.
         *  2. The color selected has a related imagage with the same colorCode. There are NO images without colorCode, all images are related to a color.
         *  3. The color selected has NO related image. There are images without colorCode that work as default.
         *  4. The color selected has NO related image(s) and there are no images without colorCode (no default images)
         * 
         * 
         * 
         *  1.1. Images related to color are displayed first, and default images are added at the end.
         *  2.1. Only images related to the color are displayed.
         *  3.1. All images by default are displayed.
         *  4.1. Display all images.
         */
        if(colorSelected){
          const imagesRelatedToColor = images.filter(image => image.colorCode == colorSelected.colorCode)
          const imagesWithoutColor = images.filter(image => image.colorCode == null || image.colorCode == "")
  
          if(imagesRelatedToColor.length > 0 && imagesWithoutColor.length > 0){
            setDisplayImages((prevState) => [...prevState, ...imagesRelatedToColor, ...imagesWithoutColor].sort((a, b) => a.imageOrder - b.imageOrder))
          }
          if(imagesRelatedToColor.length > 0 && imagesWithoutColor.length == 0){
            setDisplayImages((prevState) => [...prevState, ...imagesRelatedToColor].sort((a, b) => a.imageOrder - b.imageOrder))
          }
          if(imagesRelatedToColor.length == 0 && imagesWithoutColor.length > 0){
            setDisplayImages((prevState) => [...prevState, ...imagesWithoutColor].sort((a, b) => a.imageOrder - b.imageOrder))
          }
          if(imagesRelatedToColor.length == 0 && imagesWithoutColor.length == 0){
            setDisplayImages((prevState) => [...prevState, ...images].sort((a, b) => a.imageOrder - b.imageOrder))
          }
        }
        else{
          setDisplayImages((prevState) => [...prevState, ...images].sort((a, b) => a.imageOrder - b.imageOrder))
        }
    }

  }, [images, colorSelected])

  return (
    <>
    {
      !mobileDevice ? 
        <ImagesDesktop images={displayImages} />
        : 
      (
          <div className='min-h-half-screen w-auto h-full'>
            <SwiperComponent images={displayImages} />
          </div>
      )
    }
    </>
  )
}

export default ProductDetailsImagesDisplay