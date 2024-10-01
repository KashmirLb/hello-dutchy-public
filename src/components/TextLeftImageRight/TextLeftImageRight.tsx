import React from 'react'
import Image from 'next/image'
import styles from './TextLeftImageRight.module.css'
import Link from 'next/link'
import useLanguage from '~/hooks/useLanguage'

const TextLeftImageRight = () => {

    const { languageData } = useLanguage()

  return (
    <div className="w-full py-10 flex justify-center rounded-md">
        <div className={`${styles.sectionContainer} `}>

            <div className={`${styles.imageContainer} w-full`}>
                <div className={`${styles.imageWrapper} relative w-full h-full`}>
                    <Image  
                        src="/demo/store.jpg"
                        alt='Picture of the front side of the store'
                        fill
                        style={{ objectFit: "cover", objectPosition: "center"}}
                        sizes="(width: 1652px) 951px,
                                (width: 1200px) 670px,
                                (width: 800px) 430px"
                    />
                </div>
            </div>
            <div className={`${styles.textContainer} h-full w-full`}>
                <div className={`${styles.textWrapper} border border-slate-300 `}>
                    <div className=''>
                        <div className='flex gap-2'>
                            <span className="w-8 h-8 mt-1">
                                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g strokeWidth="0"></g>
                                    <g strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g > 
                                        <path d="M19 28C23 24 27 17.447 27 12C27 5.925 22.075 1 16 1C9.925 1 5 5.925 5 12C5 21 16 31 16 31M5 31H27M21 12C21 9.238 18.762 7 16 7C13.238 7 11 9.238 11 12C11 14.762 13.238 17 16 17C18.762 17 21 14.762 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
                                    </g>
                                </svg>                                
                            </span>
                            <h2 className='font-semibold text-4xl'>{languageData.textLeftImageRightHeaderText}</h2>
                        </div>
                        <p className='text-xl'>{languageData.textLeftImageRightFirstText}</p>
                    </div>
                    <div className={`${styles.linkWrapper} text-lg`}>
                        <div>{languageData.textLeftImageRightSecondText}
                            <div className='-translate-y-1'>
                                <Link
                                    href="/about?location=location"
                                    className='text-inherit font-semibold '
                                > {languageData.textLeftImageRightLinkText}
                                    <span className='h-6 w-6 inline-block pb-0' >
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height={22} width={32} overflow={"clip"} className="translate-y-2">
                                            
                                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g>
                                                <path 
                                                d="M16.3153 16.6681C15.9247 17.0587 15.9247 17.6918 16.3153 18.0824C16.7058 18.4729 17.339 18.4729 17.7295 18.0824L22.3951 13.4168C23.1761 12.6357 23.1761 11.3694 22.3951 10.5883L17.7266 5.9199C17.3361 5.52938 16.703 5.52938 16.3124 5.91991C15.9219 6.31043 15.9219 6.9436 16.3124 7.33412L19.9785 11.0002L2 11.0002C1.44772 11.0002 1 11.4479 1 12.0002C1 12.5524 1.44772 13.0002 2 13.0002L19.9832 13.0002L16.3153 16.6681Z" fill="currentColor"></path>
                                             </g>
                                        </svg>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

  )
}

export default TextLeftImageRight