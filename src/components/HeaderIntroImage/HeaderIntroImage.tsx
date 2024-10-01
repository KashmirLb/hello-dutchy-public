import { useRouter } from 'next/router'
import useLanguage from '~/hooks/useLanguage'
import style from './HeaderIntroImage.module.css'
import CarouselSwiper from '../CarouselSwiper'
import { useEffect, useState } from 'react'
import type { HomeHeader } from '@prisma/client'
import { api } from '~/utils/api'
import { Loading } from '../Loading'
import dedent from 'dedent'

const EnglishHeaderText = ({index, headerData, type}: {index: number, headerData: HomeHeader[], type: string}) => {

    if(type == "text"){
        if(!headerData || headerData.length == 0 || !headerData[index]){
            return "Femke & Viktor dolls now available!"
        }
        return dedent`${headerData[index]?.textEnglish.replace("-", "\u2011")}`
    }
    else{
        if(!headerData || headerData.length == 0 || !headerData[index]){
            return "See more"
        }
        return dedent`${headerData[index]?.buttonTextEn.replace("-", "\u2011")}`
    }
}

const NederlandsHeaderText = ({index, headerData, type}: {index: number, headerData: HomeHeader[], type: string}) => {
  
    if(type == "text"){
        if(!headerData || headerData.length == 0 || !headerData[index]){
            return "Femke & Viktor poppen nu verkrijgbaar!"
        }
        return dedent`${headerData[index]?.textDutch.replace("-", "\u2011")}`
    }
    else{
        if(!headerData || headerData.length == 0 || !headerData[index]){
            return "Zie meer"
        }
        return dedent`${headerData[index]?.buttonTextNl.replace("-", "\u2011")}`
    }
}

const HeaderIntroImage = () => {

    const { languageData, language } = useLanguage()
    const router = useRouter()
    const [ homeHeaders, setHomeHeaders ] = useState<HomeHeader[]>([])
    const [ activeIndex, setActiveIndex ] = useState(0)

    const { data: headerData, isLoading } = api.homeHeader.getAll.useQuery()

    useEffect(() => {
        if(headerData){
            setHomeHeaders(headerData.sort((a, b) => a.id - b.id))
        }
    },[headerData])

    const changeActiveIndex = (index: number) => {
        setActiveIndex(index)
    }

    const redirectToUrl = (url: string | undefined) => {

        if(url){
            void router.push(url)
        }
        else{
            void router.push("/products")
        }
    }

  return (
        <div className='md:min-h-screen-minus-navbar h-full'>
            <div className='w-full h-10 flex justify-center items-center'>
                <span className='font-semibold text-slate-900'>{languageData.headerTopWelcome}</span>
            </div>
            <div className='flex justify-center w-full bg-sky-200 h-fit'>
                <div className={style.headerContainerWrapper}>
                    <div className={`${style.headerContainer} bg-sky-200 `}>
                        <div className={`${style.textGrid} md:w-2/5 w-full text-primary-light flex items-center font-poppinsRegular`}>
                        {
                            isLoading || !headerData ? <></> : (
                                <div className='px-10 flex flex-col gap-10 '>
                                    <h1 className='text-4xl break-keep'>
                                        {
                                            headerData && language==="English" ? EnglishHeaderText({index: activeIndex, headerData, type: "text"}) : headerData && language==="Nederlands" ? NederlandsHeaderText({index: activeIndex, headerData: headerData, type: "text"}) : ""
                                        }
                                    </h1>
                                    <button 
                                        className='bg-primary hover:bg-navbar-blue p-3 text-site-white text-xl tracking-wider uppercase font-semibold transition-all rounded-md'
                                        onClick={()=> redirectToUrl(headerData[activeIndex]?.url ? headerData[activeIndex]?.url : "")}
                                    >
                                        {
                                            headerData && language==="English" ? EnglishHeaderText({index: activeIndex, headerData, type: "button"}) : headerData && language==="Nederlands" ? NederlandsHeaderText({index: activeIndex, headerData: headerData, type: "button"}) : ""
                                        }
                                    </button>
                                </div>
                            )
                        }
    
                        </div>
                        <div className={`${style.imageContainer} md:w-3/5 w-full h-full`}>
                        {
                            isLoading || !headerData? <></> : (
                                <CarouselSwiper changeActiveIndex={changeActiveIndex} headerData={headerData} />
                            )
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default HeaderIntroImage