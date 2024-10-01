import Layout from '~/components/Layout'
import Image from 'next/image'
import useCart from '~/hooks/useCart'
import useLanguage from '~/hooks/useLanguage'
import useData from '~/hooks/useData'
import type { CartItemType, ProductWithCategoryAndImages } from '~/types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { api } from '~/utils/api'
import { PopoverContent, Popover, PopoverTrigger } from '~/components/ui/popover'
import type { CartSession } from '@prisma/client'
import Link from 'next/link'

type CartItemWithProduct = CartItemType & { product: ProductWithCategoryAndImages }

const SummaryBlock = ({cartSession, cartItemsWithProducts, enLang} : {cartSession: CartSession | null, cartItemsWithProducts: CartItemWithProduct[], enLang: boolean}) => {

  // If session does not have an order, orderData will be created
  const { mutate: createOrder } = api.order.create.useMutation({
    onSuccess: (data) => {
      if(data){
        void router.push(`/complete-order/${data.orderId}`)
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })

  // If session does already have an order, orderData will be updated.
  const { mutate: updateOrderItems } = api.order.updateItems.useMutation({
    onSuccess: (data) => {
      if(data){
        void router.push(`/complete-order/${data.orderId}`)
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })

  // If session does not have order created, orderData will be null.
  const { data: orderData } = api.order.getOneBySessionId.useQuery(cartSession?.sessionId ?? "")

  const router = useRouter()

  const onCreateOrderId = () => {
    // If we have an active cartSession (cart with items)
    if(cartSession){

      // If no orderData was found, we create a new order.
      if(!orderData){
        createOrder({
          cartSessionId: cartSession.sessionId,
          paid: false,
          addressCity: "",
          addressCountry: "",
          addressLine1: "",
          addressLine2: "",
          addressPostalCode: "",
          addressState: "",
          email: "",
          firstName: "",
          lastName: "",
          phone: "",
          items: cartItemsWithProducts.map(item => {
            return {
              productId: item.productId,
              productName: item.product.enName,
              productCode: item.product.productCode,
              color: item.color,
              colorCode: item.colorCode,
              colorHex: item.colorHex,
              size: item.size,
              sizeType: item.size.toLowerCase().includes("years") ? "Kids" : "Adult",
              quantity: item.quantity,
              price: item.price.toString(),
            }
          })
        })
      }

      // If orderData was found, we update the order items.
      else{
        updateOrderItems({
          orderId: orderData.orderId,
          cost: getTotalPrice(),
          items: cartItemsWithProducts.map(item => {
            return {
              productId: item.productId,
              productName: item.product.enName,
              productCode: item.product.productCode,
              color: item.color,
              colorCode: item.colorCode,
              colorHex: item.colorHex,
              size: item.size,
              sizeType: item.size.toLowerCase().includes("years") ? "Kids" : "Adult",
              quantity: item.quantity,
              price: item.price.toString(),
            }
          })
        })
      }
    }
    
  }

  // Gets the shipping cost, above 50 € is free, else it's 4.95 €.
  const getShippingCost = () => {
    if((Math.round(cartItemsWithProducts.reduce((total, item)=> total+(item.price * item.quantity), 0)*100)/100) >= 50 ){
      return 0
    }
    else{
      return 4.95
    }
  }

  // Gets the total price of the cart items plus the shipping cost.
  const getTotalPrice = () => {
    
    return (Math.round((cartItemsWithProducts.reduce((total, item)=> total+(item.price * item.quantity), 0)+getShippingCost())*100)/100)
  }

  return (
    <>
      <h2 className='text-navbar-blue text-2xl font-bold border-b-2 border-b-slate-400  mb-10'>{enLang ? "Summary" : "Samenvatting"}</h2>
      <div className=' w-full h-full'>
        <ul className="font-bold">
          {
            !cartItemsWithProducts || cartItemsWithProducts?.length === 0 ? <li>No hay productos en el cartItems</li>
            : 
            cartItemsWithProducts.map(item =>
                <li className='py-2 border-b border-primary-medium flex justify-between text-sm' key={item.productId + item.image + item.color + item.size + "cart-item-summary-prices"}>
                  <div className='w-1/2'>{enLang ? item.product.enName : item.product.nlName}</div>
                  <span className='text-xs text-primary-site mt-auto'>x{item.quantity}</span>
                  <div className='mt-auto text-navbar-blue'>{Math.round(item.price * item.quantity * 100)/100} €</div>
                </li>
              )
            }
            <li className='py-2 border-b border-primary-medium flex justify-between text-sm' >
              <div className='w-1/2'>{enLang ? "Shipping Cost" :  "Verzendkosten"}</div>
              <div className='mt-auto text-navbar-blue'>{getShippingCost()} €</div>
            </li>
        </ul>
        <div className='flex  justify-end gap-4 pt-8 font-bold'>
          <p className="text-2xl mt-auto text-primary-site">{enLang ? "Total:" : "Totaal:"} </p>
          <p className="text-2xl mt-auto text-navbar-blue">{!cartItemsWithProducts || cartItemsWithProducts?.length===0 ? 0 : getTotalPrice()} €</p>
        </div>
        <div className='flex justify-center pt-8'>
          <button className='bg-navbar-blue hover:bg-secondary w-full text-site-white text-xl font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg py-4 max-w-lg' 
            onClick={() => onCreateOrderId()}
          >
            {enLang ? "Complete Order" : "Bestelling afronden"}
          </button>
        </div>
        <div className='mt-8 flex gap-2'>
          <div className="text-center w-1/6 max-w-8 max-h-8">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary w-full h-full">
                <g>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"></circle>
                  <path d="M12 17V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path> 
                  <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="currentColor"></circle>
                </g>
              </svg>
          </div>
          <div className='text-sm'>See our <Link href="/deliveries" className="text-navbar-blue underline hover:text-navbar-blue transition-all">delivery and returns page</Link> for more information on shipping.</div>
        </div>
      </div>
    </>
  )

}

const ListItemSummary = ({item, enLang, findHexColorByName, handleOnViewProduct, handleRemoveItemCompletely, onAddToCart, onRemoveFromCart} : {item: CartItemWithProduct, enLang: boolean, findHexColorByName: (name: string) => string, handleOnViewProduct: (id: number) => void, handleRemoveItemCompletely: (item: CartItemWithProduct) => void, onAddToCart: (item: CartItemWithProduct) => void, onRemoveFromCart: (item: CartItemWithProduct) => void}) => {

  const { mobileDevice } = useLanguage()
  const [ deleteConfirmationOpen, setDeleteConfirmationOpen ] = useState(false)

  if(mobileDevice){
    return (
      <li className='h-fit w-full mb-5 border border-navbar-blue p-2'>
        <div className='w-full flex gap-1'>
          <div className='w-2/5'>
            <div className='block w-full'>
              <Image src={item.image} height={250} width={250}  alt="" className='m-auto max-h-60 w-auto'/>
            </div>
          </div>
          <div className='w-3/5'>
            <div className='block w-full text-lg font-bold'>
              {enLang ? item.product.enName : item.product.nlName}
            </div>
            <div className='w-full block text-lg font-bold text-navbar-blue'>
              {item.price} €
            </div>
            {
               item.color != "" ? (
                <div className='text-lg flex gap-2 items-center'>
                    <span className='text-navbar-blue font-bold'>{item.color}</span>
                    <div 
                      className={`border-4 rounded-lg relative border-slate-100 w-6 h-6 overflow-hidden hover:cursor-pointer `} 
                    >
                      <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center overflow-hidden'         
                        style={{backgroundColor: findHexColorByName(item.color)}}
                      >
                      </div>
                  </div>
                </div>
              ) : null
            }
            {
              item.size != "" ? (
                <div className='font-bold text-navbar-blue'>{item.size}</div>
              ) : null
            }
            <div className='mt-2 font-bold text-primary-site'> X {item.quantity}</div>
          </div>
        </div>
        <div>
          <div className='text-center w-full my-4'>
            <button className="bg-primary text-site-white text-xs font-bold font-quicksand uppercase transition-all rounded-md p-2 py-3 w-full max-w-360"
              onClick={()=> handleOnViewProduct(item.productId)}
            >
              {enLang ? "View Product" : "Bekijk Product"}
            </button>
            <div className='w-full max-w-360 flex flex-col justify-center items-center mx-auto'>
              <div className='flex justify-between w-full bg-site-white max-w-lg h-12 mt-4'>
                <button
                  className='bg-primary hover:bg-navbar-blue w-1/5 text-site-white text-xl font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg' 
                  onClick={()=> void onAddToCart(item)}
                >
                  <span className='flex items-center justify-center '>
                    <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#fff" className='w-8 h-8'>
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
                  <div className='flex bg-site-white w-3/5 '>
                    <div className='flex h-full w-full justify-center items-center text-2xl'>
                    {item.quantity}
                    </div>
                  </div>
                <button
                  className='bg-site-red-dark hover:bg-site-red w-1/5  h-full text-site-white text-xl font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg py-4' 
                  onClick={()=> void onRemoveFromCart(item)}
                >
                  <span className='flex items-center justify-center h-full'>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-8 h-8'>
                      <g> 
                      <path d="M6 12L18 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </g>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }
  return (

    <li className='min-h-72 w-full mb-5 md:flex border border-navbar-blue' key={item.productId + item.image + +item.color + item.size + "cart-item-summary-list-desktop"}>
      <div className='w-72 h-full flex flex-col align-middle justify-center'>
        <div className="h-fit w-full">
          <Image src={item.image} height={250} width={250}  alt="" className='m-auto max-h-60 w-auto'/>
        </div>
      </div>
      <div className='h-full flex flex-1 flex-col'>
        <div className='w-full h-2/3 flex flex-wrap'>
          <div className='flex flex-1 font-bold min-w-305 mb-4'>
            <div className='w-full flex flex-col'>
            <h3 className='text-3xl p-2 font-bold'>{enLang ? item.product.enName : item.product.nlName}</h3>
            <p className='p-2 py-4 text-xl'>{enLang ? "Amount:" : "Aantal:"} <span className='text-navbar-blue'>{item.quantity}</span></p>
            {
              item.color != "" ? (
                <div className='p-2 text-xl flex gap-2 items-center'>{enLang ? "Color:" : "Kleur:"} <span className='text-navbar-blue'>{item.color}</span>
                    <div 
                      className={`border-4 rounded-lg relative border-slate-100 w-10 h-10 overflow-hidden hover:cursor-pointer `} 
                    >
                      <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center overflow-hidden'         
                        style={{backgroundColor: findHexColorByName(item.color)}}
                      >
                      </div>
                </div></div>
              ) : null
            }
            {
              item.size != "" ? (
                <p className='p-2 text-xl'>{enLang ? "Size:" : "Maat:"} <span className='text-navbar-blue'>{item.size}</span></p>
              ) : null
            }
            </div>
          </div>
          <div className='flex flex-col w-fit pr-4 font-bold'>
            <h3 className='text-2xl p-2 text-primary-site'><span>{enLang ? "Price:" : "Prijs:"}</span> <span className='text-navbar-blue'>{item.price} €</span></h3>
            <div className='p-2 text-lg text-primary-site'> 
              <button 
                className="bg-primary hover:bg-navbar-blue text-site-white text-regular font-bold font-quicksand tracking-wider uppercase transition-all rounded-md p-2 mr-2"
                onClick={()=> onAddToCart(item)}
              >
                  <span className='flex items-center justify-center h-full'>
                    <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#fff" className='w-4 h-4'>
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
              <button 
                className="bg-site-red-dark hover:bg-site-red text-site-white text-regular font-bold font-quicksand tracking-wider uppercase transition-all rounded-md p-2 mr-4"
                onClick={()=> onRemoveFromCart(item)}
              >
                  <span className='flex items-center justify-center h-full'>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-4 h-4'>
                        <g> 
                        <path d="M6 12L18 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </g>
                    </svg>
                  </span>
              </button>
              <span>X {item.quantity}</span>
              </div>
            <p className='p-2 text-xl'>Total: <span className='text-navbar-blue'>{Math.round(item.price * item.quantity * 100)/100} €</span></p>
          </div>  
        </div>
        <div className='w-full h-1/3 text-end'>
          <div className="py-4 flex justify-end px-10 gap-5">
            <button className="bg-primary hover:bg-navbar-blue text-site-white text-regular font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg p-4 min-w-175"
              onClick={()=> handleOnViewProduct(item.productId)}
            >{enLang ? "View Product" : "Bekijk Product"}</button>
            <Popover open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
              <PopoverTrigger>
                <div 
                  className="bg-site-red-dark hover:bg-site-red text-site-white text-regular font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg p-4"
                >
                  <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"fill="#000000" className='w-6 h-6'>
                    <g>
                      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> 
                        <path d="M1.5 3.75C1.08579 3.75 0.75 4.08579 0.75 4.5C0.75 4.91421 1.08579 5.25 1.5 5.25V3.75ZM22.5 5.25C22.9142 5.25 23.25 4.91421 23.25 4.5C23.25 4.08579 22.9142 3.75 22.5 3.75V5.25ZM1.5 5.25H22.5V3.75H1.5V5.25Z" fill="#ffffff"></path>
                        <path d="M9.75 1.5V0.75V1.5ZM8.25 3H7.5H8.25ZM7.5 4.5C7.5 4.91421 7.83579 5.25 8.25 5.25C8.66421 5.25 9 4.91421 9 4.5H7.5ZM15 4.5C15 4.91421 15.3358 5.25 15.75 5.25C16.1642 5.25 16.5 4.91421 16.5 4.5H15ZM15.75 3H16.5H15.75ZM14.25 0.75H9.75V2.25H14.25V0.75ZM9.75 0.75C9.15326 0.75 8.58097 0.987053 8.15901 1.40901L9.21967 2.46967C9.36032 2.32902 9.55109 2.25 9.75 2.25V0.75ZM8.15901 1.40901C7.73705 1.83097 7.5 2.40326 7.5 3H9C9 2.80109 9.07902 2.61032 9.21967 2.46967L8.15901 1.40901ZM7.5 3V4.5H9V3H7.5ZM16.5 4.5V3H15V4.5H16.5ZM16.5 3C16.5 2.40326 16.2629 1.83097 15.841 1.40901L14.7803 2.46967C14.921 2.61032 15 2.80109 15 3H16.5ZM15.841 1.40901C15.419 0.987053 14.8467 0.75 14.25 0.75V2.25C14.4489 2.25 14.6397 2.32902 14.7803 2.46967L15.841 1.40901Z" fill="#ffffff"></path> <path d="M9 17.25C9 17.6642 9.33579 18 9.75 18C10.1642 18 10.5 17.6642 10.5 17.25H9ZM10.5 9.75C10.5 9.33579 10.1642 9 9.75 9C9.33579 9 9 9.33579 9 9.75H10.5ZM10.5 17.25V9.75H9V17.25H10.5Z" fill="#ffffff"></path> <path d="M13.5 17.25C13.5 17.6642 13.8358 18 14.25 18C14.6642 18 15 17.6642 15 17.25H13.5ZM15 9.75C15 9.33579 14.6642 9 14.25 9C13.8358 9 13.5 9.33579 13.5 9.75H15ZM15 17.25V9.75H13.5V17.25H15Z" fill="#ffffff"></path> <path d="M18.865 21.124L18.1176 21.0617L18.1176 21.062L18.865 21.124ZM17.37 22.5L17.3701 21.75H17.37V22.5ZM6.631 22.5V21.75H6.63093L6.631 22.5ZM5.136 21.124L5.88343 21.062L5.88341 21.0617L5.136 21.124ZM4.49741 4.43769C4.46299 4.0249 4.10047 3.71818 3.68769 3.75259C3.2749 3.78701 2.96818 4.14953 3.00259 4.56231L4.49741 4.43769ZM20.9974 4.56227C21.0318 4.14949 20.7251 3.78698 20.3123 3.75259C19.8995 3.7182 19.537 4.02495 19.5026 4.43773L20.9974 4.56227ZM18.1176 21.062C18.102 21.2495 18.0165 21.4244 17.878 21.5518L18.8939 22.6555C19.3093 22.2732 19.5658 21.7486 19.6124 21.186L18.1176 21.062ZM17.878 21.5518C17.7396 21.6793 17.5583 21.75 17.3701 21.75L17.3699 23.25C17.9345 23.25 18.4785 23.0379 18.8939 22.6555L17.878 21.5518ZM17.37 21.75H6.631V23.25H17.37V21.75ZM6.63093 21.75C6.44274 21.75 6.26142 21.6793 6.12295 21.5518L5.10713 22.6555C5.52253 23.0379 6.06649 23.25 6.63107 23.25L6.63093 21.75ZM6.12295 21.5518C5.98449 21.4244 5.89899 21.2495 5.88343 21.062L4.38857 21.186C4.43524 21.7486 4.69172 22.2732 5.10713 22.6555L6.12295 21.5518ZM5.88341 21.0617L4.49741 4.43769L3.00259 4.56231L4.38859 21.1863L5.88341 21.0617ZM19.5026 4.43773L18.1176 21.0617L19.6124 21.1863L20.9974 4.56227L19.5026 4.43773Z" fill="#ffffff"></path>
                      </g>
                    </g>
                  </svg>
                </div>
            </PopoverTrigger>
            <PopoverContent className='bg-site-white text-primary-light font-bold border-2 border-primary-light'>
              <div className='flex flex-col gap-2'>
                <div>
                 {enLang ? "Are you sure you want to delete this item?" : "Product van de lijst verwijderen?"}
                </div>
                <div className='flex justify-between w-full max-w-lg h-16'>
                  <button
                    className="bg-primary hover:bg-navbar-blue text-site-white text-regular font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg p-4 h-fit"
                    onClick={()=> setDeleteConfirmationOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-site-red-dark hover:bg-site-red text-site-white text-regular font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg p-4 h-fit"
                    onClick={()=> handleRemoveItemCompletely(item)}
                  >
                    {enLang ? "Delete" : "Verwijderen"}
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          </div>
        </div>
      </div>
    </li>

  )
}  

const CartPage = () => {

  const [ cartItemsWithProducts, setCartItemsWithProducts ] = useState<CartItemWithProduct[]>([])
  const [ enLang, setEnLang ] = useState(true)

  const { language  } = useLanguage()
  const { cartItems, addItemToCart, removeItemFromCart, removeItemCompletelyFromCart, cartSession } = useCart()
  const { allProducts } = useData()

  const { data: colorsData } = api.color.getAll.useQuery()

  const router = useRouter()

  useEffect(() => {
      if(language === "English"){
          setEnLang(true)
      }
      else{
          setEnLang(false)
      }
  },[language])

  useEffect(() => {
      if(cartItems && cartItems.length == 0){
        setCartItemsWithProducts([])
      }
      if(cartItems && allProducts && allProducts.length > 0 && cartItems.length > 0){
          const cartItemsWithProducts: CartItemWithProduct[] = cartItems.map(cartItem => {
              const product = allProducts.find(product => product.id === cartItem.productId)

              if(!product){
                  const emptyProduct: ProductWithCategoryAndImages = {
                      id: cartItem.productId,
                      enName: "EMPTY",
                      nlName: "",
                      kidsPrice: "0", 
                      hasColors: false,
                      hasSizes: false,
                      displayPerColors: false,
                      sizeTypeId: 0,
                      enDescription: "",
                      nlDescription: "",
                      popularity: 0,
                      price: "0",
                      categoryId: 0,
                      productCode: "",
                      published: true,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      images: [],
                      category: {
                          id: 0,
                          name: "",
                          nameNl: "",
                          categoryOrder: 0,
                          createdAt: new Date(),
                          updatedAt: new Date()
                      }
                  }
                  return { ...cartItem, product: emptyProduct }
              }
              return { ...cartItem, product, image: cartItem.image && cartItem.image != "" ? cartItem.image : (product.images[0] ? product.images[0]?.url : "") }
          })

          const cartItemsWithProductsFiltered = cartItemsWithProducts.filter(cartItem => cartItem.product != null && cartItem.product.enName != "EMPTY") ?? []

          if(cartItemsWithProductsFiltered){
              setCartItemsWithProducts(cartItemsWithProductsFiltered)
          }
      }
  }, [cartItems, allProducts])

  const findHexColorByName = (name: string) => {
        if(!colorsData || colorsData.length == 0){
            return ""
        }
        const color = colorsData.find(color => color.name.toLowerCase() == name.toLowerCase())
        if(color){
            return color.hexCode
        }
        return ""
  }

  const handleOnViewProduct = (id: number) => {
      void router.push(`/products/${id}`)
  }

  const handleRemoveItemCompletely = (item: CartItemWithProduct) => {
    removeItemCompletelyFromCart(item.productId, item.color, item.size)
  }

  const onAddToCart = (item: CartItemWithProduct) => {
    addItemToCart(item.productId, item.color, item.colorCode, item.colorHex, item.size, item.price, item.image)
  }

  const onRemoveFromCart = (item: CartItemWithProduct) => {

    removeItemFromCart(item.productId, item.color, item.size)
  }

  if(!cartItemsWithProducts || cartItemsWithProducts?.length == 0){
      return (
        <Layout>
            <header hidden><h1>Shopping Cart</h1></header>
            <div className='text-primary-light pt-16 px-10 font-bold'>
              <div className="w-full p-10 pb-0">
                  <h1 className="text-4xl text-primary-site">{enLang ? "Your Items" : "Uw artikelen"}</h1>
                  <p className=" mt-5 md:mb-0 mb-10 text-xl">{enLang ? "Review your order" : "Bekijk uw bestelling"}</p>
              </div>
              <div className='flex w-full my-4 gap-2'>
                <div className='w-full text-center'>
                  <p className='text-xl font-bold'>{enLang ? "No items in your cart" : "Geen artikelen in uw winkelwagen"}</p>
                  <button className='bg-primary hover:bg-navbar-blue text-site-white text-xl font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg p-4 mt-4 max-w-lg' 
                    onClick={()=> router.push("/products")}>Back to shop</button>
                </div>
              </div>
            </div>
        </Layout>
      )
  } 

  return (
    <Layout>
    <header hidden><h1>Shopping Cart</h1></header>
    <div className='text-primary-light md:px-10 px-2'>
      <div className="w-full p-10 pb-0 font-poppinsRegular">
        <h1 className="text-4xl text-primary-site">{enLang ? "Your Items" : "Uw artikelen"}</h1>
        <p className=" mt-5 mb-0">{enLang ? "Review your order" : "Bekijk uw bestelling"}</p>
      </div>
      <div className='flex lg:flex-row flex-col-reverse w-full my-4 gap-2'>
        <div className='flex w-full min-w-list-item'>
          <ul className='lg:p-10 w-full'>

            {!cartItemsWithProducts || cartItemsWithProducts?.length === 0 ? <li className='text-4xl font-bold'>{enLang ? "No items in your cart" : "Geen artikelen in uw winkelwagen"}</li>
            : 
            cartItemsWithProducts.map(item =>
                <ListItemSummary
                  key={item.productId + item.image + +item.color + item.size }
                  item={item} 
                  enLang={enLang} 
                  findHexColorByName={findHexColorByName} 
                  handleOnViewProduct={handleOnViewProduct} 
                  handleRemoveItemCompletely={handleRemoveItemCompletely}
                  onAddToCart={onAddToCart}
                  onRemoveFromCart={onRemoveFromCart}
                />
              )
            }
          </ul>
        </div>
        <div className="flex flex-col flex-1 p-10 px-8 h-fit border border-navbar-blue md:mt-10 sm:min-w-360 min-w-0">
          <SummaryBlock cartItemsWithProducts={cartItemsWithProducts} enLang={enLang} cartSession={cartSession} />
        </div>

      </div>
    </div>
  </Layout>
  )
}

export default CartPage