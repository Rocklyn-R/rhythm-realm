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
        dispatch(setSubcategories([]));
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
            <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:w-full md:w-full lg:w-5/6 gap-4 px-8">
                {categoryName && subcategories.map(subcategory => (
                    <div className="w-40 sm:w-40 md:w-46 lg:w-48 mt-8 mx-auto">
                        <button className="border border-gray-300 rounded-md">
                            <Link
                                to={`/${categoryName}/${(subcategory.name)}`}
                            >
                                <img src={subcategory.image} className="block w-full border border-white rounded-t-md" />
                                {subcategory.name}
                            </Link>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}