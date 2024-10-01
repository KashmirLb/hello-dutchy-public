import { createContext, useEffect, useState } from "react";
import type { CartSession } from "@prisma/client";
import { api } from "~/utils/api";
import { convertJsonToCartItem } from "~/utils/converters";

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
export type cartContextType = {
    cartItems: CartItemType[],
    cartSession: CartSession | null,
    setCartSession: (cartSession: CartSession) => void,
    loadingCartAction: boolean,
    addItemToCart: (productId: number, color: string, colorCode: string, colorHex: string, size: string, price: number, image: string) => void,
    removeItemFromCart: (productId: number, color: string, size: string) => void,
    reloadSession: () => void,
    removeItemCompletelyFromCart: (productId: number, color: string, size: string) => void,
    createNewCartSession: () => void
}

type cartProviderProps = {
    children: any
}

type JsonData = {
    sessionId: string | null,
}
const CartContext = createContext<cartContextType | null>(null)
const CartProvider = ({children}: cartProviderProps) => {

    const [ cartSession, setCartSession ] = useState<CartSession | null>(null)
    const [ sessionId, setSessionId ] = useState<string | null>(null)
    const [ cartItems, setCartItems ] = useState<CartItemType[]>([])
    const [ loadingCartAction, setLoadingCartAction ] = useState(false)
    
    const [ retryAddToCart, setRetryAddToCart ] = useState(false)
    const [ tempAddItemCartItem, setTempAddItemCartItem ] = useState<CartItemType | null>(null)

    const [ retryRemoveFromCart, setRetryRemoveFromCart ] = useState(false)
    const [ tempRemoveItemCartItem, setTempRemoveItemCartItem ] = useState<CartItemType | null>(null)

    /**
     * MUTATES
     */
    // Finds cart session from the database through sessionId, if entry does not exist, empty cartSession is created.
    // ONLY activates when sessionId changed and is not null.
    const { mutate: getCartSession } = api.cartSession.getCartSession.useMutation({
        onSuccess: (data) => {
            if(data){
                setCartSession(data)
            }
            else{
                // If no data was found (does not exist in db), we have a sessionId, and cartSession is still null -> Create new cartSession.
                if(sessionId){
                    const newCartSession: CartSession = {
                        id: 0,
                        sessionId: sessionId,
                        cartItems: [],
                        orderCompleted: false,
                        orderCreated: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                    setCartSession(newCartSession)
                }
            }
            setLoadingCartAction(false)
        },
        onError: (error) => {
            setLoadingCartAction(false) 
        }
    })
    
    const { mutate: createOrUpdateCartSession } = api.cartSession.createOrUpdateCartSession.useMutation({
        onSuccess: (data) => {
            // If data was updated correctly, set the new data to the cartSession state.
            if(data){
                setCartSession(data)
            }
            setLoadingCartAction(false)
        },
        onError: (error) => {
            setLoadingCartAction(false)
        }
    })

    /**
     * EFFECTS
     */
    // Try to get a cart session whenever sessionId changes.
    useEffect(() => {
        if(sessionId){
            setLoadingCartAction(true)
            getCartSession(sessionId)
        }
    },[sessionId])

    // When CartSession changes...
    useEffect(() =>{
        
        if(cartSession){
            // If cartSession is completed, create a new sessionId.
            if(cartSession.orderCompleted){
                void createNewCartSession()
                return
            }
            // If cartSession is not completed, update the cartItems state.
            else{
                setCartItems(convertJsonToCartItem(cartSession.cartItems))
            }
        }

        // Functions to retry adding an item to the cart.
        if(retryAddToCart){
            if(tempAddItemCartItem){
                const retryAddToCartFunction = async () => {
                    await addItemToCart(tempAddItemCartItem.productId,
                        tempAddItemCartItem.color,
                        tempAddItemCartItem.colorCode,
                        tempAddItemCartItem.colorHex,
                        tempAddItemCartItem.size,
                        tempAddItemCartItem.price,
                        tempAddItemCartItem.image)
                }
                
                void retryAddToCartFunction()
            }
            else{
                setTempAddItemCartItem(null)
                setRetryAddToCart(false)
                throw new Error("Error: tempAddItemCartItem is null")
            }
        }

        // Functions to retry removing an item from the cart.
        if(retryRemoveFromCart){
            if(tempRemoveItemCartItem){
                const retryRemoveFromCartFunction = async () => {
                    await removeItemFromCart(tempRemoveItemCartItem.productId,
                        tempRemoveItemCartItem.color,
                        tempRemoveItemCartItem.size)
                }
                void retryRemoveFromCartFunction()
            }
            else{
                setTempRemoveItemCartItem(null)
                setRetryRemoveFromCart(false)
                throw new Error("Error: tempRemoveItemCartItem is null")
            }
        }
    },[cartSession])  

    /**
     * CART ACTIONS
     */
    const addItemToCart = async (productId: number, color: string, colorCode: string, colorHex: string, size: string, price: number, image: string) => {

        setLoadingCartAction(true)
        // If cartSession we have no cartSession or sessionId
        if(!cartSession || !sessionId){

            // If we have not already tried to reload te session
            if(!retryAddToCart){
                // Set try to reload to to, save the item to add, and reload the session.
                setRetryAddToCart(true)
                setTempAddItemCartItem({
                    productId,
                    color,
                    size,
                    price,
                    image,
                    quantity:1,
                    colorCode,
                    colorHex
                })
                await reloadSession()
            }
            else{
                // If we have already tried to reload the session, throw an error.
                setRetryAddToCart(false)
                setTempAddItemCartItem(null)
                setLoadingCartAction(false)
                throw new Error("Error: Could not find sessionId")
            }
        }
        setRetryAddToCart(false)
        setTempAddItemCartItem(null)

        // If cartItems is empty, it is a new session, so we create a new cart item.
        if(cartItems.length == 0){
     
            const cartItems: CartItemType[] = [{
                productId,
                color,
                size,
                price,
                image,
                quantity: 1,
                colorCode,
                colorHex
            }]

            // If we have a sessionId, we can create or update the cartSession.
            if(sessionId){
                createOrUpdateCartSession({
                    sessionId,
                    cartItems
                })
            }
        }

        // If cartItems is not empty, we can check if the item exists in the cart.
        if(cartSession && cartItems.length > 0){
            const checkItemExistsInCart = cartItems.find(item => item.productId == productId && item.color == color && item.size == size)

            // If the item exists in the cart, we can update the quantity.
            if(checkItemExistsInCart){
                const updatedCartItems = cartItems.map(item => {
                    if(item.productId == productId && item.color == color && item.size == size){
                        return {
                            ...item,
                            quantity: item.quantity + 1
                        }
                    }
                    else{
                        return item
                    }
                })
                createOrUpdateCartSession({
                    sessionId: cartSession.sessionId,
                    cartItems: updatedCartItems
                })
            }
            // If the item does not exist in the cart, we can add it with quantity 1.
            else{
                const updatedCartItems = [...cartItems, {
                    productId,
                    color,
                    size,
                    price,
                    image,
                    quantity: 1,
                    colorCode,
                    colorHex
                }]

                createOrUpdateCartSession({
                    sessionId: cartSession.sessionId,
                    cartItems: updatedCartItems
                })
            }
        }
    }
    const removeItemFromCart = async (productId: number, color: string, size: string) => {
       
        setLoadingCartAction(true)
        // If cartSession we have no cartSession or sessionId
        if(!cartSession || !sessionId){

            // If we have not already tried to reload te session
            if(!retryRemoveFromCart){
                // Set try to reload to to, save the item to add, and reload the session.
                setRetryRemoveFromCart(true)
                setTempRemoveItemCartItem({
                    productId,
                    color,
                    size,
                    price: 0,
                    image: "",
                    quantity:1,
                    colorCode: "",
                    colorHex: ""
                })
                await reloadSession()
            }
            else{
                // If we have already tried to reload the session, throw an error.
                setRetryRemoveFromCart(false)
                setTempRemoveItemCartItem(null)
                setLoadingCartAction(false)
                throw new Error("Error: Could not find sessionId")
            }
        }
        setRetryRemoveFromCart(false)
        setTempRemoveItemCartItem(null)

        // If cartItems is empty, return nothing.
        if(cartItems.length == 0){
            return
        }

        // If cartItems is not empty, we can check if the item exists in the cart.
        if(cartSession && cartItems.length > 0){
            const itemIndexInCart = cartItems.findIndex(item => item.productId == productId && item.color == color && item.size == size)

            // If the item exists in the cart...
            if(itemIndexInCart != -1){
                // If it's the last item in the cart, we remove it.
                if(cartItems.length > itemIndexInCart && cartItems[itemIndexInCart] && cartItems[itemIndexInCart]?.quantity == 1){
                    const updatedCartItems = cartItems.filter((item, index) => index != itemIndexInCart)

                    createOrUpdateCartSession({
                        sessionId: cartSession.sessionId,
                        cartItems: updatedCartItems
                    })
                }
                else{
                    const updatedCartItems = cartItems.map((item, index) => {
                        
                        if(index == itemIndexInCart){
                            return {
                                ...item,
                                quantity: item.quantity - 1
                            }
                        }
                        else{
                            return item
                        }
                    })
                    createOrUpdateCartSession({
                        sessionId: cartSession.sessionId,
                        cartItems: updatedCartItems
                    })
                }
            }
            else{
                return
            }
        }
    }
    const removeItemCompletelyFromCart = async (productId: number, color: string, size: string) => {
        setLoadingCartAction(true)
        // If cartSession we have no cartSession or sessionId
        if(!cartSession || !sessionId){

            // If we have not already tried to reload te session
            if(!retryRemoveFromCart){
                // Set try to reload to to, save the item to add, and reload the session.
                setRetryRemoveFromCart(true)
                setTempRemoveItemCartItem({
                    productId,
                    color,
                    size,
                    price: 0,
                    image: "",
                    quantity:1,
                    colorCode: "",
                    colorHex: "" 
                })
                await reloadSession()
            }
            else{
                // If we have already tried to reload the session, throw an error.
                setRetryRemoveFromCart(false)
                setTempRemoveItemCartItem(null)
                setLoadingCartAction(false)
                throw new Error("Error: Could not find sessionId")
            }
        }
        setRetryRemoveFromCart(false)
        setTempRemoveItemCartItem(null)

        // If cartItems is empty, return nothing.
        if(cartItems.length == 0){
            return
        }

        // If cartItems is not empty, we can check if the item exists in the cart.
        if(cartSession && cartItems.length > 0){
            const itemIndexInCart = cartItems.findIndex(item => item.productId == productId && item.color == color && item.size == size)

            // If the item exists in the cart...
            if(itemIndexInCart != -1){
                // Delete item completely from cart.
                const updatedCartItems = cartItems.filter((item, index) => index != itemIndexInCart)

                createOrUpdateCartSession({
                    sessionId: cartSession.sessionId,
                    cartItems: updatedCartItems
                })                
            }
            else{
                return
            }
        }
    }

    // Reloads sessionId from the cookie if no sessionId is present, and updates the sessionId state.
    const reloadSession = async() => {

        if(sessionId){
            getCartSession(sessionId)
        }
        else{
            const session = await fetchCartSession()
    
            const newSessionId: string | null = typeof session == "string" ? session : null
            if(newSessionId){
                setSessionId(newSessionId)
            }
        }
    }
    // Obtain the sessionId from the cookie.
    const getUserSessionId = async (): Promise<string | null> => {
        const session = await fetchCartSession()
        return typeof session == "string" ? session : null
    }
    // Fetch function that obtains the sessionId from the cookie.
    const fetchCartSession = () => {
        const sessionId = fetch("/api/sessionId")
            .then(res => res.json() as Promise<JsonData>)
            .then(data => {
                if(typeof data == "object" && 
                    data != null && 
                    Object.keys(data).includes("sessionId")){

                    return data.sessionId ?? null
                }
                else{
                    return null
                }
            } 
        )
        return sessionId
    }

    // Forces a new sessionId in the cookie, and therefore a new cartSession.
    const createNewCartSession = async () => {
        await fetch("/api/resetSessionId")
            .then(res => res.json() as Promise<JsonData>)
            .then(data => {
                if(typeof data == "object" && 
                    data != null && 
                    Object.keys(data).includes("sessionId")){

                    setSessionId(data.sessionId ?? null)
                }
                else{
                    setSessionId(null)
                }
            } 
        )
    }

    return(
        <CartContext.Provider
            value={{
              cartItems,
              cartSession,
              setCartSession,
              loadingCartAction,
              addItemToCart,
              removeItemFromCart,
              reloadSession,
              removeItemCompletelyFromCart,
              createNewCartSession,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export{ CartProvider }
export default CartContext