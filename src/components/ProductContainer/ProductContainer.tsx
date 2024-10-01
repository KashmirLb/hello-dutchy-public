import { useRouter } from "next/router"
import type { ProductWithCategoryAndImages } from "~/types"
import styles from "./ProductContainer.module.css"
import Image from "next/image"
import useLanguage from "~/hooks/useLanguage"

export const ProductContainer = ({product}: {product: ProductWithCategoryAndImages}) => {

    const router = useRouter()
    const { language } = useLanguage()

    const prices = () => {
        if(product.sizeTypeId == 1){
            return product.price + "€"
        }
        if(product.sizeTypeId == 2){
            return product.kidsPrice + "€ (Kids)"
        }
        if(product.sizeTypeId == 3){
            return product.price + "€ / " + product.kidsPrice + "€ (Kids)"
        }
    }

    return (
        <div className={`${styles.productContainer} flex flex-col p-4 py-1 justify-between items-center border border-slate-200 hover:border-navbar-blue transition-all hover:cursor-pointer text-navbar-blue hover:text-sky-300`} onClick={() => router.push(`/products/${product.id}`)}>
            <div className={`${styles.productImageContainer}`}>
                <Image
                    src={product.images[0]?.url ?? ""}
                    alt={product.images[0]?.name ?? ""}
                    style={{ objectFit: "contain"}}
                    fill
                    sizes="(width: 1652px) 951px,
                            (width: 1200px) 670px,
                            (width: 800px) 430px"
                />
            </div>
            <div className="flex flex-1 h-fit items-center">
                <h3 className="text-xl font-bold text-primary-light">{language == "English" ? product.enName : product.nlName}</h3>
            </div>
            <div className='flex flex-col items-center justify-end'>
                <p className="text-inherit font-semibold text-lg">{prices()}</p>
            </div>
        </div>
    )
}
