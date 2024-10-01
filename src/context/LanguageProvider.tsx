import { useRouter } from "next/router";
import English from '../data/English'
import Nederlands from '../data/Nederlands'
import { createContext, useEffect, useState } from "react";


export type languageContextType = {
    language: string,
    changeLanguage: (language: string)=>void,
    languageData: Record<string, string>,
    languageSelected: boolean,
    changeLanguageSelected: (selected: boolean)=>void,
    mobileDevice: boolean,
    languageLocale: string,
    changeLanguageLocale: (locale: string)=>void
}
const LanguageContext = createContext<languageContextType | null>(null)
const LanguageProvider = ({children}: any) => {

    const [ language, setLanguage ] = useState<string>("English")
    const [ languageLocale, setLanguageLocale ] = useState<string>("en-EN")
    const [ languageSelected, setLanguageSelected ] = useState<boolean>(false)
    const [ languageData, setLanguageData ] = useState<Record<string, string>>(English)

    const [ mobileDevice, setMobileDevice ] = useState(false)


    useEffect(()=>{
        if(language==="Nederlands"){
            setLanguageData(Nederlands)
        }
        else{
            setLanguageData(English)
        }
        if(navigator){
            const userAgent = navigator.userAgent || navigator.vendor;

            const mobileDevices = ['Mobile', 'Android', 'iPhone', 'iPad', 'Windows Phone']
        
            if(mobileDevices.some(device => userAgent.toLowerCase().includes(device.toLowerCase()))){
                setMobileDevice(true)
            }
            else if(userAgent.toLowerCase().includes("mac")){
                try{
                    document.createEvent("TouchEvent");
                    setMobileDevice(true)
                }
                catch(e){
                    setMobileDevice(false)
                }
            }
            else{
                setMobileDevice(false)
            }
        }

    },[language, setMobileDevice])

    const changeLanguage = (language: string) => {
        setLanguage(language)
    }

    const changeLanguageSelected = (selected: boolean) => {
        setLanguageSelected(selected)
    }

    const changeLanguageLocale = (locale: string) => {
        setLanguageLocale(locale)
    }

    return(
        <LanguageContext.Provider
            value={{
                language,
                changeLanguage,
                languageData,
                languageSelected,
                changeLanguageSelected,
                mobileDevice,
                languageLocale,
                changeLanguageLocale
            }}
        >
            {children}
        </LanguageContext.Provider>
    )
}

export{ LanguageProvider }
export default LanguageContext