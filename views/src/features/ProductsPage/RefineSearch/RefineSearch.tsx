import { Input } from "antd";
import { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { getManufacturers, getProducts } from "../../../api/products";
import { setProducts } from "../../../redux-store/ProductsSlice";
import { Product } from "../../../types/types";
import { GoDash } from "react-icons/go";
import { GoPlus } from "react-icons/go";

interface RefineSearchProps {
    products: Product[];
    subcategoryName: string;
}

export const RefineSearch: React.FC<RefineSearchProps> = ({ products, subcategoryName }) => {

    const [manufacturers, setManufacturers] = useState<string[]>([])
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceDrop, setPriceDrop] = useState(false);
    const [priceMin, setPriceMin] = useState<string | undefined>(undefined);
    const [priceMax, setPriceMax] = useState<string | undefined>(undefined);
    const [tempPriceMin, setTempPriceMin] = useState<string>('');
    const [tempPriceMax, setTempPriceMax] = useState<string>('');
    const [showBrands, setShowBrands] = useState(false);
    const [showSavings, setShowSavings] = useState(false);
    const [showPrice, setShowPrice] = useState(false);

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
            const result = await getProducts(subcategoryName, selectedBrands, priceDrop, priceMin, priceMax);
            if (result) {
                dispatch(setProducts(result))
            }
        }

        filteredProductsFetch();

    }, [dispatch, selectedBrands, priceDrop, priceMin, priceMax])

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isNaN(Number(value))) {
            setTempPriceMin(value);
        }
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isNaN(Number(value))) {
            setTempPriceMax(value);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setPriceMin(tempPriceMin);
            setPriceMax(tempPriceMax);
        }
    };



    return (
        <div className="w-1/4 p-4 bg-white rounded-md shadow-lg">
            <h4 className="text-xl font-bold">Refine Your Search</h4>
            <div className="border-t-2 border-gray-200 mt-6 py-4 w-full">
                <div className="flex items-center justify-between w-full">
                    <h4 className="font-semibold">Brand</h4>
                    <button onClick={() => setShowBrands(!showBrands)}>{showBrands ? <GoDash className="text-2xl text-gray-500" /> : <GoPlus className="text-2xl text-gray-500" />}</button>
                </div>
                <div
                    className="overflow-hidden transition-max-height duration-500 ease-in-out"
                    style={{ maxHeight: showBrands ? '150px' : "0px" }}
                >


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

            </div>
            <div className="border-t-2 border-gray-200 py-4">
                <div className="flex items-center justify-between w-full">
                    <h4 className="font-semibold">Savings</h4>
                    <button onClick={() => setShowSavings(!showSavings)}>{showSavings ? <GoDash className="text-2xl text-gray-500" /> : <GoPlus className="text-2xl text-gray-500" />}</button>
                </div>
                <div
                    className="overflow-hidden transition-max-height duration-500 ease-in-out"
                    style={{ maxHeight: showSavings ? '50px' : "0px" }}
                >
                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            className="mr-3 w-6 h-6 custom-checkbox"
                            checked={priceDrop}
                            onClick={() => setPriceDrop(!priceDrop)}
                        />
                        <label>Price drop</label>
                    </div>
                </div>

            </div>
            <div className="border-t-2 border-b-2 border-gray-200 py-4 w-full">
                <div className="flex items-center justify-between w-full">
                    <h4 className="font-semibold">Price</h4>
                    <button onClick={() => setShowPrice(!showPrice)}>{showPrice ? <GoDash className="text-2xl text-gray-500" /> : <GoPlus className="text-2xl text-gray-500" />}</button>
                </div>
                <div
                    className="overflow-hidden transition-max-height duration-500 ease-in-out"
                    style={{ maxHeight: showPrice ? '100px' : "0px" }}
                >
                    <div className="flex items-center w-full mt-4">
                        <Input
                            placeholder="$ Min"
                            className="w-1/2"
                            value={tempPriceMin}
                            onChange={handleMinChange}
                            onKeyDown={handleKeyDown}
                        />
                        <GoDash className="text-4xl text-gray-400" />
                        <Input
                            placeholder="$ Max"
                            className="w-1/2"
                            value={tempPriceMax}
                            onChange={handleMaxChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}