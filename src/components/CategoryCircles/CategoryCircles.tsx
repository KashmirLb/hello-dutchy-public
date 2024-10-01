import CategoryCircle from '../CategoryCircle/CategoryCircle'
import useLanguage from '~/hooks/useLanguage'

const CategoryCircles = () => {

  const { languageData } = useLanguage()

  const categories = [
    {
      name: languageData.categoryFirstText ?? "Pluches",
      image: "/demo/1-square-transparentbg.png",
      url: "/products?category=Pluche"
    },
    {
      name: languageData.categorySecondText ?? "T-shirts",
      image: "/demo/femke-pink.svg",
      url: "/products?category=T-shirt"
    },
    {
      name: languageData.categoryThirdText ?? "Hello Dutchy by Gerbrand",
      image: "/demo/fishes.png",
      url: "/products?category=Hello Dutchy by Gerbrand"
    },
  ]

  return (
    <div className='w-full flex flex-col gap-10'>
        <h2 className='text-4xl text-primary-light mx-auto text-center w-fit'>{languageData.categoryCirclesHeaderText}</h2>
        <div className='w-full py-10 rounded-sm'>
          <div className='flex justify-around flex-wrap gap-10'>
            {
              categories.map(cat => (
                <CategoryCircle name={cat.name} url={cat.url} image={cat.image} key={cat.name + "-" + Math.random()*100}/>
              ))
            }
          </div>

        </div>
    </div>
  )
}

export default CategoryCircles