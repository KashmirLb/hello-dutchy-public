import { useRouter } from "next/router";
import HeaderIntroImage from "~/components/HeaderIntroImage/HeaderIntroImage";
import Layout from "~/components/Layout";
import useLanguage from "~/hooks/useLanguage";
import type { auxImage } from "~/types";
import { api } from "~/utils/api";
import ThreeProductColumns from "~/components/ThreeProductColumns/ThreeProductColumns";
import CardFlip from "~/components/CardFlip/CardFlip";
import CategoryCircles from "~/components/CategoryCircles/CategoryCircles";
import TextLeftImageRight from "~/components/TextLeftImageRight/TextLeftImageRight";

const storiesImage: auxImage = {
  alt: "Hello Dutchy doll",
  url: "/dutchy-transparent.svg",
  height: 1024,
  width: 1024
}

const rowImages = [
  {
    name: "femke with dark background",
    url: "/femke-black-bg.jpg",
    height: 1024,
    width: 684
  },

  {
    name: "viktor with dark background",
    url: "/viktor-black-bg.jpg",
    height: 1024,
    width: 684
  },
]
export default function Home() {

  return (
    <>
      <Layout>
        <div className="">
          { /********************************** INTRO ARTICLE ****************************************/ }
          <section className="pb-10 min-h-fit">
              <HeaderIntroImage />
          </section>
          <section className="pb-10 md:px-10 px-2">
              <ThreeProductColumns />
          </section>
          <section className="pb-10 md:px-10 px-2">
            <div className="w-full md:p-10 p-1 flex justify-around items-center min-h-fit gap-2 flex-wrap">
              <CardFlip />
              <CardFlip />
              <CardFlip />
              <CardFlip />
              <CardFlip />
              <CardFlip />
            </div>
          </section>
           <section className="pb-10 md:px-10 px-2">
            <CategoryCircles />
          </section>
          <section className="pb-10 md:px-10 px-2">
            <TextLeftImageRight />
          </section>        
        </div>
      </Layout>
    </>
  )
}
