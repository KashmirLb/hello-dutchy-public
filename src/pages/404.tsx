import React from 'react'
import Layout from '~/components/Layout'
import Image from 'next/image'
import useLanguage from '~/hooks/useLanguage'
import { useRouter } from 'next/router'

const Custom404 = () => {

    const { languageData } = useLanguage()
    const router = useRouter()

  return (
    <Layout>
        <div className='flex flex-col items-center justify-center h-screen p-4'>
            <h1 className='text-4xl font-bold text-primary-light text-center'>{languageData.notFoundTitle}</h1>
            <div>
              <div className="flex flex-col items-center justify-center w-full">
                <Image
                    src="/image1.gif"
                    height={300}
                    width={360}
                    alt="dutchy pixel art"
                />
                <div className="text-center text-lg font-bold mb-4">
                  {languageData.notFoundInfo}
                </div>
                <button onClick={()=>router.push("/")}
                    className='bg-primary hover:bg-navbar-blue p-3 text-site-white text-xl tracking-wider uppercase font-semibold transition-all rounded-md'
                >{languageData.notFoundButton}</button>
              </div>
            </div>
        </div>
    </Layout>
  )
}

export default Custom404