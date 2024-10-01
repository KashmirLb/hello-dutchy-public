import React from 'react'

const Map = () => {
  return (
    <div className="w-full md:py-10 py-2 flex  flex-col justify-center rounded-md">
        <h2 className='font-semibold text-5xl py-4 text-primary-light font-abel'>Shop Location <span className="text-navbar-blue">in Enkhuizen</span></h2>

        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2417.560055560941!2d5.288481976692324!3d52.704035872109934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c8a3491df3ec21%3A0x2c63ef378f5e610b!2sAtelier%20Gerbrand!5e0!3m2!1ses!2ses!4v1720364936228!5m2!1ses!2ses" width="100%" height="500px" allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> 
    </div>
  )
}

export default Map