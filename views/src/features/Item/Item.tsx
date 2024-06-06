import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectSelectedProduct, setSelectedProduct, setVariants } from "../../redux-store/ProductsSlice"
import { useParams } from "react-router-dom";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { getAllVariants, getSelectedProduct } from "../../api/products";
import { useDispatch } from "react-redux";
import { Truck, Undo2 } from "lucide-react";
import { AddToCart } from "./AddToCart/AddToCart";
import { Variants } from "./Variants/Variants";

export const Item = () => {
    const selectedProduct = useSelector(selectSelectedProduct);
    const { categoryName, subcategoryName, productName, variantName } = useParams<{ categoryName: string, subcategoryName: string, productName: string, variantName: string }>();
    const dispatch = useDispatch();

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
    }, [dispatch, variantName])

    return (
        <div className="flex justify-center lg:flex-row xxs:flex-col xxs:items-center lg:items-start">
            <ImageGallery />
            <div className="xxs:mt-4 lg:pt-0 xxs:pt-4 lg:ml-10 xxs:m-6 lg:w-1/2 flex flex-col items-start border-gray-400 xxs:border-t lg:border-none">
                <h2 className="text-3xl font-bold">{productName} {variantName}</h2>
                <div className="border-gray-400 border-b pb-4 mb-4 w-full">
                    <h2 className="text-3xl my-8">${selectedProduct.price}</h2>
                    <p>{selectedProduct.description}</p>
                </div>
                <Variants />
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