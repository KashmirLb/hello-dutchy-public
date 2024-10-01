import Image from 'next/image'
import style from './ThreeProductColumns.module.css'
import useLanguage from '~/hooks/useLanguage'
import { useRouter } from 'next/router'
import useData from '~/hooks/useData'
import { useState, useEffect } from 'react'
import type { ProductWithCategoryAndImages } from '~/types'

const ThreeProductColumns = () => {

    const { languageData, language } = useLanguage()
    const { allProducts } = useData()

    const [ boxesProducts, setBoxesProducts ] = useState<ProductWithCategoryAndImages[]>([])
    const router = useRouter()

    useEffect(()=> {
        if(allProducts){
            setBoxesProducts(allProducts.sort((a, b) => b.popularity - a.popularity).slice(0, 3))
        }
    },[allProducts])

    const prices = (box: ProductWithCategoryAndImages) => {
        if(box.sizeTypeId == 1){
            return box.price + "€"
        }
        if(box.sizeTypeId == 2){
            return box.kidsPrice + "€ (Kids)"
        }
        if(box.sizeTypeId == 3){
            return box.price + "€ / " + box.kidsPrice + "€ (Kids)"
        }
    }

  return (
    <div className={style.fullContainer}>
        <h2 className='mx-auto text-center text-4xl text-primary-light w-fit'> {languageData.threeColumnsHeaderText} </h2>
        <div className={`${style.productColumns} md:p-24 flex justify-between items-center gap-10 text-center w-full h-fit `}>
            {
                boxesProducts ? boxesProducts.map( box => (
                    <div 
                        key={box.id + Math.random()*100}
                        className={`${style.productBox} h-full border border-transparent hover:cursor-pointer`}
                        onClick={() => router.push(`/products/${box.id}`)}
                        >
                        <div className={`${style.productBoxContent}`}>
                            <div className={`${style.productBoxImage}`}>
                                <Image
                                    src={box?.images[0]?.url ? box.images[0].url : ""}
                                    alt={box.enName}
                                    style={{ objectFit: "contain"}}
                                    fill
                                    sizes="(width: 1652px) 951px,
                                            (width: 1200px) 670px,
                                            (width: 800px) 430px"
                                />
                            </div>
                            <div>
                                <p className='text-center font-semibold text-xl'>{language==="English" ? box.enName : box.nlName}</p>
                                <hr className='w-4/5 mx-auto my-1'/>
                                <p className='text-center font-semibold text-navbar-blue text-lg'>{prices(box)}</p>
                            </div>
                        </div>
                    </div>
                ))
                : <></>
            }
        </div>
    </div>
  )
}

export default ThreeProductColumns