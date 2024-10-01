import type { CartItemType, OrderItemSummary } from "~/types"
import type { JsonValue } from "@prisma/client/runtime/library"


// Converts the JSON list from cartSession.cartItems to the CartItemType array.
export const convertJsonToCartItem = (items: JsonValue[]): CartItemType[] => {

    // Validates if the item is an object and contains the required properties and types.
    const validateCartItemTypes = (item: JsonValue): boolean => {
        if(typeof item != "object" || item === null || item instanceof Array){
            throw new Error("Cart item is not an object")
        }
        
        if(item.productId as number == undefined || item.color as string == undefined || item.size as string == undefined || item.price as number == undefined 
            || item.image as string == undefined || item.quantity as number == undefined || item.colorCode as string == undefined
            || item.colorHex as string == undefined){
            return false
        }

        return true
    }

    const cartItems: CartItemType[] = items.map((item: JsonValue): CartItemType => {

        // If any check fails, return a default (empty ) cart item.
        if(typeof item != "object" || item === null || item instanceof Array || !validateCartItemTypes(item)){
            const cartItem : CartItemType = {
                productId: 0,
                color: "",
                size: "",
                price: 0,
                image: "",
                quantity: 0,
                colorCode: "",
                colorHex: ""
            }
            return cartItem
        }

        const cartItem : CartItemType = {
            productId: item.productId as number,
            color: item.color as string,
            size: item.size as string,
            price: item.price as number,
            image: item.image as string,
            quantity: item.quantity as number,
            colorCode: item.colorCode as string,
            colorHex: item.colorHex as string,
        }
        return cartItem
    })
    // Filter out any invalid cart items.
    const filteredCartItems = cartItems.filter(item => validateCartItemTypes(item) || item.productId != 0)

    return filteredCartItems
}

export const convertJsonToOrderItemSummary = (items: JsonValue[]): OrderItemSummary[] => {
    // Validates if the item is an object and contains the required properties and types.
    const validateCartItemTypes = (item: JsonValue): boolean => {
        if(typeof item != "object" || item === null || item instanceof Array){
            throw new Error("Cart item is not an object")
        }
        
        if(item.productId as number == undefined || item.color as string == undefined || item.size as string == undefined || item.sizeType as string == undefined 
            || item.productName as string == undefined || item.quantity as number == undefined || item.price as string == undefined 
            || item.productCode as string == undefined || item.colorCode as string == undefined || item.colorHex as string == undefined){
            return false
        }

        return true
    }

    const cartItems: OrderItemSummary[] = items.map((item: JsonValue): OrderItemSummary => {

        // If any check fails, return a default (empty ) cart item.
        if(typeof item != "object" || item === null || item instanceof Array || !validateCartItemTypes(item)){
            const cartItem : OrderItemSummary = {
                productId: 0,
                productCode: "",
                productName: "",
                color: "",
                size: "",
                sizeType: "",
                quantity: 0,
                price: "",
                colorCode: "",
                colorHex: ""
            }
            return cartItem
        }

        const cartItem : OrderItemSummary = {
            productId: item.productId as number,
            productName: item.productName as string,
            productCode: item.productCode as string,
            color: item.color as string,
            size: item.size as string,
            sizeType: item.sizeType as string,
            quantity: item.quantity as number,
            price: item.price as string,
            colorCode: item.colorCode as string,
            colorHex: item.colorHex as string,
        }
        return cartItem
    })
    // Filter out any invalid cart items.
    const filteredCartItems = cartItems.filter(item => validateCartItemTypes(item) || item.productId != 0)

    return filteredCartItems
}

export const convertDate = () => {
    const newDate = new Date(Date.now())

    const options: Intl.DateTimeFormatOptions  = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }

    const dateString = newDate.toLocaleDateString('en-EN', options)

    let day = dateString.split("/")[1] ?? "00"
    let month = dateString.split("/")[0] ?? "00"
    const year = dateString.split("/")[2] ?? "0000"

    if(day && day.length == 1){
        day = "0" + day
    }
    if(month && month.length == 1){
        month = "0" + month
    }

    return day+"-"+month+"-"+year
}