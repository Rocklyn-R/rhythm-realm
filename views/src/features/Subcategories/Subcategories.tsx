import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCategories, selectSubcategories, setSubcategories } from "../../redux-store/CategoriesSlice"
import { useEffect } from "react"
import { getSubcategories } from "../../api/categories"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { formatSubcategoryName } from "../../utilities/utilities"



export const Subcategories: React.FC = () => {
    const { categoryName } = useParams<{ categoryName?: string }>()
    const allCategories = useSelector(selectCategories);
    const id = allCategories.find(item => item.name.toLowerCase() === categoryName)?.id;
    const dispatch = useDispatch();
    const subcategories = useSelector(selectSubcategories);


    useEffect(() => {
        const fetchSubcategories = async () => {
            if (allCategories.length === 0) {
                
            }
            if (id !== undefined) {
                const subcategoryData = await getSubcategories(id);
                if (subcategoryData) {
                    dispatch(setSubcategories(subcategoryData))
                }
            }
        }
        fetchSubcategories();
    }, [dispatch])

    if (!categoryName) {
        return <div>Not found</div>
    }

    const categoryNameCapitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)


    return (
        <div className="flex flex-col items-center">
            <div className="flex m-4 self-start">
                <Link className="underline" to="/">Home</Link>
                <p className="mx-3">/</p>
                <Link to={`/${categoryName}`}>{categoryNameCapitalized}</Link>
            </div>
            <h2 className="text-center text-xl">{categoryNameCapitalized}:</h2>
            <div className="flex flex-wrap justify-center sm:w-full md:w-full lg:w-5/6">
                {subcategories.map(subcategory => (
                     <div className="border border-black mx-8 w-32 sm:w-36 md:w-40 lg:w-48 mt-8">
                     <button>
                         <Link to={`/${categoryName.toLowerCase()}/${formatSubcategoryName(subcategory.name)}`}>
                             <img src={subcategory.image} />
                             {subcategory.name}
                         </Link>
                     </button>
                 </div>
                ))}
            </div>
        </div>
    )
}