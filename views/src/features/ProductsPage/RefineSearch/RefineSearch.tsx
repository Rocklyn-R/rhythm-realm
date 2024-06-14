import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getManufacturers, getProducts } from "../../../api/products";
import { setProducts } from "../../../redux-store/ProductsSlice";
import { Product } from "../../../types/types"

interface RefineSearchProps {
    products: Product[];
    subcategoryName: string;
}

export const RefineSearch: React.FC<RefineSearchProps> = ({ products, subcategoryName }) => {

    const [manufacturers, setManufacturers] = useState<string[]>([])
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const dispatch = useDispatch();

    const handleSelectBrand = (brand: string) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    }

    useEffect(() => {
        const manufacturersFetch = async () => {
            const result = await getManufacturers(subcategoryName);
            if (result) {
                setManufacturers(result);
            }
        }
        manufacturersFetch();
    }, [dispatch, subcategoryName])

    useEffect(() => {
        const filteredProductsFetch = async () => {
            const result = await getProducts(subcategoryName, selectedBrands);
            if (result) {
                dispatch(setProducts(result))
            }
        }
      
        filteredProductsFetch(); 
    
    }, [dispatch, selectedBrands])

    return (
        <div className="w-1/4 p-4 bg-white rounded-md">
            <h4 className="text-xl font-bold">Refine Your Search</h4>
            <div className="border-t-2 border-gray-200 mt-6 py-4">
                <h4 className="font-semibold mb-2">Brand</h4>
                <div className="flex flex-col items-start">
                    {manufacturers.map(brand => (
                        <div className="flex items-center my-2">
                            <input
                                type="checkbox"
                                className="mr-3 w-6 h-6 custom-checkbox"
                                checked={selectedBrands.includes(brand)}
                                onClick={() => handleSelectBrand(brand)}
                            />
                            <label>{brand}</label>
                        </div>

                    ))}
                </div>

            </div>
            <div className="border-t-2 border-gray-200 py-4">
                <h4 className="font-semibold">Savings</h4>
            </div>
            <div className="border-t-2 border-gray-200 py-4">
                <h4 className="font-semibold">Price</h4>
            </div>
        </div>
    )
}