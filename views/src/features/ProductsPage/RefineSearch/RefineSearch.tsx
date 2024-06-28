import { Input } from "antd";
import { useEffect,useCallback, useState, ChangeEvent, KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { getFeaturedDeals, getManufacturers, getProducts, getFeaturedItemManufacturers } from "../../../api/products";
import { getFeaturedCategories, getFeaturedSubcategories } from "../../../api/categories";
import { selectProducts, setProducts } from "../../../redux-store/ProductsSlice";
import { Product } from "../../../types/types";
import { GoDash } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { useSelector } from "react-redux";


interface RefineSearchProps {
    products: Product[];
    subcategoryName: string;
}

export const RefineSearch: React.FC<RefineSearchProps> = ({ products, subcategoryName }) => {
    const [manufacturers, setManufacturers] = useState<string[]>([])
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceDrop, setPriceDrop] = useState(false);
    const [showPriceDrop, setShowPriceDrop] = useState(true);
    const [priceMin, setPriceMin] = useState<string | undefined>(undefined);
    const [priceMax, setPriceMax] = useState<string | undefined>(undefined);
    const [tempPriceMin, setTempPriceMin] = useState<string>('');
    const [tempPriceMax, setTempPriceMax] = useState<string>('');
    const [showBrands, setShowBrands] = useState(false);
    const [showSavings, setShowSavings] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [isSale, setIsSale] = useState(subcategoryName === 'Sale')
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [showCategories, setShowCategories] = useState(false);
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [showSubcategories, setShowSubcategories] = useState(false);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const allProducts = useSelector(selectProducts);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const dispatch = useDispatch();
    const [updatingFilters, setUpdatingFilters] = useState(true);

    const handleClearAll = () => {
        setSelectedBrands([]);
        setPriceDrop(false);
        setPriceMin(undefined);
        setPriceMax(undefined);
        setTempPriceMin("");
        setTempPriceMax("");
        setSelectedCategories([]);
        setSelectedSubcategories([]);
    }
    const checkFilters = useCallback(() => {
        const active =
            selectedBrands.length > 0 ||
            priceDrop !== false ||
            priceMin !== undefined ||
            priceMax !== undefined ||
            tempPriceMin !== "" ||
            tempPriceMax !== "" ||
            selectedCategories.length > 0 ||
            selectedSubcategories.length > 0;
    
        setIsFilterActive(active);
    }, [selectedBrands, priceDrop, priceMin, priceMax, tempPriceMin, tempPriceMax, selectedCategories, selectedSubcategories, setIsFilterActive]);

    useEffect(() => {
        checkFilters();
    }, [selectedBrands, checkFilters, priceDrop, priceMin, priceMax, tempPriceMin, tempPriceMax, selectedCategories, selectedSubcategories]);

   
    const handleSelectBrand = (brand: string) => {
       setUpdatingFilters(true);
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    }

    useEffect(() => {
        if (allProducts) {
            const saleItem = allProducts.find(product => product.sale_price !== null);
            if (!saleItem) {
                setShowPriceDrop(false);
            } else {
                setShowPriceDrop(true);
            }
        }
    }, [allProducts]);

    useEffect(() => {
        if (!updatingFilters) {
            return;
        }
        const manufacturersFetch = async () => {

            const result: string[] = await getManufacturers(subcategoryName, priceDrop, priceMin, priceMax);
            if (result) {
                setManufacturers(result);
            }
        }
        const featuredManufacturersFetch = async () => {
            const result: string[] = await getFeaturedItemManufacturers("On Sale", selectedCategories, selectedSubcategories, priceMin, priceMax);
            if (result) {
                setManufacturers(result);
            }
        }
        if (!isSale && updatingFilters) {
            manufacturersFetch();
           setUpdatingFilters(false);
        } else if (isSale && updatingFilters) {
            console.log("RUNS")
            featuredManufacturersFetch();
            setUpdatingFilters(false);
        }


    }, [dispatch, updatingFilters, priceDrop, isSale, selectedCategories, selectedSubcategories, subcategoryName, priceMin, priceMax]);

    useEffect(() => {

        const filteredProductsFetch = async () => {
            const result = await getProducts(subcategoryName, selectedBrands, priceDrop, priceMin, priceMax);
            if (result) {
                dispatch(setProducts(result))
            }
        }

        const filteredSaleProductsFetch = async () => {
            const result = await getFeaturedDeals("On Sale", selectedCategories, selectedSubcategories, selectedBrands, priceDrop, priceMin, priceMax);
            if (result) {
                dispatch(setProducts(result))
            }
        }
        if (!isSale) {
            filteredProductsFetch();
        }
        if (isSale) {
            filteredSaleProductsFetch();
        }
    }, [dispatch, isSale, selectedCategories, selectedSubcategories, selectedBrands, priceDrop, priceMin, priceMax, subcategoryName]);

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        //console.log(value);
        if (!isNaN(Number(value))) {
            setTempPriceMin(value);
        }
        if (value === "") {
            setTempPriceMin("")
            setPriceMin(undefined);
        }
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isNaN(Number(value))) {
            setTempPriceMax(value);
        }
        if (value === "") {
            setTempPriceMax("");
            setPriceMax(undefined);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (tempPriceMin === "") {
                setPriceMin(undefined)
            } else {
                setPriceMin(tempPriceMin);
            }
            if (tempPriceMax === "") {
                setPriceMax(undefined)
            } else {
                setPriceMax(tempPriceMax);
            }
        }
    };

    useEffect(() => {
        if (!updatingFilters) {
            return;
        }
        const fetchCategories = async () => {
            
            const result = await getFeaturedCategories("On Sale", selectedBrands, priceMin, priceMax);
            console.log(result);
            if (result) {
                setCategories(result);
            }
        }
        if (isSale && updatingFilters) {
            fetchCategories();
              setUpdatingFilters(false);
        }
    }, [updatingFilters, isSale, selectedBrands, priceMin, priceMax]);

    const handleSelectCategory = (category: string) => {
        setUpdatingFilters(true);
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(b => b !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    }

    const handleSelectSubcategory = (subcategory: string) => {
       setUpdatingFilters(true);
        if (selectedSubcategories.includes(subcategory)) {
            setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcategory));
        } else {
            setSelectedSubcategories([...selectedSubcategories, subcategory]);
        }
    }

    useEffect(() => {
        if (!updatingFilters) {
            return;
        }
        const fetchSubcategories = async () => {
            let result: string[];
            if (selectedCategories.length > 0) {
                result = await getFeaturedSubcategories("On Sale", selectedCategories, selectedBrands, priceMin, priceMax);
                console.log(result);
            } else {
                result = await getFeaturedSubcategories("On Sale");
            }
            if (result) {
                setSubcategories(result);
            }
        }
        if (updatingFilters) {
            fetchSubcategories();
           setUpdatingFilters(false);
            
        }
        console.log("Fetching");
    }, [selectedCategories, selectedBrands, priceMin, priceMax]);

    useEffect(() => {
        if (updatingFilters) {
            return;
        }
        if (!updatingFilters) {
            setSelectedSubcategories(prevSelectedSubcategories =>
                prevSelectedSubcategories.filter(subcategory => subcategories.includes(subcategory))
            );
            console.log("THIS RAN FIRST")
        }
    }, [updatingFilters]);

      useEffect(() => {
        if (updatingFilters) {
            return;
        }
        if (!updatingFilters) {
            setSelectedBrands(prevSelectedBrands =>
              prevSelectedBrands.filter(brand => manufacturers.includes(brand))
              );
        }
          
      }, [updatingFilters])

    const handleClearPriceMinMax = () => {
        setTempPriceMin("");
        setPriceMin(undefined);
        setTempPriceMax("");
        setPriceMax(undefined);
    }


    return (
        <div className="w-1/4 p-4 bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold">Refine Your Search</h4>
                {isFilterActive && <button onClick={() => handleClearAll()} className="ml-1 text-red-800 text-sm hover:underline">(Clear All)</button>}
            </div>

            {isSale && (
                <div className="border-t-2 border-gray-200 py-4">
                    <div className="flex items-center justify-between w-full">
                        <h4 className="font-semibold">Category</h4>
                        <button onClick={() => setShowCategories(!showCategories)}>{showCategories ? <GoDash className="text-2xl text-gray-500" /> : <GoPlus className="text-2xl text-gray-500" />}</button>
                    </div>
                    <div
                        className="overflow-hidden transition-max-height duration-500 ease-in-out"
                        style={{ maxHeight: showCategories ? '180px' : "0px" }}
                    >
                        <div className="flex flex-col items-start">
                            {categories.map(category => (
                                <div key={category} className="flex items-center my-2">
                                    <input
                                        type="checkbox"
                                        className="mr-3 w-6 h-6 custom-checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleSelectCategory(category)}
                                    />
                                    <label>{category}</label>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
            )}
            {isSale && selectedCategories.length > 0 && (
                <div className="border-t-2 border-gray-200 py-4">
                    <div className="flex items-center justify-between w-full">
                        <h4 className="font-semibold">Subcategory</h4>
                        <button onClick={() => setShowSubcategories(!showSubcategories)}>{showSubcategories ? <GoDash className="text-2xl text-gray-500" /> : <GoPlus className="text-2xl text-gray-500" />}</button>
                    </div>
                    <div
                        className="overflow-hidden transition-max-height duration-500 ease-in-out"
                        style={{ maxHeight: showSubcategories ? '600px' : "0px" }}
                    >
                        <div className="flex flex-col items-start">
                            {subcategories.map(subcategory => (
                                <div key={subcategory} className="flex items-center my-2">
                                    <input
                                        type="checkbox"
                                        className="mr-3 w-6 h-6 custom-checkbox"
                                        checked={selectedSubcategories.includes(subcategory)}
                                        onChange={() => handleSelectSubcategory(subcategory)}
                                    />
                                    <label>{subcategory}</label>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
            )}
            {manufacturers.length > 0 && (
                <div className="border-t-2 border-gray-200 py-4 w-full">
                    <div className="flex items-center justify-between w-full">
                        <h4 className="font-semibold">Brand</h4>
                        <button onClick={() => setShowBrands(!showBrands)}>{showBrands ? <GoDash className="text-2xl text-gray-500" /> : <GoPlus className="text-2xl text-gray-500" />}</button>
                    </div>
                    <div
                        className="overflow-hidden transition-max-height duration-500 ease-in-out"
                        style={{ maxHeight: showBrands ? '500px' : "0px" }}
                    >


                        <div className="flex flex-col items-start">
                            {manufacturers.map(brand => (
                                <div key={brand} className="flex items-center my-2">
                                    <input
                                        type="checkbox"
                                        className="mr-3 w-6 h-6 custom-checkbox"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => handleSelectBrand(brand)}
                                    />
                                    <label>{brand}</label>
                                </div>

                            ))}
                        </div>

                    </div>

                </div>
            )}

            {!isSale && showPriceDrop && (
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
                                onChange={() => setPriceDrop(!priceDrop)}
                            />
                            <label>Price drop</label>
                        </div>
                    </div>

                </div>
            )}

            <div className="border-t-2 border-b-2 border-gray-200 py-4 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <h4 className="font-semibold">Price</h4>
                        {priceMin && priceMax && <button onClick={() => handleClearPriceMinMax()} className="ml-1 text-red-800 text-sm hover:underline">(Clear)</button>}
                    </div>

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