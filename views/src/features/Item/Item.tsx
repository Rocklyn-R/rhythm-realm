import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectSelectedProduct, setSelectedProduct } from "../../redux-store/ProductsSlice"
import { useParams } from "react-router-dom";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { getSelectedProduct } from "../../api/products";
import { useDispatch } from "react-redux";
import { Truck, Undo2 } from "lucide-react";
import { AddToCart } from "./AddToCart/AddToCart";

export const Item = () => {
    const selectedProduct = useSelector(selectSelectedProduct);
    const { categoryName, subcategoryName, productName, variantName } = useParams<{ categoryName: string, subcategoryName: string, productName: string, variantName: string }>();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSelectedProduct = async () => {
            const selectedProductData = await getSelectedProduct(productName!, variantName!);
            if (selectedProductData) {
                dispatch(setSelectedProduct(selectedProductData))
            }
        }

        fetchSelectedProduct();
    }, [dispatch])

    return (
        <div className="flex justify-center">
            <ImageGallery />
            <div className="w-2/5 flex flex-col items-start">
                <h2 className="text-3xl font-bold">{productName} {variantName}</h2>
                <div className="border-gray-400 border-b pb-4 mb-4 w-full">
                    <h2 className="text-3xl my-8">${selectedProduct.price}</h2>
                    <p>{selectedProduct.description}</p>
                </div>
                <div className="border-gray-400 border-b pb-4 mb-4 w-full">
                    Variants
                </div>
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