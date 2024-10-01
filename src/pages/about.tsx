import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import Layout from '~/components/Layout'
import OurStory from '~/components/OurStory/OurStory'
import TheStudio from '~/components/TheStudio/TheStudio'
import Map from '~/components/Map/Map'

const About = () => {

  const studioRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)
  const locationSelected = useSearchParams().get("location")?.toString()

  useEffect(() => {
    if(locationSelected == "studio" && studioRef.current) {
      const studioPlusOffset = studioRef.current.getBoundingClientRect().top + window.scrollY - 25;
      window.scrollTo({ top: studioPlusOffset, behavior: "smooth" })
    }
    if(locationSelected == "location" && locationRef.current) {
      const studioPlusOffset = locationRef.current.getBoundingClientRect().top + window.scrollY - 25;
      window.scrollTo({ top: studioPlusOffset, behavior: "smooth" })
    }
  }, [locationSelected])

  return (
    <Layout>
        <div className='p-10 pt-0 flex flex-col gap-10'>
          <div>
            <OurStory/>
          </div>
          <div ref={studioRef}>
            <TheStudio/>
          </div>
          <div ref={locationRef}>
            <Map/>
          </div>
        </div>
    </Layout>
  )
}

export default About