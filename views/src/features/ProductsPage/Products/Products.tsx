import { Product } from "../../../types/types"
import { formatPrice, formatName } from "../../../utilities/utilities"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { setSelectedProduct } from "../../../redux-store/ProductsSlice"
import { AddToWishList } from "./AddToWishList/AddToWishList"
import { StarRating } from "../../Item/StarRating/StarRating"
import { formatImage } from "../../../utilities/utilities"

interface ProductsProps {
    uniqueProducts: Product[]
    productVariantsMap: Record<string, Product[]>
    sortedProducts: Product[]
}



export const Products: React.FC<ProductsProps> = ({ sortedProducts, uniqueProducts, productVariantsMap }) => {
    const { categoryName, subcategoryName } = useParams<{ categoryName: string, subcategoryName?: string }>();
    const [currentSlide, setCurrentSlide] = useState<Record<string, number>>({});
    const [productsForSelection, setProductsForSelection] = useState<Product[]>([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleThumbnailClick = (product: Product, variant: Product, index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setCurrentSlide(prev => ({
            ...prev,
            [product.id]: index
        }));

        const foundProductIndex = uniqueProducts.findIndex(item => item.id === product.id);
        if (foundProductIndex !== -1) {
            const updatedProductsForSelection = uniqueProducts.map((item, i) => {
                if (i === foundProductIndex) {
                    // Modify the product at the correct index
                    return {
                        ...item,
                        sale_price: variant.sale_price,
                        image1: variant.image1,
                        image2: variant.image2,
                        image3: variant.image3,
                        variant_id: variant.variant_id,
                        variant_name: variant.variant_name,
                        marketing_label: variant.marketing_label
                    };
                }
                return item; // Keep other products unchanged
            });
            setProductsForSelection(updatedProductsForSelection);

        }

    };

    const handleClickProduct = (product: Product) => {
        dispatch(setSelectedProduct(product));
        const variant = productsForSelection.length === 0 ? product.variant_name : productsForSelection.find(item => item.id === product.id)?.variant_name;
        console.log(variant);
        const formattedVariant = variant ? formatName(variant) : undefined;
        const formattedProductName = formatName(product.name);
        if (categoryName && subcategoryName) {
            navigate(`/${categoryName}/${subcategoryName}/${formattedProductName}${formattedVariant ? `/${formattedVariant}` : ''}`)
        } else {
            navigate(`/${product.category_name}/${product.subcategory_name}/${formattedProductName}${formattedVariant ? `/${formattedVariant}` : ''}`)
        }

    }

    const findProduct = (product: Product) => {
        //console.log(productsForSelection);
        const foundProduct = productsForSelection.find(item => item.id === product.id);
        //console.log(foundProduct);
        const productToUse = productsForSelection.length === 0 ? product : foundProduct;
        return productToUse;
    }





    return (
        <div className="md:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 w-full bg-gray">
            {uniqueProducts && uniqueProducts.map(product => (
                <div
                    key={product.variant_id}
                    className="flex xs:flex-col flex-row md:flex-col justify-between items-center shadow-sm hover:shadow-xl border-black w-5/6 md:w-50 lg:w-52 mt-8 bg-white mx-auto rounded-md"
                >
                    <button onClick={() => handleClickProduct(product)} className="w-full h-full flex justify-between p-2 ">
                        <div className="w-full h-full xxs:flex-col flex xs:flex-row md:flex-col justify-between">
                            <div className="flex flex-col justify-center xs:w-1/2 sm:w-1/3 md:w-full relative">
                                <div className={`${findProduct(product)?.marketing_label ? "justify-between" : "justify-end"} w-fit flex mb-1 h-6 items-center z-20`}>
                                    {findProduct(product)?.marketing_label ? <p className={`${product.marketing_label === "Top Seller" ? `bg-black` : product.marketing_label === "New Arrival" ? `bg-blue-700` : `bg-red-800`} text-white py-1 px-2 text-xs font-semibold`}>{product.marketing_label}</p> : ""}

                                </div>
                                <div className="w-full overflow-hidden">
                                    <div className="flex custom-slider" style={{ transform: `translateX(-${(currentSlide[product.id] || 0) * 100}%)` }}>
                                        {productVariantsMap[product.id].map((variant, index) => (
                                            <div className="min-w-full relative" key={variant.variant_id}>
                                                <img className="w-full p-2" src={formatImage(variant.image1, "m")} alt={`${variant.name} ${variant.variant_name}`} />
                                                <AddToWishList
                                                    variant={variant}
                                                    key={variant.variant_id}
                                                    mode="Products Page"
                                                />
                                            </div>

                                        ))}
                                    </div>
                                </div>
                                {productVariantsMap[product.id].length > 1 ? (
                                    <div className="flex overflow-hidden mt-2 py-4 justify-center">
                                        <div className="flex w-full justify-center">
                                            {productVariantsMap[product.id].length <= 4 ? (
                                                productVariantsMap[product.id].slice(0, 4).map((variant, index) => (
                                                    <div
                                                        className="w-10 h-12 mx-1/2 cursor-pointer border border-gray-300 rounded-lg"
                                                        key={variant.variant_id}
                                                        onClick={(event) => handleThumbnailClick(product, variant, index, event)}
                                                    >
                                                        <img
                                                            className="w-full h-full object-cover p-1"
                                                            src={formatImage(variant.image1, "s")}
                                                            alt={`${variant.name} ${variant.variant_name}`}
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    {productVariantsMap && productVariantsMap[product.id].slice(0, 3).map((variant, index) => (
                                                        <div
                                                            className="w-10 h-12 mx-1/2 cursor-pointer border border-gray-300 rounded-lg"
                                                            key={variant.variant_id}
                                                            onClick={(event) => handleThumbnailClick(product, variant, index, event)}
                                                        >
                                                            <img
                                                                className="w-full h-full object-cover p-1"
                                                                src={formatImage(variant.image1, "s")}
                                                                alt={`${variant.name} ${variant.variant_name}`}
                                                            />
                                                        </div>
                                                    ))}
                                                    <div
                                                        className="w-10 h-12 mx-1/2 cursor-pointer border border-gray-300 rounded-lg flex items-center justify-center"
                                                    >
                                                        +{productVariantsMap[product.id].length - 3}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : ""}
                            </div>


                            <div className="flex flex-col flex-grow w-1/2 md:w-full justify-center md:justify-end mt-2">
                                <p className="p-1 text-gray-700">{product.name}</p>
                                <StarRating
                                    rating={product.avg_rating}
                                />
                                
                                {findProduct(product)?.sale_price ? (
                                    <div>
                                        <p className="pt-2 font-bold line-through">${formatPrice(product.price)}</p>
                                        <p className="pt-2 font-bold text-red-800">${formatPrice(findProduct(product)!.sale_price)}</p>
                                    </div>
                                ) : <p className="pt-2 font-bold">${formatPrice(product.price)}</p>}
                            </div>
                        </div>
                    </button>
                </div>
            ))}
        </div>
    )
}