import React from 'react'
import Layout from '~/components/Layout'

const TermsAndPolicies = () => {
  return (
    <Layout>
        <div className='flex justify-center py-10'>        
            <div className='flex flex-col gap-10 max-w-700 text-lg'>
                <div>
                    <h1 className='text-2xl text-primary font-bold'>Hello Dutchy - Deliveries and Returns</h1>
                    <p className='mb-2'>At Hello Dutchy, we strive to provide a smooth and timely delivery experience for all our customers. Please read the following information carefully to understand our delivery policies:</p>
                </div>
                <div>
                    <h2 className='text-2xl font-bold mb-2 text-primary-light'>1. Delivery Time Estimates</h2>
                    <p className='mb-2'>Our standard delivery time is between 4-7 business days from the date of dispatch. Please note that this is an estimate and actual delivery times may vary depending on our stock, the destination, shipping provider, and other external factors.</p>
                </div>
                <div>
                    <h2 className='text-2xl font-bold mb-2 text-primary-light'>2. Tracking Your Order</h2>
                    <p className='mb-2'>Once your order has been dispatched, we will provide you with a tracking number via email so you can monitor the status of your delivery. Please note that tracking information may not be available for all international shipments, depending on the shipping carrier&apos;s coverage.</p>
                </div>
                <div>
                    <h2 className='text-2xl font-bold mb-2 text-primary-light'>3. Shipping Details</h2>
                    <p className='mb-2'>Accurate Shipping Information: It is the customer&apos;s responsibility to ensure that all shipping details (such as the recipient&apos;s name, address, and contact information) are entered correctly at checkout.</p>
                </div>
                <div>
                    <h2 className='text-2xl font-bold mb-2 text-primary-light'>4. International Shipping</h2>
                    <p className='mb-2'>For orders shipped outside the Netherlands, delivery times may be longer due to customs clearance and local postal service delays. Additionally, tracking information may not be available for all international destinations.</p>
                </div>
                <div>
                    <h2 className='text-2xl font-bold mb-2 text-primary-light'>5. Failed Deliveries and Returns</h2>
                    <p className='mb-2'>Failed Deliveries: If a delivery fails due to incorrect shipping details provided by the customer or if the package is not collected from a designated pick-up point, Hello Dutchy is not responsible for any additional shipping costs incurred for resending the package.</p>
                    <p className='mb-2'>Unclaimed Packages: Orders that are returned to us as unclaimed may be subject to a restocking fee or additional shipping charges for re-dispatch.</p>
                </div>
                <div>
                    <h2 className='text-2xl font-bold mb-2 text-primary-light'>6. Delivery Delays</h2>
                    <p className='mb-2'>While we strive to meet the delivery estimates provided, delays can occasionally occur due to unforeseen circumstances such as weather conditions, carrier issues, or customs delays. We appreciate your patience and understanding in these situations.</p>
                </div>
                <div>
                    <h2 className='text-2xl font-bold mb-2 text-primary-light'>7. Cancellations</h2>
                    <p className='mb-2'>
                    How to Cancel an Order: Orders can be canceled at any time by sending an email to info@hellodutchy.com. Please include your order number and any relevant details in your email.
                    </p>
                    <p className='mb-2'>
                    Refunds for Unshipped Orders: If the order has not yet been shipped, a full refund will be provided.
                    </p>
                    <p className='mb-2'>
                    Refunds for Shipped Orders: If the items have already been shipped, a refund will be issued for the cost of the items only. The shipping cost will be deducted from the refund, even if the order qualified for free shipping. This policy ensures that shipping expenses already incurred are covered.
                    </p>
                </div>
                <div>
                    <h2 className='text-2xl font-bold mb-2 text-primary-light'>8. Contact Us</h2>
                    <p className='mb-2'>If you have any questions or concerns regarding your delivery, please feel free to contact us at <b>info@hellodutchy.com</b>. We are here to help and ensure a positive shopping experience with Hello Dutchy.</p>
                </div>

{/* 1. Delivery Time Estimates
Our standard delivery time is between 4-7 business days from the date of dispatch. Please note that this is an estimate and actual delivery times may vary depending on the destination, shipping provider, and other external factors.
2. Tracking Your Order
Once your order has been dispatched, we will provide you with a tracking number via email so you can monitor the status of your delivery. Please note that tracking information may not be available for all international shipments, depending on the shipping carrier's coverage.
3. Shipping Details
Accurate Shipping Information: It is the customer's responsibility to ensure that all shipping details (such as the recipient’s name, address, and contact information) are entered correctly at checkout.
Changes to Shipping Information: If you need to make any changes to your shipping details after placing an order, please contact us as soon as possible at info@dutchy.com. We will do our best to accommodate changes before your order is dispatched, but we cannot guarantee modifications once the order has been processed.
4. International Shipping
For orders shipped outside the Netherlands, delivery times may be longer due to customs clearance and local postal service delays. Additionally, tracking information may not be available for all international destinations.
Customs Duties and Taxes: Customers are responsible for any customs duties, taxes, or fees imposed by the destination country. These charges are not included in the product price or shipping cost and are the responsibility of the recipient.
5. Failed Deliveries and Returns
Failed Deliveries: If a delivery fails due to incorrect shipping details provided by the customer or if the package is not collected from a designated pick-up point, Hello Dutchy is not responsible for any additional shipping costs incurred for resending the package.
Unclaimed Packages: Orders that are returned to us as unclaimed may be subject to a restocking fee or additional shipping charges for re-dispatch.
6. Delivery Delays
While we strive to meet the delivery estimates provided, delays can occasionally occur due to unforeseen circumstances such as weather conditions, carrier issues, or customs delays. We appreciate your patience and understanding in these situations.
7. Contact Us
If you have any questions or concerns regarding your delivery, please feel free to contact our customer support team at info@dutchy.com. We are here to help and ensure a positive shopping experience with Hello Dutchy.
Thank you for choosing Hello Dutchy. We value your business and are committed to delivering your order safely and efficiently. */}
            </div>
        </div>
    </Layout>
  )
}

export default TermsAndPolicies