import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { selectSubcategoryByBrandResults, selectSubcategoryResults, setSubcategoryByBrandResults, setSubcategoryResults } from "../../../redux-store/SearchSlice"
import { Subcategory, SubcategoryByBrand } from "../../../types/types";

interface SearchResultsProps {
    handleBlur: () => void;
    setSearchInput: (arg0: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({setSearchInput, handleBlur}) => {
    const subcategoryResults = useSelector(selectSubcategoryResults);
    const navigate = useNavigate();
    const byBrandResults = useSelector(selectSubcategoryByBrandResults);
    const dispatch = useDispatch();

    const handleSelectSubcategory = (subcategory: Subcategory) => {
        navigate(`/${subcategory.category_name}/${subcategory.name}`);
        dispatch(setSubcategoryResults([]));
        setSearchInput("");
        handleBlur();
    }

    const handleSelectSubcategoryByBrand = (subcategory: SubcategoryByBrand) => {
        navigate(`/${subcategory.category_name}/${subcategory.name}?brand=${encodeURIComponent(subcategory.manufacturer)}`);
        dispatch(setSubcategoryByBrandResults([]));
        setSearchInput("");
        handleBlur();
    }

    return (
        <div className="flex flex-col items-center w-full space-y-4 p-2">
            {subcategoryResults.length > 0 && <h1 className="font-semibold text-lg">Categories:</h1>}
            {subcategoryResults.map((subcategory, index) => (
                <button key={index} onClick={() => handleSelectSubcategory(subcategory)} className="flex w-1/2 hover:shadow-lg items-center border bg-white border-gray-300 rounded-md p-4" >
                    <img src={subcategory.image} width={50} />
                    <p className="mx-2 w-3/4">{subcategory.name}</p>
                </button>
            ))}
            <div className="w-full space-y-4">
                 {byBrandResults.length > 0 && <h1 className="font-semibold">Categories:</h1>}
            {byBrandResults.map((subcategory, index) => (
                <button onClick={() => handleSelectSubcategoryByBrand(subcategory)} key={index} className="w-1/2 flex items-center hover:underline">
                    <p className="text-start">{subcategory.manufacturer} {subcategory.name}</p>
                </button>
            ))}
            </div>
           
        </div>
    )
}