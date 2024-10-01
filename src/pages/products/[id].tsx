import { Loading } from "~/components/Loading"
import { api } from "~/utils/api"
import Layout from "~/components/Layout"
import ProductDetails from "~/components/ProductDetails/ProductDetails"
import { useRouter } from "next/router"
import Link from "next/link"

const ProductDetailsPage = () => {

  const router = useRouter()

  const { id } = router.query;

  const { data, isLoading } = api.product.getOneById.useQuery(typeof id === "string" ? Number.parseInt(id) : 0)

  if(isLoading){
    return (
    <Layout>
      <div className="text-lg text-center flex grow flex-col items-center justify-center w-full p-10 h-screen-minus-navbar">
        <Loading />
      </div>
    </Layout>)
  }

  if(!data){
    return (
      <Layout>
      <div className="text-lg text-center font-semibold flex grow flex-col gap-10 items-center justify-center w-full p-10 h-screen-minus-navbar">
        Product not found!
        <div>
          <Link className="text-primary font-normal hover:text-primary-dark hover:font-semibold transition-all" href="/products">
            Go back to products
          </Link>
        </div>
      </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 flex flex-col gap-5 mb-2">
        <ProductDetails product={data} images={data.images} sizesData={data.sizes.map(size => size.size).sort((a, b) => a.id - b.id)} colorsData={data.colors.map(color => color.color).sort((a, b) => a.name.localeCompare(b.name))} />
      </div>
    </Layout>
  )
}

export default ProductDetailsPage