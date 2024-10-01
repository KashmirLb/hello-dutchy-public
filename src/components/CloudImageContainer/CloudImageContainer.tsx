import React from 'react'
import Image from 'next/image'
import style from './CloudImageContainer.module.css'

const CloudImageContainer = () => {
  return (
    <div className={`${style.componentContainer} h-full w-full md:p-4 p-0`}>
        <div className={`${style.cloudsAndImageContainer} h-full w-full relative`}>
            <div className={`${style.outerImageContainer} `}>
                <div className={`${style.imageContainer} relative h-full`}>
                <Image 
                    src={"/dutchy-viktor-landscape-border-white.svg"}
                    fill 
                    style={{objectFit: "contain" }} 
                    alt={"Header with Hello Dutchy and Viktor plushies"}
                    priority
                    sizes="(width: 1652px) 951px,
                            (width: 1200px) 670px,
                            (width: 800px) 430px,
                            (width: 680px) 663px"
                    className='z-0'
                />
                <div className={`${style.cloudInnerBlock}`}></div>

                </div>
            </div>

        </div>
    </div>
  )
}

export default CloudImageContainer