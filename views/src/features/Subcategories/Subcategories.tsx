import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCategories, selectSubcategories, setSubcategories } from "../../redux-store/ProductsSlice"
import { useEffect, useState } from "react"
import { getSubcategories } from "../../api/categories"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { formatSubcategoryNameForUrl } from "../../utilities/utilities"
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
    const id = allCategories.find(item => item.name.toLowerCase() === categoryName)!.id;
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




  /*  useEffect(() => {
        const newPaths = [
            { name: 'Home', url: '/' },
            { name: categoryNameCapitalized, url: `/${categoryName}` },
        ];

        if (currentSubcategory && categoryName) {
            newPaths.push({
                name: currentSubcategory,
                url: `/${categoryName.toLowerCase()}/${formatSubcategoryName(currentSubcategory)}`,
            });
        }

        setPaths(newPaths);
    }, [currentSubcategory, categoryName, categoryNameCapitalized]);

    const handleSubcategoryClick = (subcategoryName: string) => {
        setCurrentSubcategory(subcategoryName);
    }*/



    return (
        <div className="flex flex-col items-center">
    
            <h2 className="text-center text-xl">{categoryNameCapitalized}:</h2>
            <div className="flex flex-wrap justify-center sm:w-full md:w-full lg:w-5/6">
                {categoryName && subcategories.map(subcategory => (
                    <div className="border border-black mx-8 w-32 sm:w-36 md:w-40 lg:w-48 mt-8">
                        <button>
                            <Link
                                to={`/${categoryName.toLowerCase()}/${formatSubcategoryNameForUrl(subcategory.name)}`}
                                state={{ subcategoryName: subcategory.name }}
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