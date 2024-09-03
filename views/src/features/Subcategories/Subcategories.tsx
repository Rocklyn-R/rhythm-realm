import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCategories, selectSubcategories, setSubcategories } from "../../redux-store/ProductsSlice"
import { useEffect, useState } from "react"
import { getSubcategories } from "../../api/categories"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setLoadingProducts } from "../../redux-store/ProductsSlice"


export interface BreadcrumbPaths {
  name: string;
  url: string;
}


export const Subcategories: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>()
  const allCategories = useSelector(selectCategories);
  const [id, setId] = useState(allCategories.find(item => item.name === categoryName)!.id);
  const dispatch = useDispatch();
  const subcategories = useSelector(selectSubcategories);

  const categoryNameCapitalized = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : '';

  useEffect(() => {
    if (allCategories) {
      setId(allCategories.find(item => item.name === categoryName)!.id)
    }
  }, [allCategories, categoryName, id])

  useEffect(() => {
    dispatch(setSubcategories([]));
    const fetchSubcategories = async () => {
      const subcategoryData = await getSubcategories(id);
      if (subcategoryData) {
        dispatch(setSubcategories(subcategoryData));
      }
    }
    if (allCategories && id) {
      fetchSubcategories();
    }

  }, [dispatch, categoryName, allCategories, id]);


  return (
    <div className="flex flex-col items-center mb-14">
      <h2 className="text-center text-2xl font-bold mb-6">{categoryNameCapitalized}:</h2>
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8 px-8 w-fit max-w-7xl">
        {categoryName && subcategories.map((subcategory, index) => (
          <Link
          onClick={() => dispatch(setLoadingProducts(true))}
            to={`/${categoryName}/${subcategory.name}`}
            key={index}
            className="relative group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out w-60"
          >
            <img
              src={subcategory.image}
              alt={subcategory.name}
              className="w-60 h-60 transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
              <p className="text-white text-lg font-bold text-center">{subcategory.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}