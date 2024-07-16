import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { getSelectedProduct } from "../../../api/products";
import { setSelectedProduct } from "../../../redux-store/ProductsSlice";
import {
    selectProductResults,
    selectRecommendedProductResults,
    selectSubcategoryByBrandResults,
    selectSubcategoryResults,
    setProductsResults,
    setRecommendedProductResults,
    setSubcategoryByBrandResults,
    setSubcategoryResults,
} from "../../../redux-store/SearchSlice"
import { ProductResult, Subcategory, SubcategoryByBrand, SubcategoryResult } from "../../../types/types";
import { formatPrice } from "../../../utilities/utilities";
import { StarRating } from "../../Item/StarRating/StarRating";

interface SearchResultsProps {
    handleBlur: () => void;
    setSearchInput: (arg0: string) => void;
    debouncedSearchTerms: string[];
    searchInput: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ searchInput, debouncedSearchTerms, setSearchInput, handleBlur }) => {
    const subcategoryResults = useSelector(selectSubcategoryResults);
    const navigate = useNavigate();
    const byBrandResults = useSelector(selectSubcategoryByBrandResults);
    const productsResults = useSelector(selectProductResults);
    const recommendedProducts = useSelector(selectRecommendedProductResults);
    const dispatch = useDispatch();

    const handleSelectSubcategory = (subcategory: SubcategoryResult) => {
        navigate(`/${subcategory.category_name}/${subcategory.subcategory_name}`);
        dispatch(setSubcategoryResults([]));
        dispatch(setRecommendedProductResults([]));
        setSearchInput("");
        handleBlur();
    }

    const handleSelectSubcategoryByBrand = (subcategory: SubcategoryByBrand) => {
        navigate(`/${subcategory.category_name}/${subcategory.subcategory_name}?brand=${encodeURIComponent(subcategory.manufacturer)}`);
        dispatch(setSubcategoryByBrandResults([]));
        dispatch(setRecommendedProductResults([]));
        setSearchInput("");
        handleBlur();
    }

    const handleSelectProduct = async (product: ProductResult) => {
        navigate(`/${product.category_name}/${product.subcategory_name}/${product.name}${product.variant_name ? `/${product.variant_name}` : ''}`);
        dispatch(setProductsResults([]));
        dispatch(setRecommendedProductResults([]));
        setSearchInput("");
        handleBlur();
    }



    return (
        <div className="flex w-full h-full overflow-hidden mb-1" style={{ maxHeight: '600px' }}>
        {/* Left Side - Categories or By Brand Section */}
              {/* No Results Found */}
              {debouncedSearchTerms.length > 0 && subcategoryResults.length === 0 && byBrandResults.length === 0 && productsResults.length === 0 && (
                    <div className="w-full flex justify-center p-6 text-lg font-semibold">
                        <p>No results found.</p>
                    </div>
                )}
        {(subcategoryResults.length > 0 || byBrandResults.length > 0) && (
            <div className="flex flex-col w-2/5 border-r border-gray-300 overflow-y-auto">

                {/* Categories Section */}
                {subcategoryResults.length > 0 && (
                    <div>
                        <h1 className="font-semibold text-lg p-4 self-center">Categories:</h1>
                        <div className="space-y-4 flex flex-col px-4 pb-4">
                            {subcategoryResults.map((subcategory, index) => (
                                <button key={index} onClick={() => handleSelectSubcategory(subcategory)} className="flex hover:shadow-lg items-center bg-white rounded-md p-4" >
                                    <img src={subcategory.image} width={50} alt={subcategory.subcategory_name} />
                                    <p className="mx-2 w-3/4">{subcategory.subcategory_name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* By Brand Section */}
                {byBrandResults.length > 0 && (
                    <div>
                        <h1 className="font-semibold p-4 text-lg">Categories:</h1>
                        <div className="space-y-4 flex flex-col px-4 pb-4">
                            {byBrandResults.map((subcategory, index) => (
                                <button onClick={() => handleSelectSubcategoryByBrand(subcategory)} key={index} className="flex items-center hover:underline">
                                    <p className="text-start">{subcategory.manufacturer} {subcategory.subcategory_name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Right Side - Recommended Products Section */}
        {recommendedProducts.length > 0 && (
            <div className="flex flex-col w-3/5 overflow-y-auto">
                <h1 className="font-semibold p-4 text-lg">Recommended Products:</h1>
                <div className="space-y-4">
                    {recommendedProducts.map((product, index) => (
                        <div className="flex p-4" key={index}>
                            <img  onClick={() => handleSelectProduct(product)} src={product.image1} className="cursor-pointer border rounded-md w-1/3 h-auto p-2 bg-white" alt={product.name} />
                            <div className="flex flex-col mx-2 w-3/4">
                                <p className="hover:underline cursor-pointer text-sm" onClick={() => handleSelectProduct(product)}>{product.name}</p>
                                <StarRating rating={product.rating} />
                                <p className="font-semibold">${formatPrice(product.price)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Additional Results Section (if any) */}
        {productsResults.length > 0 && (
            <div className="flex flex-col w-full">
                {productsResults.map((product, index) => (
                    <button onClick={() => handleSelectProduct(product)} key={index} className="flex items-center w-full rounded-b-md border-b border-t p-2 bg-white">
                        <img src={product.image1} width={50} alt={product.name} />
                        <p className="mx-2 hover:underline">{product.name} {product.variant_name}</p>
                    </button>
                ))}
            </div>
        )}
    </div>
    )
}