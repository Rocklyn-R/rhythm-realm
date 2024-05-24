import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCategories, selectSubcategories, setSubcategories } from "../../redux-store/ProductsSlice"
import { useEffect, useState } from "react"
import { getSubcategories } from "../../api/categories"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumb"
import { getCategories } from "../../api/categories";
import { setCategories } from "../../redux-store/ProductsSlice";


export interface BreadcrumbPaths {
    name: string;
    url: string;
}


export const Subcategories: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>()
    const allCategories = useSelector(selectCategories);
    const id = allCategories.find(item => item.name === categoryName)!.id;
    const dispatch = useDispatch();
    const subcategories = useSelector(selectSubcategories);

    const categoryNameCapitalized = categoryName
        ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
        : '';

    useEffect(() => {
        const fetchSubcategories = async () => {
                const subcategoryData = await getSubcategories(id);
                if (subcategoryData) {
                    dispatch(setSubcategories(subcategoryData));
                }
        }
        fetchSubcategories();
    }, [dispatch, categoryName]);


    return (
        <div className="flex flex-col items-center">
    
            <h2 className="text-center text-xl">{categoryNameCapitalized}:</h2>
            <div className="flex flex-wrap justify-center">
                {categoryName && subcategories.map(subcategory => (
                    <div className="border border-black w-32 sm:w-36 md:w-40 lg:w-48 mx-6 my-4 flex">
                        <button>
                            <Link
                                to={`/${categoryName}/${(subcategory.name)}`}
                            >
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