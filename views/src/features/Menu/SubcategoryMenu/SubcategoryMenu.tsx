import { Category, Subcategory } from "../../../types/types";
import { useEffect, useState } from "react";
import { getSubcategories } from "../../../api/categories";
import { Link } from "react-router-dom";

interface SubcategoryMenuProps {
    category: Category | null;
    toggleMenu: () => void;
}

export const SubcategoryMenu: React.FC<SubcategoryMenuProps> = ({ toggleMenu, category }) => {
    const [subcategories, setSubcategories] = useState<Subcategory[] | null>();

    useEffect(() => {
        const subcategoriesSearch = async () => {
            if (category) {
                const subcategoryResults = await getSubcategories(category?.id);
                if (subcategoryResults) {
                    setSubcategories(subcategoryResults);
                }
            } else return;
        }

        subcategoriesSearch();

    }, [category])

    return (
        <div className="">
            <div className="w-full flex flex-col">
                <h2 className="font-semibold px-2 py-2">Subcategories</h2>
                {subcategories?.map((subcategory, index) => (

                    <Link
                    onClick={toggleMenu}
                    className="flex p-4 items-center justify-between hover:bg-gray-200"
                    key={index} to={`/${subcategory.category_name}/${subcategory.name}`}>{subcategory.name}</Link>

                ))}
            </div>
        </div>
    )
}