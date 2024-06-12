import { Select, SelectProps } from "antd"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { selectProducts, setProducts } from "../../../redux-store/ProductsSlice";
import { getProducts } from "../../../api/products";
import { Product } from "../../../types/types";

interface SortByProps {
    uniqueProducts: Product[]
    setSorting: (arg0: string) => void;
    sorting: string;
}

export const SortBy: React.FC<SortByProps> = ({uniqueProducts, sorting, setSorting}) => {
    const totalProducts = uniqueProducts.length;
    const options = ["Best match", "Price - Low to High", "Price - High to Low", "Brand Name A-Z"]




    const handleSelectSorting: SelectProps['onChange'] = (value) => {
        setSorting(value);
    }


    return (
        <div className="flex items-center w-full px-6 justify-between">
            <Select 
            onChange={handleSelectSorting}
             value={sorting}
             style={{
                 height: "50px",
                 width: "20%",
                 fontFamily: "Montserrat",
                 fontSize: "2rem",
                 
             }}
             options={[
                ...options.map(option => ({ 
                     value: option, 
                     label: option }))
             ]}
            />
            <div className="mt-2">
               <h2 className="font-semibold">{totalProducts} matches found</h2> 
            </div>
        </div>
    )
}