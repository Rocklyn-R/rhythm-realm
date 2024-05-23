import { useSelector } from "react-redux"
import { selectSelectedProduct } from "../../../redux-store/ProductsSlice"

export const ImageGallery = () => {
    const selectedProduct = useSelector(selectSelectedProduct);

    return (
        <div className="w-1/2">
            <img src={selectedProduct.image1} width="600" />
        </div>
    )
}