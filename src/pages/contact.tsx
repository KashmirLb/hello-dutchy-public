import Layout from "~/components/Layout"
import Image from "next/image"
import Form from "~/components/Form"
import { useRef } from "react"
import useLanguage from "~/hooks/useLanguage"

const Contact = () => {

  const { language, languageData } = useLanguage()
  const contactFormRef = useRef<HTMLDivElement>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)

  const scrollToContactForm = () => {
    contactFormRef.current?.scrollIntoView({ behavior: "smooth" })
    firstNameRef.current?.focus()
  }

  const EnglishSendMessage = () => (
    <div className="md:p-0 p-5 text-center md:text-left">
      <p className="text-lg font-bold text-primary pb-1"><span onClick={scrollToContactForm} className="cursor-pointer underline hover:text-navbar-blue transition-colors">Send us a message</span> if you wish to place an order</p>
      <p className="text-sm text-primary-light font-bold">
        We are working on having online orders available soon. In the meantime, you can contact us by <span className="text-navbar-blue">message</span>, <span className="text-navbar-blue">email</span> or <span className="text-navbar-blue">phone</span> if you wish to order items from our shop.
      </p>
    </div>
  )
  const DutchSendMessage = () => (
    <div className="md:p-0 p-5 text-center md:text-left">
      <p className="text-lg font-bold text-primary pb-1"><span onClick={scrollToContactForm} className="cursor-pointer underline hover:text-navbar-blue transition-colors">Stuur ons een bericht</span> als u een bestelling wilt plaatsen</p>
      <p className="text-sm text-primary-light font-bold">
        We werken eraan om online bestellingen binnenkort beschikbaar te hebben. In de tussentijd kunt u contact met ons opnemen via <span className="text-navbar-blue">bericht</span>, <span className="text-navbar-blue">email</span> of <span className="text-navbar-blue">telefoon</span> als u artikelen uit onze winkel wilt bestellen.
      </p>
    </div>
  )
  
  return (
    <Layout>
      {/* <div className="md:p-10 p-2 flex justify-center bg-sky-200">
        <div className="flex md:gap-10 gap-1 items-center md:flex-row flex-col">
          <div className="text-center md:h-20 md:w-20 h-12 w-12">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <g>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"></circle>
                 <path d="M12 17V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path> 
                 <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="currentColor"></circle>
              </g>
            </svg>
          </div>
          {language.toLowerCase() === "english" ? EnglishSendMessage() : DutchSendMessage()}
        </div>
      </div> */}
      <div id="contact-form" ref={contactFormRef}>
        <div className="md:p-5 p-0 flex justify-center md:gap-10 gap-2 md:flex-row flex-col">
          <Form firstNameRef={firstNameRef} />
          <div className="p-5 md:py-4 py-10 bg-primary md:w-1/4 w-full min-w-305 md:mb-0 mb-2">
            <div className="flex gap-4 text-site-white font-bold items-center text-lg pb-4">
              <div className="border-2 border-site-white p-2 rounded-2xl w-fit">
                <Image src='/phone-white.png' height={30} width={30} alt="phone icon"/>
              </div>
              <div>(+31) 625 17 09 91</div>
            </div>
            <div className="flex gap-4 text-site-white font-bold items-center text-lg pb-4">
              <div className="border-2 border-site-white p-2 rounded-2xl w-fit">
                <Image src='/mail-white.png' height={30} width={30} alt="email icon"/>
              </div>
              <div>info@hellodutchy.com</div>
            </div>
          <p className="text-slate-200 py-2">
            * {languageData.contactPaymentInfo1}
          </p>
          <p className="text-slate-200 py-2">
            * {languageData.contactPaymentInfo2}
          </p>
          {/* <p className="text-slate-200 py-2">
            * {languageData.contactPaymentInfo3}
          </p> */}

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Contact