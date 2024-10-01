import React from 'react'
import Layout from '~/components/Layout'

const TermsAndPolicies = () => {
  return (
    <Layout>
        <div className='flex justify-center py-10'>        
            <div className='flex flex-col gap-10 max-w-700 text-lg'>
                <div>
                    <h1 className='text-2xl text-primary-light font-bold'>Hello Dutchy - Terms and Policies</h1>
                    <p className='mb-2'>Welcome to Hello Dutchy! We are committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner. This page outlines the terms and policies regarding the collection, use, and protection of your personal data when using our webshop.</p>
                    <p className='mt-4'>You can find us at  Westerstraat 61, 1601 AC Enkhuizen, The Netherlands</p>
                    <p>info@hellodutchy.com</p>
                    <p>(+31) 625 17 09 91</p>


                </div>
                <div>
                    <h2 className='text-xl text-primary-light font-bold'>1. Personal Data We Collect</h2>
                    <p className='mb-2'>When you place an order with Hello Dutchy, we collect and process the following personal data:</p>
                    <ul className='mb-2 list-disc pl-8'>
                    <li>Name and Surname</li>
                    <li>Email Address</li>
                    <li>Phone Number</li>
                    <li>Shipping Address</li>
                    <li>Order Details</li>
                    </ul>
                    <p>This data is collected exclusively for the purpose of processing and fulfilling your order. To ensure your purchases reach you safely, 
                        we share only the necessary information—such as your name and shipping address—with our trusted shipping providers and payment service. We do not share your personal data with any other third parties unless required by law or explicitly agreed upon by you.
                        </p>
                </div>
                <div>
                    <h2 className='text-xl text-primary-light font-bold'>2. Legal Basis for Processing</h2>
                    <p>We process your personal data based on the following legal grounds:</p>
                    <ul>
                    <li>Contractual Necessity: We need to collect and process your personal data to fulfill the contract (your order) with you.</li>
                    <li>Legitimate Interests: We may process your data for our legitimate business interests, such as improving our services, provided these interests do not override your privacy rights.</li>
                    </ul>
                </div>
                <div>
                    <h2 className='text-xl text-primary-light font-bold'>3. Data Retention</h2>
                    <p>Your personal data will be stored securely for as long as it is necessary to fulfill the purposes for which it was collected:</p>
                    <ul>
                    <li>Order Data: Stored for 7 years, in compliance with tax and legal obligations.</li>
                    <li>Session Data: The session cookie (sessionId) is stored for 1 day after your last activity on the website.</li>
                    <li>After this period, your data will be securely deleted or anonymized.</li>
                    </ul>
                </div>
                <div>
                    <h2 className='text-xl text-primary-light font-bold' id='cookies'>4. Cookies</h2>
                    <p>Our website uses a single cookie called sessionId to track the session of your shopping cart. This cookie:</p>
                    <ul>
                    <li>Purpose: Helps us remember the items in your cart as you browse the site.</li>
                    <li>Duration: Is stored for 1 day after your last activity on the site.</li>
                    <li>No Tracking: This cookie is strictly necessary and does not track your browsing activity beyond maintaining your cart session.</li>
                    </ul>
                </div>
                <div>
                    <h2 className='text-xl text-primary-light font-bold'>5. Mandatory Cookies and Your Consent</h2>
                    <p>The sessionId cookie is essential for the operation of our webshop, as it enables the shopping cart functionality. By continuing to use our website, you consent to the use of this mandatory cookie. If you do not accept this cookie, we ask that you leave the Hello Dutchy domain immediately, as the site cannot function properly without it.</p>
                </div> 
                <div>
                    <h2 className='text-xl text-primary-light font-bold'>6. Your Rights Under GDPR</h2>

                    <p>As a user of Hello Dutchy, you have the following rights regarding your personal data:</p>
                    <ul>
                    <li>Right to Access: You can request a copy of the personal data we hold about you.</li>
                    <li>Right to Rectification: If your data is inaccurate or incomplete, you have the right to request correction.</li>
                    <li>Right to Erasure: You can request the deletion of your personal data when it is no longer necessary for the purposes for which it was collected.</li>
                    <li>Right to Restrict Processing: You can request to limit how we process your data in certain circumstances.</li>
                    <li>Right to Data Portability: You can request to receive your data in a structured, commonly used format, and have it transferred to another data controller.</li>
                    <li>Right to Object: You can object to the processing of your personal data based on our legitimate interests.</li>
                    </ul>
                </div>
                <div>
                    <h2 className='text-xl text-primary-light font-bold'>7. Data Security</h2>
                    <p>We take the security of your personal data seriously and have implemented appropriate technical and organizational measures to protect it against unauthorized access, loss, or misuse.</p>
                </div>
                <div>   
                    <h2 className='text-xl text-primary-light font-bold'>8. Third-Party Processors</h2>
                    <p>We may share your data with third-party service providers who assist us in fulfilling your order (e.g., shipping companies, payment processors). All third-party processors are GDPR compliant and have data processing agreements in place to ensure your data is handled securely.</p>
                </div>
                <div>
                    <h2 className='text-xl text-primary-light font-bold'>9. International Data Transfers</h2>
                    <p>If your data is transferred outside the European Economic Area (EEA), we ensure it is protected by appropriate safeguards, such as Standard Contractual Clauses (SCCs) or binding corporate rules.</p>
                </div>
                <div>
                    <h2 className='text-xl text-primary-light font-bold'>10. Contact Information</h2>
                    <p>If you have any questions, requests, or complaints regarding your personal data or this privacy policy, please contact us at:</p>
                    <p>Email: info@hellodutchy.com</p>
                    <p>We will respond to your request as soon as possible, and in any case within one month of receiving it.</p>
                </div>
                <div>
                    <h2 className='text-xl text-primary-light font-bold'>11. Changes to This Policy</h2>
                    <p>We may update this Terms and Policies page from time to time to reflect changes in our practices or legal obligations. The latest version will always be available on our website, and we encourage you to review it regularly.</p>
                </div>
                <div>
                    <h2 className='text-xl text-primary-light font-bold'>12. Governing Law</h2>
                    <p>These terms are governed by and construed in accordance with the laws of the Netherlands. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in the Netherlands.</p>
                    <p>Thank you for choosing Hello Dutchy. We value your privacy and are committed to protecting your personal data.</p>   
                </div>
                <div>
                <h2 className='text-xl text-primary-light font-bold'>13. Copyright and License</h2>
                    <p>All content on this website, including but not limited to text, images, logos, and graphics, is the property of Hello Dutchy
                         and is protected by copyright and other intellectual property laws. Unauthorized use, reproduction, or distribution of any content
                          from this site without the prior written consent of Hello Dutchy is strictly prohibited.
                    </p>
                    <p>
                        Hello Dutchy reserves the right to decide whether and how its content may be used on other platforms or for other purposes. If you wish to request permission to use any of our content, please contact us at info@hellodutchy.com.
                    </p>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default TermsAndPolicies