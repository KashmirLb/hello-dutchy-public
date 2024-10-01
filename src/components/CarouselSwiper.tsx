"use client";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import useLanguage from "~/hooks/useLanguage";
import type { HomeHeader } from "@prisma/client";

type CarouselSwiperProps = {
  changeActiveIndex: (index: number) => void,
  headerData: HomeHeader[]
}

const CarouselSwiper = ({changeActiveIndex, headerData}: CarouselSwiperProps) => {

  const { mobileDevice } = useLanguage()

  return (
    
    <Swiper
      loop={true}
      modules={[Pagination, Autoplay, Navigation]}
      className="h-full w-full carousel-swiper"
      pagination={true}
      navigation={mobileDevice ? false : true}
      autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
      speed={700}
      onRealIndexChange={(index) => changeActiveIndex(index.realIndex)}
    >

      {headerData.map((header, index) => (
        <SwiperSlide className="w-full h-full" style={{ padding: `${mobileDevice ? "0px" : "0 2px"}` }} key={index}>
          <div className="w-full h-full relative">
            <Image priority src={header.imageUrl} alt={header.imageDescription} fill sizes="(width: 1652px) 734px,  (width: 1200px) 734px,  (width: 768px) 768px, (width: 425px) 425px" style={{ objectFit: 'cover', objectPosition: "center"}}/>
          </div>
        </SwiperSlide>
      ))}

    </Swiper>
  )
}

export default CarouselSwiper