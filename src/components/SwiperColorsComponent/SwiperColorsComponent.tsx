"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Color, ProductImage } from "@prisma/client";
import Image from "next/image";
import { useState,useEffect, useRef } from "react";
import styles from './SwiperColorsComponent.module.css'

type Props = {
  images: ProductImage[],
  colorSelected: Color | null,
  allColors: Color[],
  sizeType: number,
  changeColorSelected: (color: Color | undefined) => void
}


const SwiperColorsComponent = (props: Props) => {

  const { images, colorSelected, allColors, changeColorSelected, sizeType } = props
  const [ orderedImages, setOrderedImages ] = useState<ProductImage[]>([])
  const [ orderedColors, setOrderedColors ] = useState<Color[]>([])
  const [ indexSelected, setIndexSelected ] = useState<number>(0)
  const [ swiper, setSwiper ] = useState<SwiperType | null>(null)

  const selectedColor = useRef<HTMLDivElement | null>(null)

  useEffect(() => {

    if(images && images.length > 0){
      const filteredColors = allColors.filter(color => color.sizeTypeId == sizeType)
      setOrderedImages([])
      setOrderedColors([])
  
      filteredColors.map( color => {

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
        const imagesRelatedToColor = images.filter(image => image.colorCode == color.colorCode)
        const imagesWithoutColor = images.filter(image => image.colorCode == "")

        if(imagesRelatedToColor.length > 0 && imagesWithoutColor.length > 0){
          setOrderedImages((prevState) => [...prevState, ...imagesRelatedToColor, ...imagesWithoutColor])
          setOrderedColors((prevState) => [...prevState, color])
        }
        if(imagesRelatedToColor.length > 0 && imagesWithoutColor.length == 0){
          setOrderedImages((prevState) => [...prevState, ...imagesRelatedToColor])
          setOrderedColors((prevState) => [...prevState, color])
        }
        if(imagesRelatedToColor.length == 0 && imagesWithoutColor.length > 0){
          setOrderedImages((prevState) => [...prevState, ...imagesWithoutColor])
          setOrderedColors((prevState) => [...prevState, color])
        }
        if(imagesRelatedToColor.length == 0 && imagesWithoutColor.length == 0){
          setOrderedImages((prevState) => [...prevState, ...images])
          setOrderedColors((prevState) => [...prevState, color])
        }
      })
    }

  }, [images, allColors, sizeType])

  useEffect(() => {
    if(colorSelected){
      const index = orderedColors.findIndex(color => color.id == colorSelected.id)
      if(index != -1){
        swiperChangeColorSelected(colorSelected, index)
      }
    }
  },[orderedImages, colorSelected])

  useEffect(() => {
    if(selectedColor.current){
        selectedColor.current.scrollIntoView({behavior: "smooth", block: "nearest", inline: "center"})
    }
  },[indexSelected, selectedColor])

  const slideTo = (index: number) => swiper?.slideTo(index, 0)
  const swiperChangeColorSelected = (color: Color, index: number) => {

    const indexImageRelatedToColor = orderedImages.findIndex(image => image.colorCode == color.colorCode)
    if(indexImageRelatedToColor != -1){
      slideTo(indexImageRelatedToColor)
    }
    setIndexSelected(index)
  }

  const changedIndexBySwipe = (index: number) => {

    if(orderedColors && orderedColors.length > 0 && orderedColors[index] != undefined){
      changeColorSelected(orderedColors[index])
      setIndexSelected(index)
    }
  }

  if(orderedImages.length == 0){
    return null
  }

  return (
    <>
    <Swiper
      onSwiper={(swiper) => setSwiper(swiper)}
      onRealIndexChange={(swiper) => changedIndexBySwipe(swiper.realIndex)}
      className="h-full w-full"
    >
      {orderedImages.length > 0 &&
        orderedImages.map(image =>(
          <SwiperSlide 
            key={image.url + "mobile-version" + sizeType + image.colorCode}
            className="h-full w-full relative min-h-half-screen"
          >
            <div>
              {
                image.id == 0 ? (
                  <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                    <div className='text-primary-light text-center my-auto max-h-full'>
                      No preview available
                    </div>
                  </div>
                  )
                  : (
                    <Image
                      src={image.url ?? ""}
                      style={{objectFit: "contain" }}
                      fill={true}
                      priority
                      alt={image.name ?? ""}
                    />
                )
              }
            </div>
          </SwiperSlide>
        ))
      }

    </Swiper>
    <div className={styles.colorsRow} >
      <div className={`max-h-20 overflow-x-scroll`}>
        <div className="w-fit flex gap-2 py-1">
          {orderedColors.map((color, index) => (
            <div
              key={color.id + "mobile-version" + Math.random() * Date.now()}
              ref={ indexSelected == index ? selectedColor : null }
              className={`border-4 ${colorSelected == color ? "border-primary-light" : "border-slate-100"} w-14 h-14 hover:cursor-pointer `} 
              style={{backgroundColor: color.hexCode}}
              onClick={() => changeColorSelected(color)}>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default SwiperColorsComponent