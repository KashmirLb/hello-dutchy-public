import useLanguage from "~/hooks/useLanguage"
import styles from './TheStudio.module.css'
import Image from 'next/image'
import Link from "next/link"

const DutchText = () => (
    <div className='flex flex-col gap-2 justify-center h-full'>
        <h2 className='font-semibold text-5xl py-4 text-primary-light font-abel'>Onze Studio: <span className="text-navbar-blue">Atelier Gerbrand</span></h2>
        <p className='text whitespace-pre-line font-bold'>
        Bezoek onze lokale studio,<span className="text-navbar-blue"> Atelier Gerbrand</span>, om de producten van <span className="text-primary-light">Hello Dutchy</span> uit de eerste hand te ervaren.
        <br/><br/>

        Gelegen in het hart van Enkhuizen, de studio is een plek waar <span className="text-navbar-blue">Eline</span> en <span className="text-navbar-blue">Gerbrand</span> hun passie voor kunst en design al enkele jaren delen met de rest van de wereld, en is inmiddels de geboorteplaats geworden van <span className="text-primary-light">Hello Dutchy</span>.
        <br/><br/>
        Wij nodigen iedereen uit om <span className="text-navbar-blue">Atelier Gerbrand</span> te bezoeken en het hart en de ziel van <span className="text-primary-light">Hello Dutchy</span> te ontdekken. Kom en bekijk ons volledige aanbod aan producten, ontmoet de creatieve geest achter het merk, <span className="text-navbar-blue">Eline de Zoete</span>, en neem een stukje van de betovering mee naar huis.
        <br/><br/>
        Meer over Atelier Gerbrand: <Link className="text-primary-light" href="https://www.ateliergerbrand.nl/" target="_blank" rel="noreferrer">https://www.ateliergerbrand.nl/</Link>
        </p>
    </div>
)

const EnglishText = () => (
    <div className='flex flex-col gap-2 justify-center h-full'>
        <h2 className='font-semibold text-5xl py-4 text-primary font-abel'>Our Studio: <span className="text-navbar-blue">Atelier Gerbrand</span></h2>
        <p className=' whitespace-pre-line font-bold'>

        To experience <span className="text-primary-light"> Hello Dutchy</span> products firsthand, visit our local studio, <span className="text-navbar-blue">Atelier Gerbrand</span>.  
        <br/>     
        <br/>
        Located in the heart of <span className="text-primary-light">Enkhuizen</span>, the studio is a place where <span className="text-navbar-blue">Eline</span> and <span className="text-navbar-blue">Gerbrand</span> have shared their passion for art and design with the rest of world for several years, and has now 
        become the birthplace of the <span className="text-primary-light">Hello Dutchy</span> brand.
        <br/><br/>
        We invite you to visit <span className="text-navbar-blue">Atelier Gerbrand</span> and discover the heart and soul of <span className="text-primary-light">Hello Dutchy</span>. 
        Come and explore our full range of products, meet the creative mind behind the brand, <span className="text-navbar-blue">Eline de Zoete</span>, and take a piece of the enchantment home with you.
        <br/><br/>
        For more about Atelier Gerbrand: <Link className="text-primary-light underline" href="https://www.ateliergerbrand.nl/" target="_blank" rel="noreferrer">https://www.ateliergerbrand.nl/</Link>
        </p>
    </div>
)

const TheStudio = () => {

    const { language} = useLanguage()
  return (
    <div className="w-full md:py-10 py-2 flex justify-center rounded-md">
    <div className={`${styles.sectionContainer} `}>
        <div className={`${styles.imageContainer} w-full`}>
            <div className={`${styles.imageWrapper} relative w-full h-full`}>
                <Image  
                    src={"/demo/store.jpg"}
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
        <div className={`${styles.textContainer} h-full w-full`}>
            <div className={`${styles.textWrapper} h-full`}>
                {language.toLowerCase() === 'nederlands' ? <DutchText /> : <EnglishText />}
            </div>
        </div>
    </div>

</div>
  )
}

export default TheStudio