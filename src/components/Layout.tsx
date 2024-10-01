import Image from "next/image"
import Link from "next/link"
import { Lakki_Reddy }from 'next/font/google'
import { useEffect, useState } from "react"
import dutchyLogo from "@public/hello-dutchy-logo-white.png"
import localFont from 'next/font/local'
import {Analytics} from '@vercel/analytics/react'
import useScrollDetection from "~/hooks/useScrollDetection"
import useLanguage from "~/hooks/useLanguage"
import { useRouter } from "next/router"
import useInstagramLink from "~/hooks/useInstagramLink"
import useCart from "~/hooks/useCart"

const lakki = Lakki_Reddy({
  weight: "400",
  subsets: ['latin'],
  variable: '--font-lakki',
})

const chalkFont = localFont({
    src: '../../public/font/EraserRegular.ttf',
    display: 'swap',
    variable: '--chalk-font'
})

const dustFont = localFont({
    src: '../../public/font/EraserDust.ttf',
    display: 'swap',
    variable: '--dust-font'
})

const wanderlustFont = localFont({
    src: '../../public/font/Wanderlust-Shine.ttf',
    display: 'swap',
    variable: '--wanderlust-font'
})

const quicksandFont = localFont({
    src: '../../public/font/Quicksand-VariableFont_wght.ttf',
    display: 'swap',
    variable: '--quicksand-font'
})
const jostFont = localFont({
    src: '../../public/font/Jost-VariableFont_wght.ttf',
    display: 'swap',
    variable: '--jost-font'
})
const robotoCondensedFont = localFont({
    src: '../../public/font/RobotoCondensed-VariableFont_wght.ttf',
    display: 'swap',
    variable: '--roboto-condensed-font'
})
const abelFont = localFont({
    src: '../../public/font/Abel-Regular.ttf',
    display: 'swap',
    variable: '--abel-font'
})
const poppinsRegularFont = localFont({
    src: '../../public/font/Poppins-Regular.ttf',
    display: 'swap',
    variable: '--poppins-regular-font'
})
const poppinsSemiBoldFont = localFont({
    src: '../../public/font/Poppins-SemiBold.ttf',
    display: 'swap',
    variable: '--poppins-semi-bold-font'
})

const Layout = ({children}: any) => {

    const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false)
    const [ mobileAnimationClosing, setMobileAnimationClosing ] = useState(false)
    const { language, languageData, languageSelected, changeLanguage, changeLanguageSelected, changeLanguageLocale  } = useLanguage()
    const [ disabled, setDisabled ] = useState(false)
    const instagramLink = useInstagramLink()
    
    const scrolledTop = useScrollDetection()
    const yearDate = new Date().getFullYear()
    const router = useRouter()

    const { cartSession, reloadSession } = useCart()

    useEffect(() => {
        if(!cartSession){
            reloadSession()

        }
    },[])

    useEffect(() => {
        if(!languageSelected){
            if(navigator.language.toLowerCase().includes("nl")){
                changeLanguage("Nederlands")
            }
            else{
                changeLanguage("English")
            }
            changeLanguageLocale(navigator.language ?? "en-EN")
            changeLanguageSelected(true)
        }
    },[changeLanguage, changeLanguageSelected, changeLanguageLocale, languageSelected])

    useEffect(() => {
        if(mobileMenuOpen){
            document.body.style.overflow = "hidden"
        }
        else{
            document.body.style.overflow = "auto"
        }
    },[mobileMenuOpen])

    const handleLanguageSwitch = () =>{
        if(!disabled){
            setDisabled(true)
            if(language==="English"){
                changeLanguage("Nederlands")
            }
            else{
                changeLanguage("English")
            }
            setTimeout(()=>{
                setDisabled(false)
            },1200)
        }
    }

    const handleMobileMenuClose = () => {
        setMobileAnimationClosing(true)
        setTimeout(()=>{
            setMobileMenuOpen(false)
            setMobileAnimationClosing(false)
        },500)
    }

    if(!language || language =="" ){
        return <></>
    }
    
  return (
    <div 
        className={`
            min-h-screen w-full 
            ${lakki.variable} ${chalkFont.variable} ${dustFont.variable} ${wanderlustFont.variable} ${quicksandFont.variable} ${jostFont.variable} ${robotoCondensedFont.variable} ${abelFont.variable} ${poppinsRegularFont.variable} ${poppinsSemiBoldFont.variable} font-sans
            flex flex-col justify-between`}
    >
        <div className="flex justify-center w-full font-quicksand">
            <div className="w-full overflow-clip">
                <header>
                    <div className={`fixed top-0 w-full ${scrolledTop ? "" : "-translate-y-10"} transition-all z-20`}>
                        <div className="w-full h-10 pr-8 border-b border-slate-300 md:flex hidden justify-end items-center gap-8 bg-site-white">
                            <div className="font-bold flex gap-1 hover:text-navbar-blue hover:cursor-pointer transition-all text-sm text-slate-600">
                                <span onClick={()=>router.push("/contact")}>{languageData.navInYourStore}</span>
                            </div>
                            {/*
                                TODO: FUTURE LOGIN OPTION
                            <div className="font-bold flex gap-1 hover:text-navbar-blue hover:cursor-pointer transition-all">
                                <span className="h-6 w-6">
                                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                                        <g  strokeWidth="0"></g>
                                        <g strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g ><path id="secondary" d="M7.46,13.26A5,5,0,0,0,4,18v1s2,2,8,2,8-2,8-2V18a5,5,0,0,0-3.51-4.75" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><circle id="primary" cx="12" cy="9" r="6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle></g>
                                    </svg>
                                </span>
                                <span>Login</span>
                            </div> */}
                            <div className="language-icon-container md:flex hidden">
                                <div className={language} onClick={handleLanguageSwitch}/>
                            </div>
                        </div>
                        <div className={`bg-site-white h-14 w-full fixed z-10 md:flex hidden`}>
                            <nav className="
                                border-b border-slate-300
                                bg-site-white 
                                h-14 w-full
                                fixed
                                hidden md:flex justify-around items-center
                                text-xl 
                                z-10"
                            >
                                <Link 
                                    className="w-full h-full relative 
                                        flex justify-center items-center gap-2 
                                        font-bold text-slate-900 
                                        hover:text-navbar-blue transition-all
                                        z-20
                                        navbar-div"
                                    href={"/"}
                                >
                                    <span>
                                        <Image
                                            src={dutchyLogo}
                                            height={96}
                                            width={180}
                                            alt="Hello Dutchy logo sign"
                                            priority
                                            className={`absolute h-auto w-44 left-1/2 -translate-x-1/2 ${ scrolledTop ? "-top-10" : "top-1 left-4 -translate-x-0 opacity-0"} transition-all z-20`}
                                        />
                                    </span>
                                    {!scrolledTop ? (
                                        <span className="w-fit h-fit lg:pr-10 md:pr-4">
                                            <Image
                                                src={dutchyLogo}
                                                height={48}
                                                width={90}
                                                alt="Hello Dutchy logo sign"
                                            />
                                        </span>
                                    ) : (<></>)}
                                    <span className="w-6 h-6 mb-2">
                                        <svg viewBox="0 0 24 24" fill="inherit" xmlns="http://www.w3.org/2000/svg">
                                            <g strokeWidth="0"></g>
                                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g>
                                                <path  clipRule="evenodd" d="M11.3103 1.77586C11.6966 1.40805 12.3034 1.40805 12.6897 1.77586L20.6897 9.39491L23.1897 11.7759C23.5896 12.1567 23.605 12.7897 23.2241 13.1897C22.8433 13.5896 22.2103 13.605 21.8103 13.2241L21 12.4524V20C21 21.1046 20.1046 22 19 22H14H10H5C3.89543 22 3 21.1046 3 20V12.4524L2.18966 13.2241C1.78972 13.605 1.15675 13.5896 0.775862 13.1897C0.394976 12.7897 0.410414 12.1567 0.810345 11.7759L3.31034 9.39491L11.3103 1.77586ZM5 10.5476V20H9V15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15V20H19V10.5476L12 3.88095L5 10.5476ZM13 20V15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15V20H13Z" fill="currentColor">
                                                </path> </g>
                                        </svg>
                                    </span>
                                    <span className="header-navbar-item">
                                        {languageData.navHome ?? "Home"}
                                    </span>
                                </Link>
                                <Link
                                    className="w-full h-full relative 
                                        flex justify-center items-center gap-2 
                                        font-bold text-slate-900 
                                        hover:text-navbar-blue transition-all
                                        z-20
                                        navbar-div"
                                    href={"/products"}
                                >
                                    <span className="w-6 h-6 mb-1">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g strokeWidth="0"></g>
                                        <g strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g > 
                                            <path d="M3.79424 12.0291C4.33141 9.34329 4.59999 8.00036 5.48746 7.13543C5.65149 6.97557 5.82894 6.8301 6.01786 6.70061C7.04004 6 8.40956 6 11.1486 6H12.8515C15.5906 6 16.9601 6 17.9823 6.70061C18.1712 6.8301 18.3486 6.97557 18.5127 7.13543C19.4001 8.00036 19.6687 9.34329 20.2059 12.0291C20.9771 15.8851 21.3627 17.8131 20.475 19.1793C20.3143 19.4267 20.1267 19.6555 19.9157 19.8616C18.7501 21 16.7839 21 12.8515 21H11.1486C7.21622 21 5.25004 21 4.08447 19.8616C3.87342 19.6555 3.68582 19.4267 3.5251 19.1793C2.63744 17.8131 3.02304 15.8851 3.79424 12.0291Z" stroke="currentColor" strokeWidth="2"></path>
                                            <path d="M9 6V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
                                            <path d="M9.1709 15C9.58273 16.1652 10.694 17 12.0002 17C13.3064 17 14.4177 16.1652 14.8295 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
                                        </g></svg>
                                    </span>
                                    <span className="header-navbar-item">
                                        {languageData.navProducts ?? "Products"}
                                    </span>
                                </Link>
                                <Link
                                    className="w-full h-full relative 
                                        flex justify-center items-center gap-2 
                                        font-bold text-slate-900 
                                        hover:text-navbar-blue transition-all
                                        z-20
                                        navbar-div"
                                    href={"/about"}
                                >
                                    <span className="w-6 h-6 mb-1">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g> 
                                                <path fillRule="evenodd" clipRule="evenodd" d="M23 4C23 3.11596 21.855 2.80151 21.0975 2.59348C21.0279 2.57437 20.9616 2.55615 20.8997 2.53848C19.9537 2.26818 18.6102 2 17 2C15.2762 2 13.8549 2.574 12.8789 3.13176C12.7296 3.21707 12.5726 3.33492 12.4307 3.44143C12.2433 3.58215 12.0823 3.70308 12 3.70308C11.9177 3.70308 11.7567 3.58215 11.5693 3.44143C11.4274 3.33492 11.2704 3.21707 11.1211 3.13176C10.1451 2.574 8.72378 2 7 2C5.38978 2 4.0463 2.26818 3.10028 2.53848C3.04079 2.55547 2.97705 2.57302 2.91016 2.59144C2.156 2.79911 1 3.11742 1 4V17C1 17.3466 1.17945 17.6684 1.47427 17.8507C1.94329 18.1405 2.56224 17.8868 3.11074 17.662C3.30209 17.5835 3.48487 17.5086 3.64972 17.4615C4.4537 17.2318 5.61022 17 7 17C8.2613 17 9.20554 17.4161 9.9134 17.8517C10.0952 17.9636 10.279 18.1063 10.4676 18.2527C10.9338 18.6148 11.4298 19 12 19C12.5718 19 13.0653 18.6162 13.5307 18.2543C13.7195 18.1074 13.9037 17.9642 14.0866 17.8517C14.7945 17.4161 15.7387 17 17 17C18.3898 17 19.5463 17.2318 20.3503 17.4615C20.5227 17.5108 20.7099 17.5898 20.9042 17.6719C21.4443 17.9 22.0393 18.1513 22.5257 17.8507C22.8205 17.6684 23 17.3466 23 17V4ZM3.33252 4.55749C3.13163 4.62161 3 4.81078 3 5.02166V14.8991C3 15.233 3.32089 15.4733 3.64547 15.3951C4.53577 15.1807 5.67777 15 7 15C8.76309 15 10.0794 15.5994 11 16.1721V5.45567C10.7989 5.29593 10.5037 5.08245 10.1289 4.86824C9.35493 4.426 8.27622 4 7 4C5.41509 4 4.12989 4.30297 3.33252 4.55749ZM17 15C15.2369 15 13.9206 15.5994 13 16.1721V5.45567C13.2011 5.29593 13.4963 5.08245 13.8711 4.86824C14.6451 4.426 15.7238 4 17 4C18.5849 4 19.8701 4.30297 20.6675 4.55749C20.8684 4.62161 21 4.81078 21 5.02166V14.8991C21 15.233 20.6791 15.4733 20.3545 15.3951C19.4642 15.1807 18.3222 15 17 15Z" fill="currentColor"></path>
                                                <path d="M2.08735 20.4087C1.86161 19.9047 2.08723 19.3131 2.59127 19.0873C3.05951 18.8792 3.54426 18.7043 4.0318 18.5478C4.84068 18.2883 5.95911 18 7 18C8.16689 18 9.16285 18.6289 9.88469 19.0847C9.92174 19.1081 9.95807 19.131 9.99366 19.1534C10.8347 19.6821 11.4004 20 12 20C12.5989 20 13.1612 19.6829 14.0012 19.1538C14.0357 19.1321 14.0708 19.1099 14.1066 19.0872C14.8291 18.6303 15.8257 18 17 18C18.0465 18 19.1647 18.2881 19.9732 18.548C20.6992 18.7814 21.2378 19.0122 21.3762 19.073C21.8822 19.2968 22.1443 19.8943 21.9118 20.4105C21.6867 20.9106 21.0859 21.1325 20.5874 20.9109C20.1883 20.7349 19.7761 20.5855 19.361 20.452C18.6142 20.2119 17.7324 20 17 20C16.4409 20 15.9037 20.3186 15.0069 20.8841C14.2635 21.3529 13.2373 22 12 22C10.7619 22 9.73236 21.3521 8.98685 20.8829C8.08824 20.3173 7.55225 20 7 20C6.27378 20 5.39222 20.2117 4.64287 20.4522C4.22538 20.5861 3.80974 20.7351 3.4085 20.9128C2.9045 21.1383 2.31305 20.9127 2.08735 20.4087Z" fill="currentColor"></path>
                                            </g>
                                        </svg>                             
                                    </span>
                                    <span className="header-navbar-item">
                                        {languageData.navAbout ?? "About us"}
                                    </span>
                                </Link>
                                <Link
                                    className="w-full h-full relative 
                                        flex justify-center items-center gap-2 
                                        font-bold text-slate-900 
                                        hover:text-navbar-blue transition-all
                                        z-20
                                        navbar-div"
                                    href={"/contact"}
                                >
                                    <span className="w-6 h-6 mb-1">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                            <g strokeWidth="0"></g>
                                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g >
                                                <polyline fill="none" points="4 8.2 12 14.1 20 8.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline> 
                                                <rect fill="none" height="14" rx="2" ry="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="6.5"></rect> 
                                            </g>
                                        </svg>
                                    </span>
                                    <span className="header-navbar-item">
                                        {languageData.navContact ?? "Contact"}
                                    </span>
                                </Link>
                                
                                <Link
                                    className="w-1/2 h-full relative 
                                        flex justify-center items-center
                                        font-bold text-navbar-blue
                                        hover:text-secondary transition-all
                                        border-navbar-blue hover:border-secondary
                                        z-20
                                        navbar-div"
                                    href={"/cart"}
                                >
                                    <span className="w-10 h-10 ">
                                        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <g>
                                                <path d="M18.5,20.5A1.5,1.5,0,1,1,17,19,1.5,1.5,0,0,1,18.5,20.5ZM11,19a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,11,19Z" fill="currentColor"></path>
                                                <path d="M18.2,14a1,1,0,0,0,.93-.63l2.8-7a1,1,0,0,0-.1-.93A1,1,0,0,0,21,5H7.88l-.7-1.74A2,2,0,0,0,5.32,2H3A1,1,0,0,0,3,4H5.32L8.9,13,7.83,15.11A2,2,0,0,0,9.62,18H19a1,1,0,0,0,0-2H9.62l1-2Z" fill="currentColor"></path>
                                            </g>
                                        </svg>
                                    </span>
                                    <span className="h-full w-6 border-inherit flex items-end">
                                        <span className="border border-inherit rounded-full flex justify-center items-center w-6 h-6 bg-site-white text-base">
                                            {cartSession?.cartItems?.length ? cartSession.cartItems.length : 0}
                                        </span>
                                    </span>
                                </Link>
                            </nav>
                        </div>
                    </div>
                    <div className="md:hidden flex justify-center items-center py-2 bg-site-white border-b border-slate-300">
                        <span className="h-auto w-auto" onClick={() => router.push("/")}>
                            <Image
                                src={dutchyLogo}
                                height={48}
                                width={90}
                                alt="Hello Dutchy logo sign"
                                priority
                            />
                        </span>
                    </div>
                </header>
                <main className="md:pt-24">
                    {children}
                </main>
            </div>
            {
                mobileMenuOpen ? (
                    <div className="mobile-menu-container">
                        <div className={`mobile-menu ${mobileAnimationClosing ? "closing" : ""}`}>
                            <nav className="text-2xl pb-24 font-bold overflow-y-scroll max-h-screen">
                                <span className="fixed w-auto h-auto">
                                    <Image
                                        src={dutchyLogo}
                                        height={72}
                                        width={135}
                                        alt="Hello Dutchy logo sign"
                                        priority
                                    />
                                </span>
                                <Link
                                    className="w-full text-primary-light flex gap-2 items-center pt-24"
                                    href={"/"}
                                >
                                    <span className="w-6 h-6">
                                        <svg viewBox="0 0 24 24" fill="inherit" xmlns="http://www.w3.org/2000/svg">
                                        <g strokeWidth="0"></g>
                                        <g strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g>
                                            <path  clipRule="evenodd" d="M11.3103 1.77586C11.6966 1.40805 12.3034 1.40805 12.6897 1.77586L20.6897 9.39491L23.1897 11.7759C23.5896 12.1567 23.605 12.7897 23.2241 13.1897C22.8433 13.5896 22.2103 13.605 21.8103 13.2241L21 12.4524V20C21 21.1046 20.1046 22 19 22H14H10H5C3.89543 22 3 21.1046 3 20V12.4524L2.18966 13.2241C1.78972 13.605 1.15675 13.5896 0.775862 13.1897C0.394976 12.7897 0.410414 12.1567 0.810345 11.7759L3.31034 9.39491L11.3103 1.77586ZM5 10.5476V20H9V15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15V20H19V10.5476L12 3.88095L5 10.5476ZM13 20V15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15V20H13Z" fill="currentColor">
                                            </path> </g>
                                        </svg>
                                    </span>
                                    {languageData.navHome ?? "Home"}
                                </Link>
                                <Link
                                    className="w-full text-primary-light flex gap-2 items-center"
                                    href={"/products"}
                                >
                                    <span className="w-6 h-6 mb-1">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g strokeWidth="0"></g>
                                        <g strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g > 
                                            <path d="M3.79424 12.0291C4.33141 9.34329 4.59999 8.00036 5.48746 7.13543C5.65149 6.97557 5.82894 6.8301 6.01786 6.70061C7.04004 6 8.40956 6 11.1486 6H12.8515C15.5906 6 16.9601 6 17.9823 6.70061C18.1712 6.8301 18.3486 6.97557 18.5127 7.13543C19.4001 8.00036 19.6687 9.34329 20.2059 12.0291C20.9771 15.8851 21.3627 17.8131 20.475 19.1793C20.3143 19.4267 20.1267 19.6555 19.9157 19.8616C18.7501 21 16.7839 21 12.8515 21H11.1486C7.21622 21 5.25004 21 4.08447 19.8616C3.87342 19.6555 3.68582 19.4267 3.5251 19.1793C2.63744 17.8131 3.02304 15.8851 3.79424 12.0291Z" stroke="currentColor" strokeWidth="2"></path>
                                            <path d="M9 6V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
                                            <path d="M9.1709 15C9.58273 16.1652 10.694 17 12.0002 17C13.3064 17 14.4177 16.1652 14.8295 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
                                        </g></svg>
                                    </span>
                                    {languageData.navProducts ?? "Products"}
                                </Link>
                                <Link
                                    className="w-full text-primary-light flex gap-2 items-center"
                                    href={"/about"}
                                >
                                    <span className="w-6 h-6 mb-1">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g> 
                                                <path fillRule="evenodd" clipRule="evenodd" d="M23 4C23 3.11596 21.855 2.80151 21.0975 2.59348C21.0279 2.57437 20.9616 2.55615 20.8997 2.53848C19.9537 2.26818 18.6102 2 17 2C15.2762 2 13.8549 2.574 12.8789 3.13176C12.7296 3.21707 12.5726 3.33492 12.4307 3.44143C12.2433 3.58215 12.0823 3.70308 12 3.70308C11.9177 3.70308 11.7567 3.58215 11.5693 3.44143C11.4274 3.33492 11.2704 3.21707 11.1211 3.13176C10.1451 2.574 8.72378 2 7 2C5.38978 2 4.0463 2.26818 3.10028 2.53848C3.04079 2.55547 2.97705 2.57302 2.91016 2.59144C2.156 2.79911 1 3.11742 1 4V17C1 17.3466 1.17945 17.6684 1.47427 17.8507C1.94329 18.1405 2.56224 17.8868 3.11074 17.662C3.30209 17.5835 3.48487 17.5086 3.64972 17.4615C4.4537 17.2318 5.61022 17 7 17C8.2613 17 9.20554 17.4161 9.9134 17.8517C10.0952 17.9636 10.279 18.1063 10.4676 18.2527C10.9338 18.6148 11.4298 19 12 19C12.5718 19 13.0653 18.6162 13.5307 18.2543C13.7195 18.1074 13.9037 17.9642 14.0866 17.8517C14.7945 17.4161 15.7387 17 17 17C18.3898 17 19.5463 17.2318 20.3503 17.4615C20.5227 17.5108 20.7099 17.5898 20.9042 17.6719C21.4443 17.9 22.0393 18.1513 22.5257 17.8507C22.8205 17.6684 23 17.3466 23 17V4ZM3.33252 4.55749C3.13163 4.62161 3 4.81078 3 5.02166V14.8991C3 15.233 3.32089 15.4733 3.64547 15.3951C4.53577 15.1807 5.67777 15 7 15C8.76309 15 10.0794 15.5994 11 16.1721V5.45567C10.7989 5.29593 10.5037 5.08245 10.1289 4.86824C9.35493 4.426 8.27622 4 7 4C5.41509 4 4.12989 4.30297 3.33252 4.55749ZM17 15C15.2369 15 13.9206 15.5994 13 16.1721V5.45567C13.2011 5.29593 13.4963 5.08245 13.8711 4.86824C14.6451 4.426 15.7238 4 17 4C18.5849 4 19.8701 4.30297 20.6675 4.55749C20.8684 4.62161 21 4.81078 21 5.02166V14.8991C21 15.233 20.6791 15.4733 20.3545 15.3951C19.4642 15.1807 18.3222 15 17 15Z" fill="currentColor"></path>
                                                <path d="M2.08735 20.4087C1.86161 19.9047 2.08723 19.3131 2.59127 19.0873C3.05951 18.8792 3.54426 18.7043 4.0318 18.5478C4.84068 18.2883 5.95911 18 7 18C8.16689 18 9.16285 18.6289 9.88469 19.0847C9.92174 19.1081 9.95807 19.131 9.99366 19.1534C10.8347 19.6821 11.4004 20 12 20C12.5989 20 13.1612 19.6829 14.0012 19.1538C14.0357 19.1321 14.0708 19.1099 14.1066 19.0872C14.8291 18.6303 15.8257 18 17 18C18.0465 18 19.1647 18.2881 19.9732 18.548C20.6992 18.7814 21.2378 19.0122 21.3762 19.073C21.8822 19.2968 22.1443 19.8943 21.9118 20.4105C21.6867 20.9106 21.0859 21.1325 20.5874 20.9109C20.1883 20.7349 19.7761 20.5855 19.361 20.452C18.6142 20.2119 17.7324 20 17 20C16.4409 20 15.9037 20.3186 15.0069 20.8841C14.2635 21.3529 13.2373 22 12 22C10.7619 22 9.73236 21.3521 8.98685 20.8829C8.08824 20.3173 7.55225 20 7 20C6.27378 20 5.39222 20.2117 4.64287 20.4522C4.22538 20.5861 3.80974 20.7351 3.4085 20.9128C2.9045 21.1383 2.31305 20.9127 2.08735 20.4087Z" fill="currentColor"></path>
                                            </g>
                                        </svg>                                  
                                    </span>
                                    {languageData.navAbout ?? "About us"}
                                </Link>
                                <Link
                                    className="w-full text-primary-light flex gap-2 items-center"
                                    href={"/contact"}
                                >
                                    <span className="w-6 h-6 mb-1">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                            <g strokeWidth="0"></g>
                                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g >
                                                <polyline fill="none" points="4 8.2 12 14.1 20 8.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline> 
                                                <rect fill="none" height="14" rx="2" ry="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="6.5"></rect> 
                                            </g>
                                        </svg>
                                    </span>
                                    {languageData.navContact ?? "Contact"}
                                </Link>
                                <div className="flex flex-col gap-8">
                                    <Link
                                        className="w-full text-navbar-blue flex gap-2 items-center border-navbar-blue hover:border-secondary"
                                        href={"/cart"}
                                    >
                                        <span className="w-14 h-14 ">
                                            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <g>
                                                    <path d="M18.5,20.5A1.5,1.5,0,1,1,17,19,1.5,1.5,0,0,1,18.5,20.5ZM11,19a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,11,19Z" fill="currentColor"></path>
                                                    <path d="M18.2,14a1,1,0,0,0,.93-.63l2.8-7a1,1,0,0,0-.1-.93A1,1,0,0,0,21,5H7.88l-.7-1.74A2,2,0,0,0,5.32,2H3A1,1,0,0,0,3,4H5.32L8.9,13,7.83,15.11A2,2,0,0,0,9.62,18H19a1,1,0,0,0,0-2H9.62l1-2Z" fill="currentColor"></path>
                                                </g>
                                            </svg>
                                        </span>
                                        <span className="h-full w-6 border-inherit flex items-end">
                                        <span className="border border-inherit rounded-full flex justify-center items-center w-6 h-6 bg-site-white text-base">
                                            {cartSession?.cartItems?.length ? cartSession.cartItems.length : 0}
                                        </span>
                                    </span>
                                    </Link>
                                    {/* 
                                        TODO: FUTURE LOGIN OPTION
                                    <Link
                                        className="w-full text-navbar-blue flex gap-2 items-center"
                                        href={"/cart"}
                                    >
                                        <span className="w-10 h-10">
                                            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                                                <g  strokeWidth="0"></g>
                                                <g strokeLinecap="round" strokeLinejoin="round"></g>
                                                <g ><path id="secondary" d="M7.46,13.26A5,5,0,0,0,4,18v1s2,2,8,2,8-2,8-2V18a5,5,0,0,0-3.51-4.75" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><circle id="primary" cx="12" cy="9" r="6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle></g>
                                            </svg>
                                        </span>
                                        Login
                                    </Link> */}
                                    <div className="language-icon-container-mobile">
                                        <div className={language} onClick={handleLanguageSwitch}/>
                                    </div>
                                    <Link
                                        className="pt-2 w-full text-primary-light text-base"
                                        href={"/contact"}
                                    >
                                        {languageData.navInYourStore}
                                    </Link>
                                </div>
                            </nav>
                            <button onClick={()=>handleMobileMenuClose()} className="absolute right-8 mobile-close-button">
                                <Image
                                    src={"/close-black.png"}
                                    height={60}
                                    width={60}
                                    alt="close menu"
                                />
                            </button>                            
                        </div>
                    </div>
                )
                :(
                    <div className="mobile-menu-button-container border rounded-md border-slate-300 md:hidden absolute overflow-clip">
                        <button onClick={()=> setMobileMenuOpen(true)}>
                            <Image
                                src={dutchyLogo}
                                width={1920}
                                height={1012}
                                alt="Hello dutchy menu button"
                                priority
                            />
                            <div className="bg-site-white flex justify-center overflow-clip">
                                <svg viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg" height={22} width={32} overflow={"clip"} className="-translate-y-1">
                                    <g>
                                        <g><path fillRule="evenodd" clipRule="evenodd" d="M2.25 12C2.25 10.4812 3.48122 9.25 5 9.25C6.51878 9.25 7.75 10.4812 7.75 12C7.75 13.5188 6.51878 14.75 5 14.75C3.48122 14.75 2.25 13.5188 2.25 12ZM5 10.75C4.30964 10.75 3.75 11.3096 3.75 12C3.75 12.6904 4.30964 13.25 5 13.25C5.69036 13.25 6.25 12.6904 6.25 12C6.25 11.3096 5.69036 10.75 5 10.75Z" fill="var(--primary)"></path></g>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.25 12C9.25 10.4812 10.4812 9.25 12 9.25C13.5188 9.25 14.75 10.4812 14.75 12C14.75 13.5188 13.5188 14.75 12 14.75C10.4812 14.75 9.25 13.5188 9.25 12ZM12 10.75C11.3096 10.75 10.75 11.3096 10.75 12C10.75 12.6904 11.3096 13.25 12 13.25C12.6904 13.25 13.25 12.6904 13.25 12C13.25 11.3096 12.6904 10.75 12 10.75Z" fill="var(--primary)"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M19 9.25C17.4812 9.25 16.25 10.4812 16.25 12C16.25 13.5188 17.4812 14.75 19 14.75C20.5188 14.75 21.75 13.5188 21.75 12C21.75 10.4812 20.5188 9.25 19 9.25ZM17.75 12C17.75 11.3096 18.3096 10.75 19 10.75C19.6904 10.75 20.25 11.3096 20.25 12C20.25 12.6904 19.6904 13.25 19 13.25C18.3096 13.25 17.75 12.6904 17.75 12Z" fill="var(--primary)"></path>
                                    </g>
                                </svg>
                            </div>
                        </button>
                    </div>
                )
            }
        </div>
        <div>
            <footer className="bg-primary-dark">
                <div className="h-10 w-full bg-primary-light"></div>
                <div className="bg-primary-dark pt-10 p-4 text-site-white md:flex flex-wrap gap-2 font-bold justify-around w-full max-w-1300 mx-auto">
                    <div className="px-8 pb-4 md:pb-0 min-w-260 max-w-360 w-full">
                        <h2 className="text-2xl font-bold mb-2 font-poppinsSemiBold">{languageData.footerCustomers}</h2>
                        <ul className="p-2 font-normal font-jost md:text-lg">
                            {/*
                                TODO: FUTURE FAQ OPTION
                            <li className="pb-2">
                                <Link href="/contact" className="text-slate-300 hover:text-site-white">{languageData.footerFAQ}</Link>
                            </li> */}
                            <li className="pb-2 ">
                                <Link href="/contact" className="text-slate-300 hover:text-site-white">{languageData.footerContactUs}</Link>
                            </li>
                            <li className="pb-2">
                                <Link href="/deliveries" className="text-slate-300 hover:text-site-white">{languageData.footerDeliveriesAndReturns}</Link>
                            </li>
                            <li className="pb-2">
                                <Link href="/contact" className="text-slate-300 hover:text-site-white">{languageData.footerSellingPoint}</Link>
                            </li>
                        </ul>
                    </div>
                    {/* 
                        TODO: FUTURE LOGIN OPTION
                    <div className="px-8 pb-4 md:pb-0 min-w-260 max-w-360 w-full">
                        <h2 className="text-2xl font-bold mb-2 font-poppinsSemiBold">{languageData.footerYourAccount}</h2>
                        <ul className="p-2 font-normal font-jost md:text-lg">
                            <li className="pb-2">
                                <Link href="/" className="text-slate-300 hover:text-site-white">{languageData.footerLogin}</Link>
                            </li>
                            <li className="pb-2">
                                <Link href="/" className="text-slate-300 hover:text-site-white">{languageData.footerRegister}</Link>
                            </li>
                            <li className="pb-2">
                                <Link href="/contact" className="text-slate-300 hover:text-site-white">{languageData.footerSellingPoint}</Link>
                            </li>
                        </ul>
                    </div> */}
                    <div className="px-8 pb-4 md:pb-0 min-w-260 max-w-360 w-full">
                        <h2 className="text-2xl font-bold mb-2 font-poppinsSemiBold">{languageData.footerBrowseProducts}</h2>
                        <ul className="p-2 font-normal font-jost md:text-lg ">
                            <li className="pb-2">
                                <Link href="/products?category=Pluche" className="text-slate-300 hover:text-site-white">{languageData.footerBrowsePluches}</Link>
                            </li>
                            <li className="pb-2 ">
                                <Link href="/products?category=T-shirt" className="text-slate-300 hover:text-site-white">{languageData.footerBrowseTShirts}</Link>
                            </li>
                            <li className="pb-2">
                                <Link href="/products?category=Hello Dutchy by Gerbrand" className="text-slate-300 hover:text-site-white">{languageData.footerBrowseByGerbrand}</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="px-8 pb-4 md:pb-0 min-w-260 max-w-360 w-full">
                        <h2 className="text-2xl font-bold mb-2 font-poppinsSemiBold">Hello Dutchy</h2>
                        <ul className="p-2 font-normal font-jost md:text-lg ">
                            <li className="pb-2 ">
                                <Link href="/about?location=studio" className="text-slate-300 hover:text-site-white">{languageData.footerTheStudio}</Link>
                            </li>
                            <li className="pb-2">
                                <Link href="/about" className="text-slate-300 hover:text-site-white">{languageData.footerAboutUs}</Link>
                            </li>
                            <li className="pb-2">
                                <Link href={instagramLink} target="_blank" className="text-slate-300 hover:text-site-white">
                                    <div className="h-12 w-12 -translate-x-2">
                                        <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g> 
                                                <path fillRule="evenodd" clipRule="evenodd" d="M15.5 5H9.5C7.29086 5 5.5 6.79086 5.5 9V15C5.5 17.2091 7.29086 19 9.5 19H15.5C17.7091 19 19.5 17.2091 19.5 15V9C19.5 6.79086 17.7091 5 15.5 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.5 15C10.8431 15 9.5 13.6569 9.5 12C9.5 10.3431 10.8431 9 12.5 9C14.1569 9 15.5 10.3431 15.5 12C15.5 12.7956 15.1839 13.5587 14.6213 14.1213C14.0587 14.6839 13.2956 15 12.5 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                                                <rect x="15.5" y="9" width="2" height="2" rx="1" transform="rotate(-90 15.5 9)" fill="currentColor"></rect> 
                                                <rect x="16" y="8.5" width="1" height="1" rx="0.5" transform="rotate(-90 16 8.5)" stroke="#currentColor" strokeLinecap="round"></rect> 
                                            </g>
                                        </svg>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* <div className="w-fit h-fit p-1 rounded bg-white md:flex hidden">
                        <Image
                            src={"/Logo-Hello-Dutchy-Design-white.svg"}
                            height={270}
                            width={225}
                            alt="Hello Dutchy logo at footer"
                        />
                    </div> */}
                    {/* <div className="flex items-end px-4 text-site-white justify-end flex-1 pt-3">
                        Hello Dutchy © {yearDate}
                    </div> */}
                </div>
                <div className="bg-primary-dark py-2 border-t border-slate-600">
                    <div className="flex md:flex-row flex-col justify-around items-center gap-2 max-w-1300 mx-auto">
                        {/* TODO: FUTURE POLICY PAGE LINKS */}
                        <Link href="/privacy-policy" className="text-slate-300 text-center block ">Privacy Policy</Link>
                        <Link href="/privacy-policy" className="text-slate-300 text-center block ">Terms of Service</Link>
                        <Link href="/privacy-policy#cookies" className="text-slate-300 text-center block ">Cookies</Link>
                        <Link href="/privacy-policy" className="text-slate-300 text-center block ">Copyright Info</Link>
                        <div className="flex flex-col items-center justify-center pt-2">
                            <Image
                                src={dutchyLogo}
                                height={50}
                                width={94}
                                alt="Hello Dutchy logo at footer"
                                />
                                <p className="text-site-white">Hello Dutchy © {yearDate}</p>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
        <Analytics />
    </div>
  )
}

export default Layout