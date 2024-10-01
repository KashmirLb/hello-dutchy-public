"use client";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { ProductImage } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * SwiperComponent
 * @param images
 * @returns JSX.Element
 * 
 * Returns a component that displays all images in a swiper component.
 * 
 * Component uses Pagination.
 * 
 * Component will take all the space available:
 *  -> A width, height, or min-width and min-height MUST be specified.
 */

type Props = {
  images: ProductImage[]
}

const SwiperComponent = (props: Props) => {

  const { images } = props
  const [ swiper, setSwiper ] = useState<SwiperType | null>(null)

  useEffect(() => {
    if(window != undefined){
      window.document.querySelectorAll('.swiper-wrapper').forEach((swiper) => {
        const swiperElement = swiper as HTMLElement
        swiperElement.style.width = 'inherit'
        swiperElement.style.height = 'inherit'
        swiperElement.style.minWidth = 'inherit'
        swiperElement.style.minHeight = 'inherit'
        swiperElement.style.maxWidth = 'inherit'
        swiperElement.style.maxHeight = 'inherit'
      })
    }
  }, [])

  useEffect(() => {
    if(swiper){
      swiper.slideTo(0, 0)
    }
  },[images, swiper])

  return (
    
    <Swiper 
      modules={[Pagination]}
      className="w-inherit h-inherit min-w-inherit min-h-inherit max-w-inherit max-h-inherit"
      pagination={true}
      onSwiper={(swiper) => setSwiper(swiper)}
    >
      {images.length > 0 &&
        images.map((image, index) =>(
          <SwiperSlide 
            key={image.url + "mobile-version" + image.id + image.imageOrder}
            className="w-inherit h-inherit min-w-inherit min-h-inherit max-w-inherit max-h-inherit relative"
          >
              {
                index == 0 || index == 1 ? (
                  <Image
                    src={image.url ?? ""}
                    style={{objectFit: "contain" }}
                    fill={true}
                    priority
                    alt={image.name ?? ""}
                  />
                )
                : (
                  <Image
                    src={image.url ?? ""}
                    style={{objectFit: "contain" }}
                    fill={true}
                    alt={image.name ?? ""}
              />
                )
              }
          </SwiperSlide>
        ))
      }

    </Swiper>
  )
}

export default SwiperComponent