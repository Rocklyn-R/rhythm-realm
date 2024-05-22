import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectSelectedProduct, setSelectedProduct } from "../../redux-store/CategoriesSlice"
import { useParams } from "react-router-dom";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { getSelectedProduct } from "../../api/products";
import { useDispatch } from "react-redux";

export const Item = () => {
    const selectedProduct = useSelector(selectSelectedProduct);
    const { categoryName, subcategoryName, productName } = useParams<{ categoryName: string, subcategoryName: string, productName: string }>();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSelectedProduct = async () => {
            const selectedProductData = await getSelectedProduct(productName!);
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
                <h2 className="text-3xl font-bold">{productName}</h2>
                <h2 className="text-3xl my-8">${selectedProduct.price}</h2>
                <p>{selectedProduct.description}</p>
            </div>
        </div>   
    )
}