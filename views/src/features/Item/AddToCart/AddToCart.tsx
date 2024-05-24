import { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

export const AddToCart = () => {

    const [quantity, setQuantity] = useState<number>(1);

    const handleChange = (event: SelectChangeEvent<number>) => {
        const selectedQuantity = typeof event.target.value === 'string' ? parseInt(event.target.value) : event.target.value;
        setQuantity(selectedQuantity);
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
            <button className="flex-1 x-36 py-4 mx-4 rounded-md bg-black text-white text-xl">Add to cart</button>
        </div>
    )
}