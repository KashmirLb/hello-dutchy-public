import type { Product, ProductCategory, ProductImage } from "@prisma/client"
import type { Locale } from "@mollie/api-client"

export type auxImage = {
    url: string,
    alt: string,
    height: number,
    width: number
}

export type ProductWithCategoryAndImages = Product & {
    category: ProductCategory,
    images: ProductImage[]
}

export type CartItemType = {
    productId: number,
    color: string,
    colorCode: string,
    colorHex: string,
    size: string,
    price: number,
    image: string,
    quantity: number
}

export type CheckoutDataResponse = {
    amount: number,
    checkout_reference: string,
    checkout_type: string,
    currency: string,
    pay_to_email: string,
    merchant_code: string,
    purpose: string,
    date: string,
    description: string,
    id: string,
    merchant_country: string,
    merchant_name: string,
    status: string,
    transactions: Array<any>,
    error_code?: string,
    message?: string,
    transaction_id?: string,
    transaction_code?: string,
    valid_until?: string,
    redirect_url?: string,
    return_url?: string
}

export type OrderItemSummary = {
    productId: number,
    productCode: string,
    productName: string,
    color: string,
    colorCode: string,
    colorHex: string,
    size: string,
    sizeType: string,
    quantity: number,
    price: string,
}

export type SumUpWebHookType = {
    id: string,
    event_type: string,
}

export type OrderReceivedClientEmailReplacements = {
    orderId: string,
    orderDate: string,
    orderPhone: string,
    orderAddressOneAndTwo: string,
    orderCityAndPostalCode: string,
    orderProvince: string,
    orderCountry: string,
    orderItemsInTableFormat: string,
    orderToken: string,
    orderTotalPrice: string,
    orderYear: string
}

export type OrderReceivedShopEmailReplacements = {
    orderId: string,
    orderFirstName: string,
    orderLastName: string,
    orderEmail: string,
    orderPhone: string,
    orderAddressOneAndTwo: string,
    orderCityAndPostalCode: string,
    orderProvince: string,
    orderCountry: string,
    orderItemsInTableFormat: string,
    orderTotalPrice: string,
    orderYear: string,
    orderDateWithTime: string,
    orderCheckoutId: string,
    orderPaymentStatus: string,
}

export type PaymentData = {
    id?: string,
    amount: {
        value: string,
        currency: string
    }
    orderId: string,
    status?: string,

    redirectUrl?: string,
    webhookUrl?: string,
    checkoutUrl?: string,
    dashboardUrl?: string,
    cancelUrl?: string,

    shippingAddress?: {
        givenName: string,
        familyName: string,
        streetAndNumber: string,
        streetAdditional?: string,
        postalCode: string,
        city: string,
        country: string,
        region: string
    },
    billingAddress?: {
        givenName: string,
        familyName: string,
        streetAndNumber: string,
        streetAdditional?: string,
        postalCode: string,
        city: string,
        country: string,
        region: string
    },

    locale?: Locale,
    lines?: PaymentDataLine[],

}

export type PaymentDataLine = {
    description: string,
    quantity: number,
    unitPrice: {
        value: string,
        currency: string
    },
    totalAmount: {
        value: string,
        currency: string
    }
}
