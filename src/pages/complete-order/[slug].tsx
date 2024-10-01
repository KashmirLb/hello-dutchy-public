import { Order } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Layout from '~/components/Layout'
import OrderForm from '~/components/OrderForm/OrderForm'
import useLanguage from '~/hooks/useLanguage'
import { api } from '~/utils/api'
import type { OrderItemSummary } from '~/types'
import { convertJsonToOrderItemSummary } from '~/utils/converters'
import { PaymentStatus } from '@mollie/api-client'

const ItemsSummary = ({order, orderItems, enLang}: {order: Order | null, orderItems: OrderItemSummary[], enLang: boolean}) => {

  if(!order || order.items.length == 0){
    return (<div>No items</div>)
  }

  return(
    <div className="flex flex-col flex-1 p-10 px-8 h-fit border border-navbar-blue md:max-w-360 max-w-none md:mx-0 mx-auto md:mt-0 mt-6">
    <h2 className='text-navbar-blue text-2xl font-bold border-b-2 border-b-slate-400  mb-10'>{enLang ? "Summary" : "Samenvatting"}</h2>
    <div className=' w-full h-full'>
      <ul className="font-bold">
        {
          orderItems.map(item => {
            return(
              <li className='py-2 border-b border-primary-medium flex justify-between text-sm' key={item.productId + item.color + item.size + "cart-item-summary-order-complete"}>
                <div className='w-1/2'>{item.productName}</div>
                <span className='text-xs text-primary-site mt-auto'>x{item.quantity}</span>
              </li>
            )
          })
        }
        {
          (order.cost - 4.95) < 50 ? 
          (
          <li className='py-2 border-b border-primary-medium flex justify-between text-sm' >
            <div className='w-1/2'>{enLang ? "Shipping Cost" : "Verzendkosten"}</div>
            <span>4.95€</span>
          </li>
          ) : null
        }
      </ul>
      <div className='flex  justify-end gap-4 pt-8 font-bold'>
        <p className="text-2xl mt-auto text-primary-site">{enLang ? "Total:" : "Totaal:"}</p>
        <p className="text-2xl mt-auto text-navbar-blue">{order.cost} €</p>
      </div>
    </div>
  </div>
  )
}

const OrderDataSummary = ({order, enLang, setDataSaved}: {order: Order | null, enLang: boolean, setDataSaved: React.Dispatch<React.SetStateAction<boolean>>}) => {

  const orderDetailsRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const [ checkoutRedirectUrl, setCheckoutRedirectUrl ] = useState<string>("")

  const { mutate: updateCheckoutId } = api.order.updateCheckoutId.useMutation({
      onSuccess: (data) => {
        if(data){
          void router.push(checkoutRedirectUrl)
        }
      }
  })
  const { mutate: createPayment } = api.payment.create.useMutation({
      onSuccess: (data) => {
        if(data){
          if(data.status == PaymentStatus.open && data._links?.checkout?.href && order){
            setCheckoutRedirectUrl(data._links.checkout.href)
            updateCheckoutId({
              orderId: order.orderId,
              checkoutId: data.id
            })
          }      
        }
      }
  })


  useEffect(() => {
    if(orderDetailsRef.current){
      orderDetailsRef.current.scrollIntoView({behavior: "smooth", block: "center"})
    }
  },[orderDetailsRef])

  if(!order || order.items.length == 0){
    return (<div>No items</div>)
  }

  return(
    <div className="bg-sky-100 p-4 text-primary-light flex flex-col gap-2" ref={orderDetailsRef}>
      <div>
        <div>
          <h3 className='text-xl font-bold'>{enLang ? "Order for " : "Bestelling voor "}{order.firstName} {order.lastName},</h3>
          <p>{order.addressLine1},  {order.addressLine2 ? order.addressLine2 + ", " : ""}, {order.addressPostalCode}, {order.addressCity}, {order.addressState}, {order.addressCountry}</p>
          <div className='mt-4'>
            <p>Contact Email:</p>
            <p className='text-primary-site font-bold'>{order.email}</p>
            <p>Contact Phone:</p>
            <p className='text-primary-site font-bold'>{order.phone}</p>
          </div>

          <div className='mt-4'>
            <p>Total price:</p>
            <p className='text-primary-site font-bold'>{order.cost} €</p>
          </div>
        </div>
      </div>
      <div className='flex md:flex-row flex-col justify-between mt-4 gap-4'>
        <button className='bg-navbar-blue hover:bg-secondary text-site-white text-base font-bold font-quicksand uppercase transition-all rounded-lg p-2 px-4'
         onClick={() => createPayment({
          orderId: order.orderId,
          locale: navigator.language
         })}
        >
          Proceed to payment
        </button>
        <button
          className='border border-primary p-2 px-4 hover:border-navbar-blue transition-all rounded-lg'
          onClick={() => setDataSaved(false)}
        >
          Change information
        </button>
      </div>
    </div>
  )
}   

const CompleteOrderPage = () => {

  const [ enLang, setEnLang ] = useState(true)
  const [ orderItems, setOrderItems ] = useState<OrderItemSummary[]>([])
  const [ orderData, setOrderData ] = useState<Order | null>(null)
  const [ dataSaved, setDataSaved ] = useState(false)

  const router = useRouter()
  const orderId = router.query.slug as string

  const { mutate: loadOrderData } = api.order.getOneBySessionIdMutation.useMutation({
    onSuccess: (data) => {
      if(data){
        setOrderData(data)
      }
    }
  })

  const { mutate: updateOrderData } = api.order.updateData.useMutation({
    onSuccess: (data) => {
      if(data){
        setOrderData(data)
        setDataSaved(true)
      }
    }
})

  const { language } = useLanguage()

  useEffect(() => {
    if(language == "English"){
      setEnLang(true)
    }
    else{
      setEnLang(false)
    }
    return () => setEnLang(true)
  }, [language])

  useEffect(() => {
    if(orderId && orderId != ""){
      loadOrderData(orderId)
    }
  },[orderId])

  useEffect(() => {
    if(orderData){
      setOrderItems(convertJsonToOrderItemSummary(orderData.items))
    } 
  },[orderData])

  const onSaveOrderData = () => {
    if(orderData){
      updateOrderData({
        orderId: orderData.orderId,
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        email: orderData.email,
        phone: orderData.phone,
        addressCountry: orderData.addressCountry,
        addressState: orderData.addressState,
        addressCity: orderData.addressCity,
        addressPostalCode: orderData.addressPostalCode,
        addressLine1: orderData.addressLine1,
        addressLine2: orderData.addressLine2,
        policyAccepted: orderData.policyAccepted,
      })
    }
  }


  if(!orderData){
    return (<Layout>
      <header hidden><h1>Complete Order</h1></header>
      <div className='text-primary-light px-10'>
        <div className="w-full p-10 pb-0 font-poppinsRegular">
            <h1 className="text-4xl text-primary-site">{enLang ? "Complete order" : "Bestelling afronden"}</h1>
            <p className=" mt-5 md:mb-0 mb-10 text-xl">{enLang ? "Please complete your delivery information" : "Gelieve uw leveringsinformatie in te vullen"}</p>
        </div>
      </div>
    </Layout>)
  }

  return (
    <Layout>
      <header hidden><h1>Complete Order</h1></header>
      <div className='text-primary-light md:px-10'>
        <div className="w-full md:p-10 p-4 md:pb-0 pb-0 font-poppinsRegular">
            <h1 className="text-4xl text-primary-site">{enLang ? "Complete order" : "Bestelling afronden"}</h1>
            <p className=" mt-5 md:mb-0 mb-10 text-xl">{enLang ? "Please complete your delivery information" : "Gelieve uw leveringsinformatie in te vullen"}</p>
        </div>
      </div>
      <div className='md:p-10 p-2 md:px-20 font-poppinsRegular text-navbar-blue md:flex justify-center gap-4'>
        <div className='w-full md:max-w-700 max-w-none'>
          {
            !dataSaved || orderData == null ?
            (
              <OrderForm orderData={orderData} setOrderData={setOrderData} enLang={enLang} onSaveOrderData={onSaveOrderData} />
            ) : (
              <OrderDataSummary order={orderData} enLang={enLang} setDataSaved={setDataSaved} />
            )
          }
        </div>
        <ItemsSummary order={orderData} orderItems={orderItems} enLang={enLang} />
      </div>
    </Layout>
  )
}

export default CompleteOrderPage