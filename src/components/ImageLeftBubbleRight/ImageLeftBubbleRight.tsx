import React from 'react'
import Image from 'next/image'
import type { auxImage } from '~/types'
import style from './ImageLeftBubbleRight.module.css'

type imageLeftBubbleRight = {
    firstText: string,
    secondText: string,
    image: auxImage,
    priority?: boolean,

}
const ImageLeftBubbleRight = (props : imageLeftBubbleRight) => {

    const {firstText, secondText, image, priority = false} = props

  return (
    <div className='md:h-screen bg-slate-300'>
        <div className='md:grid md:grid-cols-2 md:gap-5 h-full'>
            <div className={`${style.imageContainer} md:mb-0 mb-5 relative animate-swingY`}>
                <div className={style.bubbleImage}></div>

                <Image
                    src={image.url}
                    height={image.height}
                    width={image.width}
                    alt={image.alt}
                    priority={priority}
                />
            </div>
            <div className={`flex items-center justify-center relative w-full ${style.bubbleTextContainer}`}>
                <div className={style.bubbleTextContainerText}>
                    <div className={`${style.bubbleText}`}
                
                    ></div>
                    <div className={`${style.textContainer} text-site-white font-bold text-2xl p-10 h-fit`}>
                        <div className={style.textContainerText}>
                            <p>{firstText}</p> 
                            <br/>
                            <p>{secondText}</p>                
                        </div>
                    </div>
                </div>
                <div className={`${style.bubbleOne} animate-swing `}></div>
                <div className={`${style.bubbleTwo} animate-swingLarge `}></div>
                <div className={`${style.bubbleThree} animate-swing `}></div>
                <div className={`${style.bubbleFour} animate-swing `}></div>
                <div className={`${style.bubbleFive} animate-swingLarge `}></div>
                <div className={`${style.bubbleSix} animate-swing `}></div>
            </div>
        </div>        
    </div>
  )
}

export default ImageLeftBubbleRight