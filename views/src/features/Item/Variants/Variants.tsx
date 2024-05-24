import { useEffect } from "react"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"
import { getAllVariants } from "../../../api/products"
import { selectSelectedProduct, selectVariants, setSelectedProduct, setVariants } from "../../../redux-store/ProductsSlice";
import { Product } from "../../../types/types";
import { Link, useParams } from "react-router-dom";

export const Variants = () => {
    const dispatch = useDispatch();
    const selectedProduct = useSelector(selectSelectedProduct);
    const productVariants = useSelector(selectVariants);
    const { categoryName, subcategoryName } = useParams<{ categoryName: string, subcategoryName: string }>();



    return (
        <div className="pb-4 w-full">
            <p>Variant: {selectedProduct.variant_name}</p>
            {productVariants.map((variant) => (
                <Link to={`/${categoryName}/${subcategoryName}/${selectedProduct.name}/${variant.variant_name}`}>
                 <button
                    key={variant.id}
                    className={`w-1/5 mr-4 my-4 p-2 bg-white rounded-md ${variant.variant_name === selectedProduct.variant_name ? 'border-red-800 border-2' : 'border-gray-400 border'}`}
                >
                    <img src={variant.image1} />
                </button>
                </Link>
            ))}
        </div>
    )
}