import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary)',
        'primary-transparent': 'var(--primary-transparent)',
        'primary-dark': 'var(--primary-dark)',
        'primary-dark-2': 'var(--primary-dark-2)',
        'primary-light': 'var(--primary-light)',
        'primary-light-2': 'var(--primary-light-2)',
        'primary-gray': 'var(--primary-gray)',
        'secondary-gray' : 'var(--secondary-gray)',
        'site-white': 'var(--site-white)',
        'transparent-site-white': 'var(--trasnparent-site-white)',
        'secondary':'var(--secondary)',
        'secondary-2':'var(--secondary-2)',
        'site-red': 'var(--site-red)',
        'site-red-dark': 'var(--site-red-dark)',
        'navbar-blue': 'var(--navbar-blue)',
        'ground': 'var(--ground)'
      },

      fontFamily: { 
        lakki: ['var(--font-lakki)'],
        chalk: ['var(--chalk-font)'],
        dust: ['var(--dust-font)'],
        wanderlust: ['var(--wanderlust-font)'],
        quicksand: ['var(--quicksand-font)'],
        jost: ['var(--jost-font)'],
        robotoCondensed: ['var(--roboto-condensed-font)'],
        abel: ['var(--abel-font)'],
        poppinsRegular: ['var(--poppins-regular-font)'],
        poppinsSemiBold: ['var(--poppins-semi-bold-font)']
      },

      height: {
        'inherit': 'inherit',
        'almost-screen': 'calc(100vh - 55px)',
        'screen-minus-navbar': 'calc(100vh - 96px)',
        'almost-screen-minus-pad': 'calc(100vh - 150px)',
        'product-details-desktop-image': '70vh',
        'half-screen': '50vh',
        'almost-half-screen': 'calc(50vh - 65px)',
        '70': '70px'
      },
      width:{
        '360': '360px',
        'list-item': 'calc(100vw - 360px)',
        'open-icon': '25vw',
        'inherit': 'inherit'
      },
      minHeight:{
        'inherit': 'inherit',
        'half-screen': '50vh',
        'almost-screen': 'calc(100vh - 55px)',
        'almost-screen-minus-pad': 'calc(100vh - 150px)',
        'screen-minus-navbar': 'calc(100vh - 96px)',
      },
      maxHeight:{
        'inherit': 'inherit',
        'screen-minus-navbar': 'calc(100vh - 96px)'
      },
      maxWidth:{
        'inherit': 'inherit',
        'list-item': 'calc(100vw - 360px - 40px - 0.5rem)',
        '1300': '1300px',
        '1200': '1200px',
        '700': '700px',
        '500': '500px',
        '360': '300px',
      },
      minWidth:{
        'inherit': 'inherit',
        'list-item': 'calc(100vw - 360px - 40px - 3rem)',
        'half-screen': '50vw',
        '600': '600px',
        '460': '460px',
        '360': '360px',
        '305': '305px',
        '260': '260px',
        '210': '210px',
        '175': '175px',
      },
      gridTemplateColumns: {
        'order-view': 'minmax(110px, 1fr) 1fr minmax(110px, 1fr)'
      },
      keyframes: {
        swing: {
          '0%, 100%': { transform: 'translateX(-5px)'},
          '50%': { transform: 'translateX(5px)'}
        },
        swingLarge: {
          '0%, 100%': { transform: 'translateX(-5px)'},
          '50%': { transform: 'translateX(10px)'}
        },
        swingY: {
            '0%, 100%': { transform: 'translateY(-5px)'},
            '50%': { transform: 'translateY(5px)'}
        },
        pulseOp3: {
          '50%': { opacity: '.3'}
        }
      },
      animation: {
        swing: 'swing 10s ease-in-out infinite',
        swingLarge: 'swingLarge 10s ease-in-out infinite',
        swingY: 'swingY 10s ease-in-out infinite',
        pulseOp3: 'pulseOp3 15s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
  },
  plugins: [],
} satisfies Config;
