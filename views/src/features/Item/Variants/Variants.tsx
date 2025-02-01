import { useSelector } from "react-redux";
import { selectSelectedProduct, selectVariants } from "../../../redux-store/ProductsSlice";
import { Link, useParams } from "react-router-dom";

export const Variants = () => {
    const selectedProduct = useSelector(selectSelectedProduct);
    const productVariants = useSelector(selectVariants);
    const { categoryName, subcategoryName } = useParams<{ categoryName: string, subcategoryName: string }>();



    return (
        <div className="pb-4 w-full">
            <p>Variant: {selectedProduct.variant_name}</p>
            {productVariants.map((variant, index) => (
                <Link key={index} to={`/${categoryName}/${subcategoryName}/${selectedProduct.name}/${variant.variant_name}`}>
                 <button
                    key={index}
                    className={`w-1/6 mr-4 my-4 p-2 bg-white rounded-md ${variant.variant_name === selectedProduct.variant_name ? 'border-red-800 border-2' : 'border-gray-400 border'}`}
                >
                    <img alt="Variant" src={variant.image1} />
                </button>
                </Link>
            ))}
        </div>
    )
}