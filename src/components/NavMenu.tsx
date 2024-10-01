import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useLanguage from '~/hooks/useLanguage'

const NavMenu = () => {

    const { languageData } = useLanguage()

    return(
        <nav className="bg-navbar-blue h-12 md:flex justify-around items-center font-lakki text-xl z-10 fixed w-full hidden">
            <Link
                className="text-site-white pt-4 z-20"
                href={"/"}
            >{languageData.navHome ?? "Home"}</Link>
            <Link
                className="text-site-white pt-4 z-20"
                href={"/products"}
            >{languageData.navProducts ?? "Products"}</Link>
            <Image
                src={"/head.png"}
                height={42}
                width={56}
                alt='dutchy-head'
            />
            <Link
                className="text-site-white pt-4 z-20"
                href={"/contact"}
            >{languageData.navContact ?? "Contact"}</Link>
        </nav>
        
    )
}

export default NavMenu