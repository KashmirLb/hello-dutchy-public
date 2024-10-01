import { useRouter } from 'next/router'
import React from 'react'
import type { ProductWithCategoryAndImages } from '~/types'
import styles from './ProductsGrid.module.css'
import { ProductContainer } from '../ProductContainer/ProductContainer'

type ProductsGridProps = {
  products: ProductWithCategoryAndImages[],
  sort: "popular" | "price-low" | "price-high"
}

const ProductsGrid = ({ products, sort }: ProductsGridProps) => {

  function filterProductsBySort(products: ProductWithCategoryAndImages[], sort: "popular" | "price-low" | "price-high"): ProductWithCategoryAndImages[] {
    if(sort == "popular"){
      return products.sort((a, b) =>  b.popularity - a.popularity )
    }
    if(sort == "price-low"){
      return products.sort((a, b) => (typeof a.price === "string" ? Number.parseInt(a.price) : 0)  - (typeof b.price === "string" ? Number.parseInt(b.price) : 0) )
    }
    return products.sort((a, b) => (typeof b.price === "string" ? Number.parseInt(b.price) : 0)  - (typeof a.price === "string" ? Number.parseInt(a.price) : 0) )
  }

  return (
    <div className={`${styles.gridContainer}  gap-4`}>
        {filterProductsBySort(products, sort).map((product) => {
          return (
            <div className={`${styles.productContainer} w-full`} key={product.id + product.enName + "product grid item"}>
              <ProductContainer product={product} />
            </div>
          )
        })}
    </div>
  )
}

export default ProductsGrid