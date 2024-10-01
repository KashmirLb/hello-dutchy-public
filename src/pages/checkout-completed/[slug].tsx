import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "~/components/Layout"
import { Loading } from "~/components/Loading"
import useCart from "~/hooks/useCart"
import useLanguage from "~/hooks/useLanguage"
import { api } from "~/utils/api"


const CheckoutCompleted = () => {

    const router = useRouter()

    const checkoutReference = router.query.slug as string
    const { cartSession, setCartSession } = useCart()
    const { languageData } = useLanguage()
    const [ token, setToken ] = useState<string>("")
    const [ orderId, setOrderId ] = useState<string>("")
    const [ orderError, setOrderError ] = useState<boolean>(false)
    const [ initialLoad, setInitialLoad ] = useState<boolean>(true)

    // Returns the order if it is paid, and there are no problems with the payment.
    // Returns null in any other case.
    const { mutate: getOrderToken } = api.order.getOneBySessionAndReference.useMutation({
      onSuccess: (data) => {
        if(data?.token){
          setToken(data.token)
          setOrderId(data.orderId)
          if(cartSession){
            setCartSession({...cartSession, orderCompleted: true})
          }
        }
        if(data && (!data?.paid || !data?.token)){
          setOrderError(true)
        }
        setInitialLoad(false)
      }
    })

    useEffect(() => {
      if(checkoutReference && cartSession && token == ""){
        setTimeout(() => {
          getOrderToken(checkoutReference)
        }, 2000)
      }
    },[checkoutReference, cartSession])
  
    if(initialLoad){
      return(
          <Layout>
            <div className='w-full h-almost-screen flex justify-center items-center'>
                <Loading size={50} />
            </div>
        </Layout>
      )

  }
  if(orderError){
      return (
          <Layout>
              <div className='w-full h-almost-screen flex flex-col justify-center items-center text-center'>
                  <h1 className='text-4xl font-bold'>
                      Payment for order failed
                  </h1>
                  <p className="text-site-red my-4 font-bold">There was a problem with the payment for your order. Click below to try again</p>
                  <button
                    className='bg-primary px-10 py-2 uppercase font-semibold text-site-white hover:bg-primary-light-2 transition-all rounded-lg'
                    onClick={() => void router.push("/cart")}
                    >
                    Retry
                </button>
                <p className="py-6 font-semibold">If you believe this is an error and the payment went through, please <Link href={"/contect"} className="text-navbar-blue">contact us</Link> immediately</p>
              </div>
          </Layout>
      )
  }
  if(!token || token == ""){
      return (
          <Layout>
              <div className='w-full h-almost-screen flex flex-col text-center justify-center items-center'>
                  <h1 className='text-4xl font-bold'>
                      Order Not Found!
                  </h1>
                  <button
                    className='bg-primary px-10 py-2 my-4 uppercase font-semibold text-site-white hover:bg-primary-light-2 transition-all rounded-lg'
                    onClick={() => void router.push("/products")}
                    >
                    Back to Shop
                </button>
              </div>
          </Layout>
      )
  }
  return (
      <Layout>
        <div className='w-full min-h-almost-screen flex justify-center items-center pt-4 p-4'>
            <div className='flex flex-col gap-4 max-w-700'>
                <h1 className='text-4xl font-bold text-primary-light text-center'>
                    {languageData.checkoutCompletedHeader}
                </h1>
                <div className='text-center'>
                    <h2 className='text-xl mb-12'>{languageData.checkoutCompletedOrderId} <span className='text-navbar-blue font-semibold'>{orderId}</span></h2>
                </div>
                <div className='text-center'>
                  {languageData.checkoutCompletedEmailInfo}
                </div>
                <button
                    className='bg-primary p-4 uppercase font-semibold text-site-white hover:bg-primary-light-2 transition-all rounded-lg'
                    onClick={() => void router.push("/view-order/" + orderId + "|" + token)}
                    >
                    {languageData.checkoutCompletedButton}
                </button>
            </div>
        </div>
  </Layout>
  )
}

export default CheckoutCompleted