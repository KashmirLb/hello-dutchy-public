"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useSpring, a, animated, to } from '@react-spring/web'

import styles from './CardFlip.module.css'
import { useGesture } from '@use-gesture/react'

export default function CardFlip() {

  const calcX = (y: number, ly: number) => -(y - ly - window.innerHeight / 2) / 20
  const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 20

  const [flipped, setFlipped] = useState(false)
  const firstLoad = useRef(true)

  useEffect(() => {
    if(firstLoad.current){
      if(Math.random()*100 > 50){
        setFlipped(true)
      }
      firstLoad.current = false
    }

  }, [])

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })

  const [{x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
    () => ({
      rotateX:0,
      rotateY: 0,
      rotateZ:0, 
      scale: 1,
      zoom: 0,
      x: 0,
      y: 0,
      config: { mass: 5, tension: 550, friction: 10 }
    })
  )

  const domTarget = useRef(null)


  useGesture(
    {
      onHover: ({ hovering }) => 
        !hovering && api({ rotateX: 0, rotateY: 0, scale: 1}),
      onMove: ({ xy: [px, py], dragging }) =>
        !dragging &&
        api({
          rotateX: calcX(py, y.get()),
          rotateY: calcY(px, x.get()),
          scale: 1,
        }),
    },
    { target:domTarget, eventOptions: { passive: false } }
  )


  return (
    <div className={styles.container} onClick={() => setFlipped(state => !state)}>
      <animated.div 
        ref={domTarget}
        className={`${styles.card}`}
        style={{
          transform: 'perspective(600px)',
          x,
          y,
          scale: to([scale, zoom], (s, z) => s + z),
          rotateX,
          rotateY,
          rotateZ}}
        >
        <a.div
          className={`${styles.c} ${styles.back} rounded-md`}
          style={{ opacity: opacity.to(o => 1 - o), transform }}
        />
        <a.div
          className={`${styles.c} ${styles.front} home-row-image-container rounded-md`}
          style={{
            opacity,
            transform,
            rotateX: '180deg',
          }}
        />
      </animated.div>
    </div>
  )
}