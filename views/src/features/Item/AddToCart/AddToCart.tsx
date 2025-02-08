import { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { addItemToCart } from '../../../redux-store/CartSlice';
import { selectIsAuthenticated } from '../../../redux-store/UserSlice';
import { addToCart } from '../../../api/cart';
import { Product } from '../../../types/types';

interface AddToCartProps {
    product: Product;
}

export const AddToCart: React.FC<AddToCartProps> = ({product}) => {

    const [quantity, setQuantity] = useState<number>(1);
    const dispatch = useDispatch();
    const [addedToCart, setAddedToCart] = useState(false);
    const isAuthenticated = useSelector(selectIsAuthenticated);
  

    const handleChange = (event: SelectChangeEvent<number>) => {
        const selectedQuantity = typeof event.target.value === 'string' ? parseInt(event.target.value) : event.target.value;
        setQuantity(selectedQuantity);
    }

    const handleAddToCart = async () => {
        const productWithQuantity = {
            ...product,
            quantity: quantity
        }
        dispatch(addItemToCart(productWithQuantity));
        if (isAuthenticated) {
            await addToCart(product.id, product.variant_id, quantity);

        }
        setAddedToCart(true);
        const timeout = setTimeout(() => {
            setAddedToCart(false)
        }, 900);
        return () => clearTimeout(timeout);
    }


    return (
        <div className="flex w-full">
            <Select
                value={quantity}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Quantity' }}
                className="mr-4"
            >
                {Array.from({ length: 10 }, (_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                        {index + 1}
                    </MenuItem>
                ))}
            </Select>
            <button
                className={`${addedToCart ? "bg-red-800" : "bg-black"} hover:bg-red-800 transition-colors duration-300 ease w-full py-4 mr-4 rounded-md text-white text-xl`}
                onClick={() => handleAddToCart()}
                disabled={addedToCart}
            >
                {addedToCart ? "Added to cart!" : "Add to cart"}
            </button>
        </div>
    )
}