import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectSelectedProduct, selectVariants, setSelectedProduct, setVariants } from "../../redux-store/ProductsSlice"
import { useParams } from "react-router-dom";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { getAllVariants, getSelectedProduct } from "../../api/products";
import { useDispatch } from "react-redux";
import { Truck, Undo2 } from "lucide-react";
import { AddToCart } from "./AddToCart/AddToCart";
import { Variants } from "./Variants/Variants";

export const Item = () => {
    const selectedProduct = useSelector(selectSelectedProduct);
    const { productName, variantName } = useParams<{ categoryName: string, subcategoryName: string, productName: string, variantName: string }>();
    const dispatch = useDispatch();
    const variants = useSelector(selectVariants);
    console.log(variantName);
    
    useEffect(() => {
        dispatch(setVariants([]));
        const fetchSelectedProduct = async () => {
            const selectedProductData = await getSelectedProduct(productName!, variantName!);
            if (selectedProductData) {
                dispatch(setSelectedProduct(selectedProductData));
                const variantData = await getAllVariants(selectedProductData.id);
                if (variantData) {
                    dispatch(setVariants(variantData));
                }
            }
        }

        fetchSelectedProduct();
    }, [dispatch, variantName, productName])

    return (
        <div className="flex justify-center lg:flex-row xxs:flex-col xxs:items-center lg:items-start mb-14">
            <ImageGallery />
            <div className="xxs:mt-4 lg:pt-0 xxs:pt-4 lg:ml-10 xxs:m-6 lg:w-1/2 flex flex-col items-start border-gray-400 xxs:border-t lg:border-none">
                <h2 className="text-3xl font-bold">{productName} {variantName && variantName}</h2>
                <div className="border-gray-400 border-b pb-4 mb-4 w-full">
                   {selectedProduct.sale_price ? (
                    <div>
                        <h2 className="text-3xl mt-8 mb-2 line-through">${selectedProduct.price}</h2>
                        <h2 className="text-3xl mb-8 text-red-800 font-semibold">${selectedProduct.sale_price}</h2>
                    </div>
                   ) : <h2 className="text-3xl my-8">${selectedProduct.price}</h2>}
                    <p>{selectedProduct.description}</p>
                </div>
                {variants.length > 1 ? <Variants /> : ""}
                  <AddToCart />  
                <div className="flex">
                    <div className="flex flex-col items-center p-4">
                        <Truck />
                        <p>Free shipping</p>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <Undo2 />
                        <p>45 day returns</p>
                    </div>
                </div>
            </div>
        </div>
    )
}