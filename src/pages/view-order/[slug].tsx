import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '~/components/Layout'
import { Loading } from '~/components/Loading'
import { api } from '~/utils/api'
import type { OrderItemSummary } from '~/types'
import useLanguage from '~/hooks/useLanguage'
import { convertJsonToOrderItemSummary } from '~/utils/converters'
import { deliveryStatuses } from '~/data/Statuses'

const ViewOrder = () => {

    const router = useRouter()
    const token = router.query.slug as string

    const [ orderItems, setOrderItems ] = useState<OrderItemSummary[]>([])

    const { data, isLoading } = api.order.getOneByToken.useQuery(token ?? "")
    const { languageData, language } = useLanguage()

    useEffect(() => {
        if(data){
            if(data.paid == true){
                setOrderItems(convertJsonToOrderItemSummary(data.items))
            }
            else{
                void router.push("/complete-order/" + data.orderId)
            }
        }
    },[data, language])

    if(isLoading){
        return(
            <Layout>
            <div className='w-full h-almost-screen flex justify-center items-center'>
                <Loading size={50} />
            </div>
        </Layout>
        )

    }
    if(!data){
        return (
            <Layout>
                <div className='w-full h-almost-screen flex justify-center items-center'>
                    <h1 className='text-4xl font-bold'>
                        Order Not Found!
                    </h1>
                </div>
            </Layout>
        )
    }

  return (
    <Layout>
        <div className='w-full min-h-almost-screen flex justify-center items-center pt-4 p-4'>
            <div className='flex flex-col gap-4 max-w-700 w-full items-center'>
                <div className='text-center'>
                    <h1 className='text-xl'>{languageData.viewOrderOrderId} <span className='text-navbar-blue font-semibold'>{data.orderId}</span></h1>
                    <h2 className='text-xl'>{languageData.viewOrderStatus} 
                        <span 
                            className={`text-navbar-blue font-semibold capitalize mx-3
                                ${data.status == deliveryStatuses.NewOrder ? "text-navbar-blue" 
                                : data.status == deliveryStatuses.Stock ? "text-amber-700" 
                                : data.status == deliveryStatuses.Prepared ? "text-amber-700"
                                : data.status == deliveryStatuses.Shipped? "text-lime-700"
                                : data.status == deliveryStatuses.Delivered ? "text-lime-500"
                                 : "text-site-red"}
                                `}
                        >
                            {
                                data.status == deliveryStatuses.NewOrder ? language.toLowerCase() == "english" ? "Order Received" : "Bestelling ontvangen"
                                : data.status == deliveryStatuses.Stock ? language.toLowerCase() == "english" ? "Preparing items" : "Items aan het voorbereiden"
                                : data.status == deliveryStatuses.Prepared ? language.toLowerCase() == "english" ? "Package ready" : "Pakket klaar"
                                : data.status == deliveryStatuses.Shipped ? language.toLowerCase() == "english" ? "Shipped" : "Verzonden"
                                : data.status == deliveryStatuses.Delivered ? language.toLowerCase() == "english" ? "Delivered" : "Geleverd"
                                : "Processing"
                            }
                        </span>
                    </h2>
                </div>
                <div className='max-w-500 w-full'>
                    <h3 className='text-xl font-semibold mb-2'>{languageData.viewOrderOrderDetails}:</h3>
                    <div className='grid grid-cols-order-view break-words grid-cols'>
                        <p className='w-full'>{languageData.viewOrderFirstName}</p><div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.firstName}</span>
                        <p className='w-full'>{languageData.viewOrderLastName}</p> <div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.lastName}</span>
                        <p className='w-full'>{languageData.viewOrderEmail}</p><div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.email}</span>
                        <p className='w-full'>{languageData.viewOrderPhone}</p><div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.phone}</span>
                        <p className='w-full'>{languageData.viewOrderAddressCountry}</p><div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.addressCountry}</span>
                        <p className='w-full'>{languageData.viewOrderAddressState}</p><div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.addressState}</span>
                        <p className='w-full'>{languageData.viewOrderAddressCity}</p><div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.addressCity}</span>
                        <p className='w-full'>{languageData.viewOrderAddressPostalCode}</p><div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.addressPostalCode}</span>
                        <p className='w-full'>{languageData.viewOrderAddressLine1}</p><div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.addressLine1}</span>
                        <p className='w-full'>{languageData.viewOrderAddressLine2}</p><div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.addressLine2}</span>          
                        <p className='w-full'>{languageData.viewOrderPaymentMethod}</p><div className='w-full'></div><span className='text-navbar-blue font-semibold w-full'>{data.paymentMethod}</span>
                    </div>
                </div>
                <div className='max-w-500 w-full'>
                    <h3 className='text-xl font-semibold mb-2'>{languageData.viewOrderPaymentHeader}:</h3>
                    <div className='grid grid-cols-order-view break-words'>
                        <p>{languageData.viewOrderPaymentAmount}</p><div></div><span className='text-navbar-blue font-semibold'>{data.cost} €</span>
                        <p>{languageData.viewOrderPaymentMethod}</p> <div></div><span className='text-navbar-blue font-semibold'>{data.paymentMethod}</span>
                    </div>
                </div>
                <div className='w-full mt-4'>
                    <h3 className='text-xl font-semibold mb-2'>{languageData.vierOrderOrderedItems}</h3>
                    <table style={{minWidth: '100%', width: 'fit-content', borderCollapse: 'collapse', border: '1px solid #304e9358', textAlign: 'center'}}>
                        <thead style={{backgroundColor: '#304e93', color: '#ffffff', width: '100%'}}>
                            <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            </tr>
                        </thead>
                        <tbody style={{width: '100%'}}>
                            {orderItems.map((item, index) => (
                                <tr key={index + item.productId + item.quantity + item.color + item.size + item.price} className={`${index % 2 == 0 ? "bg-white" : "bg-gray-100"} text-primary font-bold`}>
                                    <td style={{maxWidth: '200px'}}>{item.productName} {item.color != "" ? `(${item.color})` : ""} {item.size != "" ? `(${item.size})` : ""}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='flex md:flex-row flex-col justify-center mt-4 gap-4'>
                    <button className='bg-navbar-blue hover:bg-secondary text-site-white text-base font-bold font-quicksand uppercase transition-all rounded-lg p-2 px-4'
                    onClick={() => void router.push("/products")}
                    >
                        {languageData.viewOrderContinueShopping}
                    </button>
                    <button
                    className='border border-primary p-2 px-4 hover:border-navbar-blue transition-all rounded-lg'
                    onClick={() => void router.push("/")}
                    >
                        {languageData.viewOrderReturnButton}
                    </button>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default ViewOrder