"use client"
import { useSpring, animated, to } from "@react-spring/web"
import { useGesture } from "@use-gesture/react"
import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import styles from './CategoryCircle.module.css'

type Props = {
    name: string,
    image: string,
    url: string
}

const CategoryCircle = ({name, image, url} : Props) => {

    const [{ scale, zoom }, api ] = useSpring(
        () =>  ({
          scale: 1,
          zoom: 0,
          config: { mass: 7, tension: 750, friction: 40 }
        })
      )
      
      const domTarget = useRef(null)
    
      useGesture(
        {
          onHover: ({ hovering }) => 
            !hovering ? api({ scale: 1}) : api({ scale: 1.1 }),
        },
        { target:domTarget, eventOptions: { passive: false } }
      )
    
  return (
    <animated.div ref={domTarget} style={{ transform: 'perspective(600px)', scale: to([scale, zoom], (s, z) => s + z) }}>
                  <Link className={`${styles.categoryContainer}`} href={url}>
                    <div className={`${styles.imageContainer} bg-sky-200`}>
                      <div className={`${styles.imageWrapper} relative`}>
                        <Image
                          src={image}
                          alt={name}
                          fill
                          style={{ objectFit: "cover", objectPosition: "center"}}
                          sizes="(width: 1652px) 951px,
                                  (width: 1200px) 670px,
                                  (width: 800px) 430px"
                        />
                      </div>
                    </div>
                    <div className={`${styles.textContainer} text-inherit py-4 w-full text-center`}>
                      <h3 className='font-bold text-2xl'>{name}</h3>

                    </div>
                  </Link>
                </animated.div>
  )
}

export default CategoryCircle