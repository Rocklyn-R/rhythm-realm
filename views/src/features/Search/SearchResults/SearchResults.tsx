import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { getSelectedProduct } from "../../../api/products";
import { setSelectedProduct } from "../../../redux-store/ProductsSlice";
import { selectProductResults, 
    selectSubcategoryByBrandResults, 
    selectSubcategoryResults, 
    setProductsResults, 
    setSubcategoryByBrandResults, 
    setSubcategoryResults,
} from "../../../redux-store/SearchSlice"
import { ProductResult, Subcategory, SubcategoryByBrand, SubcategoryResult } from "../../../types/types";

interface SearchResultsProps {
    handleBlur: () => void;
    setSearchInput: (arg0: string) => void;
    debouncedSearchTerms: string[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ debouncedSearchTerms, setSearchInput, handleBlur }) => {
    const subcategoryResults = useSelector(selectSubcategoryResults);
    const navigate = useNavigate();
    const byBrandResults = useSelector(selectSubcategoryByBrandResults);
    const productsResults = useSelector(selectProductResults);
    const dispatch = useDispatch();

    const handleSelectSubcategory = (subcategory: SubcategoryResult) => {
        navigate(`/${subcategory.category_name}/${subcategory.subcategory_name}`);
        dispatch(setSubcategoryResults([]));
        setSearchInput("");
        handleBlur();
    }

    const handleSelectSubcategoryByBrand = (subcategory: SubcategoryByBrand) => {
        navigate(`/${subcategory.category_name}/${subcategory.subcategory_name}?brand=${encodeURIComponent(subcategory.manufacturer)}`);
        dispatch(setSubcategoryByBrandResults([]));
        setSearchInput("");
        handleBlur();
    }

    const handleSelectProduct = async (product: ProductResult) => {
        navigate(`/${product.category_name}/${product.subcategory_name}/${product.name}${product.variant_name ? `/${product.variant_name}` : ''}`);
        dispatch(setProductsResults([]));
        setSearchInput("");
        handleBlur();
    }

    return (
        <div className="flex flex-col w-full overflow-y-auto" style={{maxHeight: '600px'}}>
            {debouncedSearchTerms.length > 0 && subcategoryResults.length === 0 && byBrandResults.length === 0 && productsResults.length === 0 && (
                <div className="w-full flex justify-center p-6 text-lg font-semibold">
                    <p>No results found.</p>
                </div>
            )}
            {subcategoryResults.length > 0 && (
                <div className="w-1/2 flex flex-col">
                    <h1 className="font-semibold text-lg p-4 self-center">Categories:</h1>
                    <div className="space-y-4 flex flex-col px-4 pb-4">
                        {subcategoryResults.map((subcategory, index) => (
                            <button key={index} onClick={() => handleSelectSubcategory(subcategory)} className="flex hover:shadow-lg items-center border bg-white border-gray-300 rounded-md p-4" >
                                <img src={subcategory.image} width={50} />
                                <p className="mx-2 w-3/4">{subcategory.subcategory_name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {byBrandResults.length > 0 && (
                <>
                    <h1 className="font-semibold p-4 text-lg">Categories:</h1>
                    <div className="space-y-4 flex flex-col px-4 pb-4">
                        {byBrandResults.map((subcategory, index) => (
                            <button onClick={() => handleSelectSubcategoryByBrand(subcategory)} key={index} className="w-1/2 flex items-center hover:underline">
                                <p className="text-start">{subcategory.manufacturer} {subcategory.subcategory_name}</p>
                            </button>
                        ))}
                    </div>
                </>
            )}


            {productsResults.length > 0 && (
                <div className="w-full flex flex-col">
                  
                    {productsResults.map((product, index) => (
                        <button onClick={() => handleSelectProduct(product)} key={index} className="flex items-center w-full border-b border-t p-2 bg-white rounded-md">
                            <img src={product.image1} width={50} />
                            <p className="mx-2 hover:underline">{product.name} {product.variant_name}</p>
                        </button>
                    ))}
                </div>
            )}


        </div>
    )
}