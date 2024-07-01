import { Product } from "../../../types/types"
import { formatPrice } from "../../../utilities/utilities"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { setSelectedProduct } from "../../../redux-store/ProductsSlice"
import { AddToWishList } from "./AddToWishList/AddToWishList"


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
                    };
                }
                return item; // Keep other products unchanged
            });
            setProductsForSelection(updatedProductsForSelection);

        }

    };

    /* useEffect(() => {
         if (productsForSelection.length === 0) {
             setProductsForSelection(sortedProducts);
         }
     }, [dispatch, uniqueProducts])*/


    const handleClickProduct = (product: Product) => {
        dispatch(setSelectedProduct(product));
        const variant = productsForSelection.length === 0 ? product.variant_name : productsForSelection.find(item => item.id === product.id)?.variant_name;
        navigate(`/${categoryName}/${subcategoryName}/${product.name}${variant ? `/${variant}` : ''}`)
    }

    const findProduct = (product: Product) => {
        const foundProduct = productsForSelection.find(item => item.id === product.id);
        const productToUse = productsForSelection.length === 0 ? product : foundProduct;
        return productToUse;
    }


    return (
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-1 w-full bg-gray">
            {uniqueProducts && uniqueProducts.map(product => (
                <div key={product.variant_id} className="flex flex-col justify-between items-center shadow-sm hover:shadow-xl border-black w-48 sm:w-48 md:w-50 lg:w-52 mt-8 bg-white mx-auto rounded-md">
                    <button onClick={() => handleClickProduct(product)} className="w-full h-full flex justify-between p-2 ">
                        <div className="w-full h-full flex flex-col justify-between">
                            <div className="w-full flex relative mb-1 h-6">
                                {product.marketing_label ? <p className={`${product.marketing_label === "Top Seller" ? `bg-black`: product.marketing_label === "New Arrival" ? `bg-blue-700` : `bg-red-800` } text-white py-1 px-2 text-xs font-semibold`}>{product.marketing_label}</p> : ""}
                                <AddToWishList
                                   variant={product}
                                   mode="Products Page"
                                />
                            </div>
                            <div className="relative w-full overflow-hidden">
                                <div className="flex custom-slider" style={{ transform: `translateX(-${(currentSlide[product.id] || 0) * 100}%)` }}>
                                    {productVariantsMap[product.id].map((variant, index) => (
                                        <div className="min-w-full relative" key={variant.variant_id}>
                                            <img className="w-full" src={variant.image1} alt={`${variant.name} ${variant.variant_name}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {productVariantsMap[product.id].length > 1 ? (
                                <div className="flex overflow-hidden mt-2 py-4 justify-center">
                                    <div className="flex">
                                        {productVariantsMap[product.id].length <= 4 ? (
                                            productVariantsMap[product.id].slice(0, 4).map((variant, index) => (
                                                <div
                                                    className="w-10 h-12 mx-1/2 cursor-pointer border border-gray-300 rounded-lg"
                                                    key={variant.variant_id}
                                                    onClick={(event) => handleThumbnailClick(product, variant, index, event)}
                                                >
                                                    <img
                                                        className="w-full h-full object-cover p-1"
                                                        src={variant.image1}
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
                                                            src={variant.image1}
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

                            <div className="flex flex-col flex-grow justify-end mt-2">
                                <p className="p-1 text-gray-700">{product.name}</p>
                                {findProduct(product)?.sale_price ? (
                                    <div>
                                        <p className="pt-2 font-bold line-through">${formatPrice(product.price)}</p>
                                        <p className="pt-2 font-bold text-red-800">${formatPrice(product.sale_price)}</p>
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