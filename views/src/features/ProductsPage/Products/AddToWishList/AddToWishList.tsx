import { Product } from "../../../../types/types"
import { FaRegHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, setHeaderIsOpen, addToWishList, selectWishList, removeFromWishList } from "../../../../redux-store/UserSlice";
import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { addItemToWishList, removeItemFromWishList } from "../../../../api/wishList";

interface AddToWishListProps {
    variant: Product;
    mode: "Products Page" | "Item Page";
}

export const AddToWishList: React.FC<AddToWishListProps> = ({ mode, variant }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const wishList = useSelector(selectWishList);
    const [itemIsInWishList, setItemIsInWishList] = useState(false);

    useEffect(() => {
        // Update itemIsInWishList whenever wishList or variant changes
        setItemIsInWishList(!!wishList.find(item => item.variant_id === variant.variant_id));
    }, [wishList, variant]);

    const handleAddToWishList = async (product: Product, event: React.MouseEvent) => {
        event.stopPropagation();
        if (!isAuthenticated) {
            dispatch(setHeaderIsOpen());
        } else {
            const result = await addItemToWishList(product.id, product.variant_id);
            if (result) {
                dispatch(addToWishList(product));
                setItemIsInWishList(true);
            }
        }
    };

    const handleRemoveFromWishList = async (product: Product, event: React.MouseEvent) => {
        event.stopPropagation();
        const result = await removeItemFromWishList(product.id, product.variant_id);
        if (result) {
           dispatch(removeFromWishList(product)); 
        }
    }

    return (
        <div className={`${mode === "Products Page" ? "absolute top-0 right-0 z-50" : ""}`}>
            {itemIsInWishList && isAuthenticated ? (
                <FaHeart
                    className={`${mode === "Products Page" ? "flex" : "mr-4"} text-red-700 text-3xl cursor-pointer z-50`}
                    onClick={(e) => handleRemoveFromWishList(variant, e)}
                />
            ) : (
                <FaRegHeart className={`${mode === "Products Page" ? "flex" : "mr-4"} hover:text-red-800 heart-icon text-3xl cursor-pointer z-50`}
                    onClick={(e) => handleAddToWishList(variant, e)}
                />
            )}
        </div>
    );
};