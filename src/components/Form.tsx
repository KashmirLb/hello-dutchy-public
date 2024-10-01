import styles from '../styles/Form.module.css'
import { useForm, ValidationError } from '@formspree/react';
import Link from 'next/link';
import useLanguage from '~/hooks/useLanguage';


const Form = ({ firstNameRef }: { firstNameRef: React.RefObject<HTMLInputElement> }) => {
    
  const [state, handleSubmit] = useForm("xwkjyovd");
  const { languageData } = useLanguage()

  if (state.succeeded) {
      return (
          <div className={styles.messageSent}>
              <h2>Message has been sent</h2>
              <p>Thank you for your message!</p>
              <p>We will get back to you as soon as possible.</p>
              <Link href="/">
                  
                      <button>Back to Home Page</button>
                  
              </Link>
          </div>
      )
  }
  return (
    
        <form onSubmit={handleSubmit} className='bg-sky-100 md:w-1/3 w-full p-2 md:min-w-460 min-w-0'>
            <div className={`${styles.fieldContainer} text-primary font-bold mx-auto`}>
                <div>
                    <label htmlFor="full-name">{languageData.contactName}</label>
                </div>
                <input type="text" name="name" id="full-name" placeholder="First Last Name" required={true} className='p-1 font-semibold text-black' ref={firstNameRef}/>
                <ValidationError 
                    prefix="Fullname" 
                    field="full-name"
                    errors={state.errors}
                    className={styles.errorMessage}
                />
            </div>
            <div className={`${styles.fieldContainer} text-primary font-bold mx-auto`}>
                <div>
                    <label htmlFor="email">
                       {languageData.contactEmail}
                    </label>
                </div>
                <input
                    id="email"
                    type="email" 
                    name="email"
                    placeholder="example@example.com"
                    className='p-1 font-semibold text-black'
                    required={true}
                />
                <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                    className={styles.errorMessage}
                />
            </div>
            <div className={`${styles.textareaContainer} text-primary font-bold mx-auto`}>
                <div>
                    <label htmlFor="message">
                        {languageData.contactMessage}
                    </label>
                </div>
                <textarea
                    className='text-black p-2 font-normal text-base'
                    id="message"
                    name="message"
                    required={true}
                />
                <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                    className={styles.errorMessage}
                />
                <button type="submit" disabled={state.submitting}
                    className='bg-primary hover:bg-navbar-blue w-full text-site-white text-xl font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg py-4 mt-2' 
                >
                    {languageData.contactSendButton}
                </button>
            </div>
        </form>
  )
}

export default Form