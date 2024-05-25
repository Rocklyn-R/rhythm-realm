import { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectSelectedProduct } from '../../../redux-store/ProductsSlice';
import { addItemToCart } from '../../../redux-store/CartSlice';

export const AddToCart = () => {

    const [quantity, setQuantity] = useState<number>(1);
    const dispatch = useDispatch();
    const selectedProduct = useSelector(selectSelectedProduct);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleChange = (event: SelectChangeEvent<number>) => {
        const selectedQuantity = typeof event.target.value === 'string' ? parseInt(event.target.value) : event.target.value;
        setQuantity(selectedQuantity);
    }

    const handleAddToCart = () => {
        const productWithQuantity = {
            ...selectedProduct,
            quantity: quantity
        }
        dispatch(addItemToCart(productWithQuantity))
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false)
        }, 900);
    }

  

    return (
        <div className="border-gray-400 border-b pb-4 mb-4 w-full flex">
            <Select
                value={quantity}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Quantity' }}
            >
                {Array.from({ length: 10 }, (_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                        {index + 1}
                    </MenuItem>
                ))}
            </Select>
            <button
                className={`${addedToCart ? "bg-red-800" : "bg-black"} hover:bg-red-800 transition-colors duration-300 ease flex-1 x-36 py-4 mx-4 rounded-md bg-black text-white text-xl`}
                onClick={() => handleAddToCart()}
                disabled={addedToCart}
            >{addedToCart ? "Added to cart!" : "Add to cart"}</button>
        </div>
    )
}