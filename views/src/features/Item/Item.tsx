import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { selectSelectedProduct, selectVariants, setReviews, setSelectedProduct, setVariants } from "../../redux-store/ProductsSlice"
import { useParams } from "react-router-dom";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { getAllVariants, getReviews, getSelectedProduct } from "../../api/products";
import { useDispatch } from "react-redux";
import { Truck, Undo2 } from "lucide-react";
import { AddToCart } from "./AddToCart/AddToCart";
import { Variants } from "./Variants/Variants";
import { FiPlus, FiMinus } from "react-icons/fi";
import { StarRating } from "./StarRating/StarRating";
import { AddToWishList } from "../ProductsPage/Products/AddToWishList/AddToWishList";
import { LuShieldCheck } from "react-icons/lu";
import { ReviewsBox } from "./ReviewsBox/ReviewsBox";
import { formatPrice } from "../../utilities/utilities";

export const Item = () => {
    const selectedProduct = useSelector(selectSelectedProduct);
    const { productName, variantName } = useParams<{ categoryName: string, subcategoryName: string, productName: string, variantName: string }>();
    const dispatch = useDispatch();
    const variants = useSelector(selectVariants);
    const [showDescription, setShowDescription] = useState(true);
    const itemDescriptionRef = useRef<HTMLDivElement>(null);
    const [showReviews, setShowReviews] = useState(true);
    const reviewsRef = useRef<HTMLDivElement>(null);
   
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
                const reviewData = await getReviews(selectedProductData.id);
                if (reviewData) {
                    dispatch(setReviews(reviewData))
                } else {
                    dispatch(setReviews([]))
                }
            }
        }

        fetchSelectedProduct();
    }, [dispatch, variantName, productName]);

    const scrollToItemDescription = () => {
        if (itemDescriptionRef.current) {
            itemDescriptionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToReviews = () => {
        if (reviewsRef.current) {
            reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };


    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-center mb-14 w-full">
                <div className="mt-4 w-full flex lg:flex-row flex-col justify-center lg:items-stretch">
                    <ImageGallery />
                    <div className="rounded-sm p-6 lg:mr-6 shadow-md flex flex-col items-start lg:ml-4 mx-4 lg:mx-0 lg:w-2/5 lg:mt-0 mt-4 bg-white">
                        {selectedProduct.marketing_label && (
                            <p className={`${selectedProduct.marketing_label === "Top Seller"
                                ? "bg-black"
                                : selectedProduct.marketing_label === "New Arrival"
                                    ? "bg-blue-700"
                                    : "bg-red-800"
                                } text-white py-1 px-2 text-xs font-semibold mb-2`}>
                                {selectedProduct.marketing_label}
                            </p>
                        )}
                        <h2 className="text-2xl font-bold">
                            {productName} {variantName && variantName}
                        </h2>
                        <div className="flex items-center mb-3">
                            {selectedProduct && (
                                <div className="cursor-pointer" onClick={() => scrollToReviews()}>
                                    <StarRating
                                        rating={selectedProduct.avg_rating}
                                    />
                                </div>
                            )}
                            <p className="ml-2 text-xs text-gray-500">|</p>
                            <p className="ml-2 text-xs text-gray-500">Item #{selectedProduct.variant_id}</p>
                        </div>

                        <div className="mb-3 w-full">
                            {selectedProduct.sale_price ? (
                                <div className="flex md:items-center md:space-x-2 md:flex-row flex-col items-start">
                                    <h2 className="text-3xl mt-2 mb-2 line-through">
                                        ${formatPrice(selectedProduct.price)}
                                    </h2>
                                    <h2 className="text-3xl text-red-800 font-semibold">
                                        ${formatPrice(selectedProduct.sale_price)}
                                    </h2>
                                </div>
                            ) : (
                                <h2 className="text-3xl mt-1 font-semibold">${selectedProduct.price}</h2>
                            )}
                        </div>
                        <div className="flex flex-col border-gray-400 border-b pb-6 mb-4 w-full space-y-3">
                            <p>Condition: New</p>
                            <p className="font-semibold text-green-700">In-stock</p>
                            <button onClick={scrollToItemDescription} className="cursor-pointer underline flex">View Item Description</button>
                        </div>

                        {variants.length > 1 && <Variants />}
                        <div className={`${variants.length === 1 ? "pt-4 pb-8" : "pb-4"} border-gray-400 border-b mb-4 w-full flex items-center`}>
                            <AddToCart product={selectedProduct} />
                            <AddToWishList
                                variant={selectedProduct}
                                mode="Item Page"
                            />
                        </div>

                        <div className="flex sm:flex-row flex-col justify-center items-center w-full">
                            <div className="flex flex-col items-center p-4">
                                <Truck />
                                <p>Free shipping</p>
                            </div>
                            <div className="flex flex-col items-center p-4">
                                <Undo2 />
                                <p>45 day returns</p>
                            </div>
                            <div className="flex flex-col items-center p-4">
                                <LuShieldCheck className="text-2xl" />
                                <p>Free Warranty</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={itemDescriptionRef} className="mx-4 shadow-md flex flex-col justify-center py-10 bg-white">
                <div className="flex items-center px-6">
                    <button onClick={() => setShowDescription(!showDescription)}>{showDescription ? <FiMinus className="text-3xl mr-4" /> : <FiPlus className="text-3xl mr-4" />}</button>
                    <h2 className="text-2xl font-bold">Description</h2>
                </div>
                {showDescription ? (
                    <div>
                        <p className="px-14 py-10">{selectedProduct.description}</p>
                        <div className="flex justify-around">
                            <img alt="Image1" src={selectedProduct.image1} className="w-1/3" />
                            <img alt="Image2" src={selectedProduct.image2} className="w-1/3" />
                            {selectedProduct.image3 && <img alt="Image3" src={selectedProduct.image3} className="w-1/3" />}
                        </div>
                    </div>) : ""}
            </div>
            <div ref={reviewsRef} className="mx-4 mt-14 shadow-md flex flex-col justify-center py-10 bg-white">
                <div className="flex items-center px-6">
                    <button onClick={() => setShowReviews(!showReviews)}>{showReviews ? <FiMinus className="text-3xl mr-4" /> : <FiPlus className="text-3xl mr-4" />}</button>
                    <h2 className="text-2xl font-bold">Reviews</h2>
                </div>
                {showReviews ? (
                    <ReviewsBox />
                ) : ""}

            </div>
        </div>
    )
}