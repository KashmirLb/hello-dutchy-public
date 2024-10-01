import React from 'react'
import Image from 'next/image'
import styles from './OurStory.module.css'
import useLanguage from '~/hooks/useLanguage'

const DutchText = () => (
    <div className='flex flex-col gap-2 justify-center h-full'>

        <h2 className='font-semibold text-5xl py-4 text-primary font-abel'>Hello Dutchy: <span className='text-navbar-blue'>Ons verhaal</span></h2>
        <p className='whitespace-pre-line font-bold'>
            Achter de charme en creativiteit van <span className="text-primary">Hello Dutchy</span> staat de getalenteerde ontwerper, <span className="text-navbar-blue">Eline de Zoete</span>.
            <br/><br/>
            In 2009 werd er een idee geboren; Een frisse, jonge variatie op de traditionele, in klederdracht geklede oer-Hollandse souvenir maken.
            
            Een combinatie van Japanse cartoons en Nederlandse cultuur.<br/> Door omstandigheden verdwenen de eerste schetsen in een lade, tot ze in 2022 weer tevoorschijn kwamen. 
            <br/><br/>
            <span className='text-navbar-blue'>Eline</span> en <span className='text-navbar-blue'>Gerbrand</span> voelde dat de tijd rijp was om nu dit idee de ruimte te geven. En in 2023 is <span className='text-primary-light'>Hello Dutchy</span> een feit geworden.
            De ruwe schetsen van <span className='text-navbar-blue'>Eline</span> zijn na zoveel jaar eindelijk tot leven gekomen in de vorm van pluche poppen en gedigitaliseerde tekeningen. 
            <br/><br/>
            De keus om eerst te beginnen met poppen is niet zo vreemd.
            <span className='text-navbar-blue'> Eline</span> heeft altijd een grote voorliefde gehad voor het bedenken en vervaardigen van knuffels en (hand)poppen. Tot 2020 was zij actief als poppenspeler,  en ontwerper van Lila en Loet. Een poppentheater act in samenwerking met Nienke Dekker en Bart Spruit.
        </p>
    </div>
)

const EnglishText = () => (
    <div className='flex flex-col gap-2 justify-center h-full'>
        <h2 className='font-semibold text-5xl py-4 text-primary font-abel'>Hello Dutchy: <span className='text-navbar-blue'>Our story</span></h2>
        <p className='whitespace-pre-line font-bold'>
            Behind the charm and creativity of <span className="text-primary">Hello Dutchy</span> is the talented designer, <span className="text-navbar-blue">Eline de Zoete</span>.
            <br/><br/>
            In 2009 an idea was born; Creating a fresh, young variation on the traditional Dutch souvenir.<br/>
            A combination of Japanese cartoons and Dutch culture. Due to circumstances, the first sketches disappeared into a drawer until they reappeared in 2022.   <br/> <br/>


            <span className='text-navbar-blue'>Eline</span> and <span className='text-navbar-blue'>Gerbrand</span> felt that the time was right to make some space for the idea. And in 2023, <span className='text-primary-light'>Hello Dutchy</span> became a fact.
            After many years, <span className='text-navbar-blue'>Eline</span>{"'"}s rough sketches have finally come to life in the form of plush dolls and digital drawings. 
            <br/><br/>
            The choice to start with dolls first is not surprising. 
            <span className='text-navbar-blue'> Eline</span> has always had a great love for inventing and making cuddly toys and (hand) dolls. Until 2020 she was active as a puppeteer and designer of Lila and Loet. A puppet theater act in collaboration with Nienke Dekker and Bart Spruit.
            <br/><br/>
            <span className='text-primary-light'>Hello Dutchy</span> features two unique main characters: <span className='text-primary-light underline'>Femke</span> and <span className='text-primary-light underline'>Viktor</span>.
            </p>

    </div>
)

const OurStory = () => {

    const { language} = useLanguage()
  return (
    <div className="w-full md:py-10 py-2 flex justify-center rounded-md">
    <div className={`${styles.sectionContainer} `}>
        <div className={`${styles.textContainer} h-full w-full`}>
            <div className={`${styles.textWrapper} h-full`}>
                {language.toLowerCase() === 'nederlands' ? <DutchText /> : <EnglishText />}
            </div>
        </div>
        <div className={`${styles.imageContainer} w-full`}>
            <div className={`${styles.imageWrapper} relative w-full h-full`}>
                <Image  
                    src={"/dutchy-viktor-landscape-square.jpg"}
                    alt="Femke and viktor dolls sitting in their landscape"
                    fill
                    priority
                    style={{ objectFit: "cover", objectPosition: "center"}}
                    sizes="(width: 1652px) 951px,
                            (width: 1200px) 670px,
                            (width: 800px) 430px"
                />
            </div>
        </div>
    </div>

</div>
  )
}

export default OurStory