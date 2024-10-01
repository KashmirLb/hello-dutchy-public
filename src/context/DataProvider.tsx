import { createContext, useEffect, useState } from "react";
import type { ProductWithCategoryAndImages } from "~/types";
import { api } from "~/utils/api";

export type dataContextType = {
    dataPhone: string,
    dataEmail: string,
    dataInstagram: string,
    dataFacebook: string,
    allProducts: ProductWithCategoryAndImages[],
    productsLoading: boolean
}
const DataContext = createContext<dataContextType | null>(null)
const DataProvider = ({children}: any) => {

    const { data: contactData } = api.contactInfo.getAll.useQuery()
    const { data: productData, isLoading: productsLoading } = api.product.getAll.useQuery()

    const [ dataPhone, setDataPhone ] = useState("")
    const [ dataEmail, setDataEmail ] = useState("")
    const [ dataInstagram, setDataInstagram ] = useState("")
    const [ dataFacebook, setDataFacebook] = useState("")
    const [ allProducts, setAllProducts ] = useState<ProductWithCategoryAndImages[]>([])

    useEffect(()=> {

        contactData?.map(contact=> {
            switch(contact.name.toLowerCase()){
                case "telephone":{
                    setDataPhone(contact.value)
                    break;
                }
                case "email":{
                    setDataEmail(contact.value)
                    break;
                }
                case "instagram":{
                    setDataInstagram(contact.value)
                    break;
                }
                case "facebook":{
                    setDataFacebook(contact.value)
                    break;
                }
            }
        })
    }, [contactData, setDataPhone, setDataEmail, setDataInstagram])

    useEffect(()=> {
        if(productData){
            setAllProducts(productData)
        }
    }, [productData])

    return(
        <DataContext.Provider
            value={{
              dataPhone,
              dataEmail,
              dataInstagram,
              dataFacebook,
              allProducts,
              productsLoading
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export{ DataProvider }
export default DataContext