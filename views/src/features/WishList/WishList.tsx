import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { removeFromWishList, selectIsAuthenticated, selectIsLoadingAuth, selectWishList } from "../../redux-store/UserSlice"
import { formatPrice } from "../../utilities/utilities";
import { AddToCart } from "../Item/AddToCart/AddToCart";
import { FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { removeItemFromWishList } from "../../api/wishList";
import { Product } from "../../types/types";
import { useDispatch } from "react-redux";


export const WishList = () => {
    const wishListItems = useSelector(selectWishList);
    const [showRemoveMessage, setShowRemoveMessage] = useState(false);
    const [productToRemove, setProductToRemove] = useState<Product>();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRemoveFromWishList = (product: Product) => {
        setShowRemoveMessage(true);
        setProductToRemove(product)
    }

    const handleRemoveItem = async () => {
        if (productToRemove) {
            const removal = await removeItemFromWishList(productToRemove.id, productToRemove.variant_id); 
            if (removal) {
             dispatch(removeFromWishList(productToRemove));   
            }
        }
        setShowRemoveMessage(false);
    }
    const handleCancelRemove = () => {
        setShowRemoveMessage(false);
    }

    useEffect(() => {
        if (!isAuthenticated && !isLoadingAuth) {
            navigate("/");
        }
    }, [isAuthenticated, isLoadingAuth]);

    useEffect(() => {
        if (showRemoveMessage) {
            // Prevent scrolling
            document.body.style.overflow = "hidden";
        } else {
            // Restore scrolling
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showRemoveMessage]);

    if (isLoadingAuth) {
        return <div></div>
    }


    return (
        
        <div className="flex flex-col mb-14 px-4 w-full items-center">
            <h2 className="text-3xl text-center font-bold mb-6">Wish List</h2>
            <div className="space-y-4 w-2/3 py-4 bg-white shadow-lg rounded-md">
                {wishListItems.map(item => (
                    <div className="flex p-4 rounded-md w-full">
                        <img src={item.image1} width={200} />
                        <div className="ml-4 space-y-2 w-full flex flex-col justify-between py-4">
                            <div>
                                <Link to={`/${item.category_name}/${item.subcategory_name}/${item.name}${item.variant_name ? `/${item.variant_name}` : ''}`} className="text-lg font-semibold hover:underline">{item.name} {item.variant_name}</Link>
                                <p className={`${item.sale_price && 'line-through'} text-lg font-semibold`}>${formatPrice(item.price)}</p>
                                {item.sale_price && <p className="text-red-800 font-semibold">${formatPrice(item.sale_price)}</p>}
                            </div>
                            <div className="w-1/2">
                                <AddToCart product={item} />
                            </div>
                        </div>
                        <button onClick={() => handleRemoveFromWishList(item)} className="flex flex-col items-center self-center"><FaRegTrashAlt className="text-xl" /></button>
                    </div>
                ))}
            </div>
            {showRemoveMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center w-full">
                    <div className="bg-white p-8 rounded-md shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">Do you wish to remove this item from your wish list?</p>
                        <div className="flex space-x-4 justify-center w-full">
                            <button onClick={() => handleRemoveItem()} className="px-4 py-2 bg-black text-white rounded hover:bg-red-800">Yes</button>
                            <button onClick={handleCancelRemove} className="px-4 py-2 bg-black text-white rounded hover:bg-red-800">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}