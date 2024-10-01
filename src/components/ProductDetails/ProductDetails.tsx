import type { Color, Size,  Product, ProductCategory, ProductImage } from '@prisma/client'
import type { CartItemType } from '~/types'
import {useEffect, useState} from 'react'
import Image from 'next/image'
import useLanguage from '~/hooks/useLanguage'
import styles from './ProductDetails.module.css'
import dedent from 'dedent'
import useData from '~/hooks/useData'
import { Loading } from '../Loading'
import CategoryRow from '../CategoryRow/CategoryRow'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import useCart from '~/hooks/useCart'
import ProductDetailsImagesDisplay from '../ProductDetailsImagesDisplay/ProductDetailsImagesDisplay'
import MobileColorSelector from '../MobileColorSelector/MobileColorSelector'

type ImagesDesktopProps = {
  productImageUrls: string[],
  thumbnails: string[],
  indexSelected: number,
  onSelectThumbnail: (index: number) => void,
  product: Product & { category: ProductCategory },
  images: ProductImage[],
  colorSelected: Color | null
}

type ProductDetailsProps = {
  product: Product & { category: ProductCategory },
  images: ProductImage[],
  sizesData: Size[],
  colorsData: Color[]
}

const RelatedProducts = ({category, productId}: {category: string, productId: number}) => {
  const { allProducts, productsLoading } = useData()
  const { language } = useLanguage()

  if(productsLoading){
    return <Loading />
  }
  if(!allProducts){
    return <div className='h-fit'></div>
  }

  const filterProducts = (category: string) => {
    return allProducts.filter(product => product.category.name === category  && product.id !== productId  )
  }
  return (
    <div className='h-fit flex flex-col justify-center items-center'>
      <h2 className='text-primary font-abel text-center text-4xl font-bold'>{language == "English" ? "Related Products" : "Vergelijkbare Producten"}</h2>
      <div className="lg:px-20 py-10 px-4 max-w-1300 min-w-1/2 w-full">
        <div className="flex flex-col gap-12">
          <CategoryRow products={filterProducts(category)} sort='popular' title={false} />
        </div>
      </div>
    </div>
  )
}

const SizeOptionsHead = ({product, sizesData, onKidsSizeSelectedChange, kidsSizeSelected} : {product: Product & { category: ProductCategory }, sizesData: Size[], onKidsSizeSelectedChange: (selected: boolean) => void, kidsSizeSelected: boolean}) => {

  if(product.sizeTypeId == 1 || sizesData.filter(size => size.sizeTypeId == 2).length == 0){
    return <div>Adult</div>
  }
  if(product.sizeTypeId == 2 || sizesData.filter(size => size.sizeTypeId == 1).length == 0){
    return <div>Kids</div>
  }
  else{
    return(
      <div className='flex items-center gap-2 md:pb-0 pb-4'>
        {
          sizesData.filter(size => size.sizeTypeId == 1).length > 0  ? (
            <>
              <input className='md:h-4 md:w-4 h-6 w-6 hover:cursor-pointer' type='radio' name='size' value='adult' checked={!kidsSizeSelected} onClick={(e) => onKidsSizeSelectedChange(false)} onChange={()=>{void 0}} /> 
              Adult
            </>
        ) : null
      }
      {
        sizesData.filter(size => size.sizeTypeId == 2).length > 0 ? (
          <>
            <input className='md:h-4 md:w-4 h-6 w-6 md:ml-4 ml-6 hover:cursor-pointer' type='radio' name='size' value='kids' checked={kidsSizeSelected} onClick={(e) => onKidsSizeSelectedChange(true)} onChange={()=>{void 0}} />
            Kids
          </>
        ) : null
      }
      </div>
    )
  }
}

const SizeOptions = ({sizesList, onSizeChange}: {sizesList: string[], onSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void}) => {
  return (
        <select className="w-44 h-8 font-semibold rounded-md" onChange={(e) => onSizeChange(e)}>
          <option value="">Select Size</option>
          {!sizesList ? <option value="null">Loading...</option> : 
          sizesList.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
    )
}

const ColorOptions = ({colorsList, onColorChange, colorSelected}: {colorsList: Color[], onColorChange: (color: Color) => void, colorSelected: Color | null}) => {

  return (
    <div className="flex gap-2 flex-wrap">
      {colorsList.map((color, i) => (
        <TooltipProvider key={color.name + " " + color.hexCode + i}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <div 
                className={`border-4 rounded-lg relative ${colorSelected == color ? "border-primary-light" : "border-site-white hover:border-slate-400"} w-10 h-10 relative overflow-hidden hover:cursor-pointer `} 
                onClick={() => onColorChange(color)}
              >
                <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center overflow-hidden'         
                  style={{backgroundColor: color.hexCode}}
                >
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className='bg-primary text-site-white'>
              <div>{color.name}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      ))}

    </div>
  )
}

const OrderButton = ({product, color, size, cartItems, onAddToCart, onRemoveFromCart }: {product: Product & { category: ProductCategory }, color: string, size: string, cartItems: CartItemType[], onAddToCart: () => void, onRemoveFromCart: () => void}) => {

  const { language } = useLanguage()

  const itemInCart = cartItems.find(item => item.productId == product.id && item.color == color && item.size == size)

  if(itemInCart){
    return (
      <div className='w-full flex flex-col justify-center items-center'>
        <span>{language == "English" ? "Amount in Cart:" : "Aantal in winkelwagen:"}</span>
        <div className='flex justify-between w-full bg-site-white h-16 max-w-500'>
          <button
            className='bg-primary hover:bg-navbar-blue w-fit text-site-white text-xl font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg' 
            onClick={()=> void onAddToCart()}
          >
            <span className='flex items-center justify-center '>
              <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#fff" className='w-16 h-16'>
                <g>
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g  fill="#fff"> 
                    <path d="M9,17h6v6a1,1,0,0,0,2,0V17h6a1,1,0,0,0,0-2H17V9a1,1,0,0,0-2,0v6H9a1,1,0,0,0,0,2Z"></path>
                  </g>
                </g>
                </g>
              </svg>
            </span>
          </button>
            <div className='flex bg-site-white lg:w-1/5 w-full py-4'>
              <div className='flex h-full w-full justify-center items-center text-2xl'>
              {itemInCart.quantity}
              </div>
            </div>
          <button
            className='bg-site-red-dark hover:bg-site-red w-fit h-full text-site-white text-xl font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg py-4' 
            onClick={()=> void onRemoveFromCart()}
          >
            <span className='flex items-center justify-center h-full'>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-16 h-16'>
                <g> 
                <path d="M6 12L18 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </g>
              </svg>
            </span>
          </button>
        </div>
      </div>
    )
  }
  return (
    <button 
      className='bg-primary hover:bg-navbar-blue w-full text-site-white text-xl font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg py-4 max-w-lg' 
      onClick={()=> void onAddToCart()}
      >
      {language == "English" ? "Add to cart" : "Toevoegen"}
    </button>
  )
}

// PRIMARY COMPONENT
const ProductDetails = ({product, images, sizesData, colorsData}: ProductDetailsProps) => {

  const [ sizeSelected, setSizeSelected ] = useState<Size | null>(null)
  const [ colorSelected, setColorSelected ] = useState<Color | null>(null)
  const [ kidsSizeSelected, setKidsSizeSelected ] = useState<boolean>(false)
  const [ enLang, setEnLang ] = useState(true)
  const [ productDescription, setProductDescription ] = useState("")
  const [ sizeError, setSizeError ] = useState(false)
  
  const { mobileDevice, language } = useLanguage()
  const { addItemToCart, removeItemFromCart, cartItems } = useCart()

  useEffect(() => {
    if(language.toLowerCase().includes("english")){
      setEnLang(true)
    }
    else{
      setEnLang(false)
    }
    return () => setEnLang(true)
  },[language])

  useEffect(()=> {
    if(product){

      // Set languages
      if(enLang && product && product.enDescription){
        setProductDescription(dedent`${product.enDescription}`)
      }
      else{
        setProductDescription(dedent`${product.nlDescription}`)
      }
  
      // Check size type available
      if(product.sizeTypeId == 1){
        setKidsSizeSelected(false)
      }
      if(product.sizeTypeId == 2){
        setKidsSizeSelected(true)
      }

      // Set default color
      if(colorsData != null && colorsData.length > 0){
        if(product.hasColors){
          if(product.sizeTypeId == 1 || product.sizeTypeId == 3){
            setColorSelected(colorsData.find(color => color.sizeTypeId == 1 || color.sizeTypeId == 3) ?? null)
          }
          if(product.sizeTypeId == 2){
            setColorSelected(colorsData.find(color => color.sizeTypeId == 2) ?? null)
          }
        }
      }
    }

    return () => setProductDescription("")
  }, [enLang, product, sizesData, colorsData])

  const getPrices = () => {
    if(kidsSizeSelected){
      return product.kidsPrice + "€ (Kids)"
    }
    else{
      return product.price + "€"
    }
  } 

  const onSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSizeError(false)
    if(sizesData != null && sizesData.length > 0){
      const size = sizesData.find(size => size.name === e.target.value)
      setSizeSelected(size ?? null)
    }
  }

  const onColorChange = (color: Color | undefined) => {
    if(color){
      setColorSelected(color)
    }
  }

  const getSizesList = () => {
    if(!sizesData || sizesData.length == 0){
      return []
    }
    if(kidsSizeSelected){
      const filteredSizes = sizesData.filter(size => size.sizeTypeId == 2)
      return filteredSizes.map(size => enLang ? size.name : size.name.replace("years", "jaar"))
    }
    else{
      const filteredSizes = sizesData.filter(size => size.sizeTypeId == 1)
      return filteredSizes.map(size => size.name)
    }
  }

  const onKidsSizeSelectedChange = (selected: boolean) => {

    const findOpositeSizeColor = colorsData.find(color => (color.sizeTypeId == (selected ? 2 : 1) && color.colorCode == colorSelected?.colorCode))

    setKidsSizeSelected(selected)
    setColorSelected(null)
    setSizeError(false)
    if(sizesData && colorsData){
      if(selected){
        setSizeSelected(null)
        setColorSelected(
          findOpositeSizeColor ? findOpositeSizeColor :
          colorsData.find(color => color.sizeTypeId == 2) ?? null
        )
      }
      else{
        setSizeSelected(null)
        setColorSelected(
          findOpositeSizeColor ? findOpositeSizeColor :
          colorsData.find(color => color.sizeTypeId == 1) ?? null
        )
      }
    }
  }

  const onColorChangeBySelect = (id: number) => {
    if(!colorsData || colorsData.length == 0){
      return
    }
    const color = colorsData.find(color => color.id == id)
    if(color){
      setColorSelected(color)
    }
  }

  const filterColorsBySizeType = (sizeType: number) => {
    return colorsData?.filter(color => color.sizeTypeId == sizeType) ?? []
  }

  const findImageForCart = () => {
    if(product.hasColors){
      const imagesColor =  images.filter(image => image.colorCode == colorSelected?.colorCode).sort((a, b) => a.imageOrder - b.imageOrder)
      if(imagesColor && imagesColor.length > 0 && imagesColor[0]){
        return imagesColor[0].url
      }
    }
    else{
      const cartImage = images.sort((a, b) => a.imageOrder - b.imageOrder)[0]

      if(cartImage){
        return cartImage.url
      }
    }
    return ""
  }
  
  const onAddToCart = () => {
    if(product.hasSizes && sizeSelected == null || sizeSelected?.name == ""){
      setSizeError(true)
      return
    }
    const cartPrice = kidsSizeSelected ? Number.parseFloat(product.kidsPrice.replace(",", ".")) : Number.parseFloat(product.price.replace(",", "."))
    const cartImage = findImageForCart()
    addItemToCart(product.id, colorSelected?.name ?? "", colorSelected?.colorCode ?? "", colorSelected?.hexCode ?? "", sizeSelected?.name ?? "", cartPrice, cartImage)
  }

  const onRemoveFromCart = () => {

    removeItemFromCart(product.id, colorSelected?.name ?? "", sizeSelected?.name ?? "")
  }

  return (
    <div>
      <div className='h-fit lg:p-10 py-2 min-h-screen lg:mb-10 mb-4'>
        <div className='rounded-md lg:p-4 p-0 h-full min-h-fit'>
          <div className='lg:flex h-full gap-2 min-h-fit'>
            <div className='lg:w-1/2 w-full'>
             <ProductDetailsImagesDisplay images={images} colorSelected={colorSelected} />
             {
                mobileDevice ?
                  product.hasColors ? 
                    (
                      <div>
                        <MobileColorSelector colors={filterColorsBySizeType(kidsSizeSelected ? 2 : 1) ?? []} colorSelected={colorSelected} changeColorSelected={onColorChange} />
                      </div>
                    )
                  : <div className='h-6'></div>
                : null
             }
            </div>
            <div 
              className={`lg:w-1/2 w-full
                px-0
                pb-4
                mt-2 lg:mt-0
                lg:h-full h-1/2 
                flex flex-col
                rounded-md `}
            >
              <div className='flex flex-col gap-2 w-full lg:px-10 px-4 py-3 text-lg bg-sky-200 bg-opacity-50'>
                <div className='flex flex-col gap-2 '>
                  <div className='lg:text-6xl text-4xl flex justify-center mt-4 font-bold'>
                    <h2 className='text-primary font-abel text-center'>{enLang ? product.enName : product.nlName}</h2>
                  </div>
                  <div className={`${styles.productTextGrid} font-bold py-10`}>
                    <div className='text-primary-light'>
                      {enLang ? "Description:" : "Beschrijving:"}
                    </div>
                    <div className='whitespace-pre-wrap'>
                      {productDescription}
                    </div>

{/********** SIZE MANAGEMENT IN TEXTBOX ***********/}
                    {product.hasSizes ? (
                        <>
                          <div className='text-primary-light md:py-0 py-2'>
                            {enLang ? "Size:" : "Maat:"}
                          </div>
                          <div className='text-black md:py-0 py-2'>
                            
                            <SizeOptionsHead product={product} sizesData={sizesData} onKidsSizeSelectedChange={onKidsSizeSelectedChange} kidsSizeSelected={kidsSizeSelected} />

                            <div className='mt-2'>
                              <SizeOptions sizesList={getSizesList()} onSizeChange={onSizeChange} />
                              <div className='text-red-500 text-xs mt-2'>{sizeError ? "Please select a size" : null}</div>
                            </div>
                          </div>
                        </>
                      )
                      : null
                    }

{/********** COLOR MANAGEMENT IN TEXTBOX ***********/}
                    {product.hasColors && !mobileDevice ? 
                     // PRODUCT HAS COLORS AND IS NOT ON MOBILE DEVICE
                    (
                        <>
                          <div className='text-primary-light'>
                            {enLang ? "Color:" : "Kleur:"}
                          </div>
                          <div className='text-black'>
                            <div><span className='text-navbar-blue'>Selected: </span>{colorSelected?.name ?? "None"}</div>
                            <div className='mt-2'>
                              <ColorOptions colorsList={filterColorsBySizeType(kidsSizeSelected ? 2 : 1) ?? []} onColorChange={onColorChange} colorSelected={colorSelected} />
                            </div>
                          </div>
                        </>
                      )
                      : 
                      product.hasColors ?
                      // PRODUCT HAS COLORS AND IS ON MOBILE DEVICE
                      ( 

                        <>
                          <div className='text-primary-light'>
                            {enLang ? "Color:" : "Kleur:"}
                          </div>
                          <div>
                            <select className="w-44 h-8 font-semibold rounded-md" value={colorSelected?.id ?? 0} onChange={(e) => onColorChangeBySelect(Number(e.target.value))}>
                              { colorsData && colorsData.length > 0 &&
                                filterColorsBySizeType(kidsSizeSelected ? 2 : 1).map((color, index) => (
                                  <option key={color.name + " " + color.hexCode + index} value={color.id}>{color.name}</option>
                                ))
                              }
                            </select>
                          </div>
                        </>
                      )
                      : 
                      // PRODUCT HAS NO COLORS
                      null 
                    }

{/********** AVAILABILITY MANAGEMENT IN TEXTBOX ***********/}
                    <div className='text-primary-light'>
                      {enLang ? "Available:" : "Beschikbaar:"}
                    </div>
                    <div className='text-navbar-blue'>Yes</div>

{/********** PRICE MANAGEMENT IN TEXTBOX ***********/}
                    <div className='text-primary-light'>
                      {enLang ? "Price:" : "Prijs:"}
                    </div>
                    <div className='text-navbar-blue'>
                      {getPrices()}
                    </div>
                  </div>
                </div> 
                <div className={`${styles.productTextCols} text-primary font-bold w-full py-4 flex flex-col items-center justify-center`}>
                    <div className='text-red-500 mb-2'>{sizeError ? "Please select a size" : null}</div>
                    <OrderButton product={product} cartItems={cartItems} color={colorSelected?.name ?? ""} size={sizeSelected?.name ?? ""} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
        <RelatedProducts category={product.category.name} productId={product.id} />
    </div>
  )
}

export default ProductDetails