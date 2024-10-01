"use client"
import type { ProductWithCategoryAndImages } from '~/types'
import styles from './CategoryRow.module.css'
import useScrollXDetection from '~/hooks/useScrollXDetection'
import { useEffect, useRef, useState } from 'react'
import { ProductContainer } from '../ProductContainer/ProductContainer'
import useLanguage from '~/hooks/useLanguage'


type Props = {
    products: ProductWithCategoryAndImages[],
    sort: "popular" | "price-low" | "price-high",
    title: boolean
}

const CategoryRow = ({products, sort, title=true}: Props) => {

    const scrollableRow = useRef(null)
    const wrapperElement = useRef(null)
    const [ scrollReference, setScrollReference ] = useState<HTMLDivElement | null>(null)
    const [ wrapperReference, setWrapperReference ] = useState<HTMLDivElement | null>(null)
    const { scrolledStart, scrolledEnd, scrollRight, scrollLeft } = useScrollXDetection(scrollReference, wrapperReference)
    const { language } = useLanguage()

    useEffect(() => {
        setScrollReference(scrollableRow.current)
        setWrapperReference(wrapperElement.current)
    }, [scrollableRow, wrapperElement])

    function filterProductsBySort(products: ProductWithCategoryAndImages[], sort: "popular" | "price-low" | "price-high"): ProductWithCategoryAndImages[] {
        if(sort == "popular"){
            return products.sort((a, b) =>  b.popularity - a.popularity  )
        }
        if(sort == "price-low"){
            return products.sort((a, b) => (typeof a.price === "string" ? Number.parseInt(a.price) : 0)  - (typeof b.price === "string" ? Number.parseInt(b.price) : 0) )
        }
  
        return products.sort((a, b) => (typeof b.price === "string" ? Number.parseInt(b.price) : 0)  - (typeof a.price === "string" ? Number.parseInt(a.price) : 0) )
        
    }

  if(!products || products.length == 0){
    return (
      <div>
        <h2 className="text-2xl font-bold">No products found</h2>
      </div>
    )
  }

  return (
        <div className={styles.categoryRowContainer}>
            <div className='flex flex-col gap-4 '>
                {title && <h2 className="text-4xl font-bold">{language == "English" ? products[0]?.category.name : products[0]?.category.nameNl}</h2>}
                <div className='flex gap-4 md:-translate-x-10 -translate-x-0'>
                    <div className={`${scrolledStart ? "opacity-0" : "opacity-1"} top-0 left-0 w-10 bottom-0 z-10 transition-all md:block hidden`}>
                        
                        <div className='flex justify-center items-center h-full text-primary-light'>
                            <div 
                                className="border rounded-full w-10 h-10 flex items-center justify-center hover:cursor-pointer hover:scale-110 transition-all"
                                onClick={() => scrollRight()}    
                            >
                                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g strokeWidth="0"></g>
                                    <g strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g>
                                        <path d="M4.205 8.72805L12.205 3.72805C13.2041 3.10363 14.5 3.82189 14.5 5.00004V15C14.5 16.1782 13.2041 16.8965 12.205 16.272L4.205 11.272C3.265 10.6845 3.265 9.31555 4.205 8.72805Z" fill="currentColor"></path> 
                                    </g>
                                </svg>
                            </div>
                        </div>
                        
                    </div>
                    <div ref={wrapperElement} className='w-full'>
                        <div className='flex gap-4 max-w-1200 w-full overflow-auto py-2 relative' ref={scrollableRow}>
                            {filterProductsBySort(products, sort).map((product, index) => {
                                return (
                                    <ProductContainer product={product} key={product.enName + "category row" + index}/>
                                )
                            })}
                        </div>
                    </div>
                    <div className={`${scrolledEnd ? "opacity-0" : "opacity-1"} top-0 left-0 w-10 bottom-0 z-10 transition-all md:block hidden`}>
                        
                        <div className='flex justify-center items-center h-full text-primary-light'>
                            <div 
                                className="border  rounded-full w-10 h-10 flex items-center justify-center hover:cursor-pointer hover:scale-110 transition-all"
                                onClick={() => scrollLeft()}
                            >
                                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g strokeWidth="0"></g>
                                    <g strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g>
                                        <path d="M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z" fill="currentColor"></path> 
                                    </g>
                                </svg>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
  )
}

export default CategoryRow