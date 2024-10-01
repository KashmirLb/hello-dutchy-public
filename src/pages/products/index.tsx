import { Loading } from "~/components/Loading"
import Layout from "~/components/Layout"
import useLanguage from "~/hooks/useLanguage"
import CategoryRow from "~/components/CategoryRow/CategoryRow"
import { useState, useEffect } from "react"
import type { ProductWithCategoryAndImages } from "~/types"
import ProductsGrid from "~/components/ProductsGrid/ProductsGrid"
import useData from "~/hooks/useData"
import { useSearchParams } from "next/navigation"

type ProductsByCategory = ProductWithCategoryAndImages[][]
type FilterBarProps = {
  filter: "categories" | "all",
  onChangeFilter: (filter: "categories" | "all") => void,
  category: string,
  onChangeCategory: (category: string) => void,
  categoryNames: string[],
  categoryNamesNl: string[],
  sort: "popular" | "price-low" | "price-high",
  setSort: (sort: "popular" | "price-low" | "price-high") => void
}

const ProductsByCategory = ({ products, sort }: { products: ProductWithCategoryAndImages[][], sort: "popular" | "price-low" | "price-high" }) => {
  return (
    products.map((categoryProducts, index) => {
      if(categoryProducts.length > 0){
        return (
          <CategoryRow key={categoryProducts[0]?.enName + " - " + index} products={categoryProducts} sort={sort} title={true} />
        )
      }
    })
  )
}

const FilterBar = ({ filter, onChangeFilter, category, onChangeCategory, categoryNames, categoryNamesNl, sort, setSort }: FilterBarProps) => {

  const { language, languageData } = useLanguage()
  const { filterBarViewAll, filterBarViewCategories, filterBarSortBy, filterBarPriceHigh, filterBarPriceLow, filterBarMostPopular, filterBarCategory, filterBarCategoryAll } = languageData

  return (
    <div className="bg-sky-200 w-full md:px-10 px-2 py-4 flex items-center md:gap-10 gap-2 flex-wrap">
      <div className="flex md:flex-row flex-col items-center justify-center md:gap-4 gap-2 md:w-fit w-full">
        <span className="font-semibold">View: </span>
        <select className="w-44 h-8 font-semibold rounded-md" value={filter} onChange={(e) => onChangeFilter(e.target.value as "categories" | "all")}>
          <option value="categories">{filterBarViewCategories}</option>
          <option value="all">{filterBarViewAll}</option>
        </select>
      </div>      
      <div className="flex md:flex-row flex-col items-center justify-center md:gap-4 gap-2 md:w-fit w-full">
        <span className="font-semibold">{filterBarSortBy}</span>
        <select className="w-44 h-8 font-semibold rounded-md" value={sort} onChange={(e) => setSort(e.target.value as "popular" | "price-low" | "price-high")}>
          <option value="popular">{filterBarMostPopular}</option>
          <option value="price-low">{filterBarPriceLow}</option>
          <option value="price-high">{filterBarPriceHigh}</option>
        </select>
      </div>
      <div className="flex md:flex-row flex-col items-center justify-center md:gap-4 gap-2 md:w-fit w-full">
        <span className="font-semibold">{filterBarCategory}</span>
        <select className="w-44 h-8 font-semibold rounded-md" value={category} onChange={(e) => onChangeCategory(e.target.value)}>
          <option value="All">{filterBarCategoryAll}</option>
          {categoryNames.map((categoryName, i) => {
            return <option key={categoryName} value={categoryName}>{language == "English" ? categoryName : categoryNamesNl[i] ?? ""}</option>
          })}
        </select>
      </div>
    </div>
  )
}

const Products = () => {

  const [ filter, setFilter ] = useState<"categories" | "all">("categories")
  const [ sort, setSort ] = useState<"popular" | "price-low" | "price-high">("popular")
  const [ category, setCategory ] = useState<string>("All")
  const [ categoryNames, setCategoryNames ] = useState<string[]>([])
  const [ categoryNamesNl, setCategoryNamesNl ] = useState<string[]>([])
  const { allProducts, productsLoading } = useData()
  const initialCategory = useSearchParams().get("category")?.toString().toLowerCase()

  useEffect(() =>{
    if(allProducts){
      let categoryNames: string[] = []
      let categoryNamesNl: string[] = []
  
      allProducts.map((product) => {
        if(!categoryNames.includes(product.category.name)){
          categoryNames = [...categoryNames, product.category.name]
        }
      })
      allProducts.map((product) => {
        if(!categoryNamesNl.includes(product.category.nameNl)){
          categoryNamesNl = [...categoryNamesNl, product.category.nameNl]
        }
      })
      setCategoryNames(categoryNames)
      setCategoryNamesNl(categoryNamesNl)
      
      if(initialCategory){
        const initCat = categoryNames.find((categoryName) => categoryName.toLowerCase() === initialCategory)
        if(initCat){
          setCategory(initCat)
          setFilter("all")
        }
      }
    }
  }, [allProducts, initialCategory])

  const onChangeFilter = (e: string) => {
    setFilter(e as "categories" | "all")

    if(e == "categories"){ 
      setCategory("All")
    }
  }

  const onChangeCategory = (e: string) => {
    setCategory(e)
    if(e!= "All"){
      setFilter("all")
    }
  }

  if(productsLoading){
    return (
      <Layout>
        <FilterBar filter={filter} onChangeFilter={onChangeFilter} category={category} onChangeCategory={onChangeCategory} categoryNames={categoryNames} categoryNamesNl={categoryNamesNl} sort={sort} setSort={setSort} />
        <div className="text-lg text-center w-full p-10 min-h-screen">
          <Loading />
        </div>
      </Layout>
    )
  }
  if(!allProducts){
    return (
      <Layout>
        <FilterBar filter={filter} onChangeFilter={onChangeFilter} category={category} onChangeCategory={onChangeCategory} categoryNames={categoryNames} categoryNamesNl={categoryNamesNl} sort={sort} setSort={setSort} />
        <div className="text-lg text-center w-full p-10">
          No products found
        </div>
      </Layout>
    )
  }

  function productsOrderedByCategory(): ProductsByCategory {

    if(!allProducts){
      return []
    }
    return categoryNames.map((categoryName) => allProducts.filter((product) => product.category.name === categoryName)).sort((a, b) => (a[0]?.category.categoryOrder ?? 0) - (b[0]?.category.categoryOrder ?? 0))
  }

  function filterProductsByCategory(products: ProductWithCategoryAndImages[], category: string): ProductWithCategoryAndImages[] {
    if(category == "All"){
      return products
    }
    return products.filter((product) => product.category.name === category)
  }

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <FilterBar filter={filter} onChangeFilter={onChangeFilter} category={category} onChangeCategory={onChangeCategory} categoryNames={categoryNames} categoryNamesNl={categoryNamesNl} sort={sort} setSort={setSort} />
        <div className="md:px-20 py-10 px-4 max-w-1300 min-w-1/2 w-full">
          { filter == "categories" && (
            <div className="flex flex-col gap-12">
             <ProductsByCategory products={productsOrderedByCategory()} sort={sort} />
            </div>
          )}
          { filter == "all" && (
            <div className="flex justify-center items-center w-full">
              <ProductsGrid products={filterProductsByCategory(allProducts, category)} sort={sort} />
            </div>
          )}
        </div>
      </div>
      
    </Layout>
  )
}

export default Products