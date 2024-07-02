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
import { 
    selectManufacturersFilter, 
    selectPriceDrop, 
    selectSelectedManufacturers, 
    setManufacturers, 
    setSelectedManufacturers, 
    setPriceDrop, 
    selectPriceMin,
    setPriceMin,
    selectPriceMax,
    setPriceMax,
    selectCategoriesFilter,
    setCategories,
    selectSelectedCategories,
    setSelectedCategories,
    selectSubcategoriesFilter,
    setSubcategories,
    selectSelectedSubcategories,
    setSelectedSubcategories
} from "../../../redux-store/FiltersSlice";


interface RefineSearchProps {
    products: Product[];
    subcategoryName: string;
}

export const RefineSearch: React.FC<RefineSearchProps> = ({ products, subcategoryName }) => {
    //const [manufacturers, setManufacturers] = useState<string[]>([])
    const manufacturers = useSelector(selectManufacturersFilter);
    //const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const selectedBrands = useSelector(selectSelectedManufacturers);
    //const [priceDrop, setPriceDrop] = useState(false);
    const priceDrop = useSelector(selectPriceDrop);
    const [showPriceDrop, setShowPriceDrop] = useState(true);
    const priceMin = useSelector(selectPriceMin);
    //const [priceMin, setPriceMin] = useState<string | undefined>(undefined);
    //const [priceMax, setPriceMax] = useState<string | undefined>(undefined);
    const priceMax = useSelector(selectPriceMax);
    const [tempPriceMin, setTempPriceMin] = useState<string>('');
    const [tempPriceMax, setTempPriceMax] = useState<string>('');
    const [showBrands, setShowBrands] = useState(false);
    const [showSavings, setShowSavings] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [isFeatured, setIsSale] = useState((subcategoryName === 'Sale') || subcategoryName === "New Arrivals");
    //const [categories, setCategories] = useState<string[]>([]);
    const categories = useSelector(selectCategoriesFilter);
    //const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const selectedCategories = useSelector(selectSelectedCategories);
    const [showCategories, setShowCategories] = useState(false);
    //const [subcategories, setSubcategories] = useState<string[]>([]);
    const subcategories = useSelector(selectSubcategoriesFilter);
    const [showSubcategories, setShowSubcategories] = useState(false);
    //const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const selectedSubcategories = useSelector(selectSelectedSubcategories);
    const allProducts = useSelector(selectProducts);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const dispatch = useDispatch();
    const [updatingFilters, setUpdatingFilters] = useState(true);
    const marketingLabel = subcategoryName === "Sale" ? "On Sale" :
    subcategoryName === "New Arrivals" ? "New Arrival" :
    "";

    const handleClearAll = () => {
        dispatch(setSelectedManufacturers([]));
        dispatch(setPriceDrop(false));
        dispatch(setPriceMin(undefined));
        dispatch(setPriceMax(undefined));
        setTempPriceMin("");
        setTempPriceMax("");
        dispatch(setSelectedCategories([]));
        dispatch(setSelectedSubcategories([]));
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
           dispatch(setSelectedManufacturers(selectedBrands.filter(b => b !== brand)));
        } else {
            dispatch(setSelectedManufacturers([...selectedBrands, brand]));
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
                dispatch(setManufacturers(result));
            }
        }
        const featuredManufacturersFetch = async () => {
            const result: string[] = await getFeaturedItemManufacturers(marketingLabel, selectedCategories, selectedSubcategories, priceMin, priceMax);
            if (result) {
                dispatch(setManufacturers(result));
            }
        }
        if (!isFeatured && updatingFilters) {
            manufacturersFetch();
           setUpdatingFilters(false);
        } else if (isFeatured && updatingFilters) {
            console.log("RUNS")
            featuredManufacturersFetch();
            setUpdatingFilters(false);
        }


    }, [dispatch, marketingLabel, updatingFilters, priceDrop, isFeatured, selectedCategories, selectedSubcategories, subcategoryName, priceMin, priceMax]);

    useEffect(() => {

        const filteredProductsFetch = async () => {
            const result = await getProducts(subcategoryName, selectedBrands, priceDrop, priceMin, priceMax);
            if (result) {
                dispatch(setProducts(result))
            }
        }

        const filteredSaleProductsFetch = async () => {
            const result = await getFeaturedDeals(marketingLabel, selectedCategories, selectedSubcategories, selectedBrands, priceDrop, priceMin, priceMax);
            if (result) {
                dispatch(setProducts(result))
            }
        }
        if (!isFeatured) {
            filteredProductsFetch();
        }
        if (isFeatured) {
            filteredSaleProductsFetch();
        }
    }, [dispatch, marketingLabel, isFeatured, selectedCategories, selectedSubcategories, selectedBrands, priceDrop, priceMin, priceMax, subcategoryName]);

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        //console.log(value);
        if (!isNaN(Number(value))) {
            setTempPriceMin(value);
        }
        if (value === "") {
            setTempPriceMin("")
            dispatch(setPriceMin(undefined));
        }
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isNaN(Number(value))) {
            setTempPriceMax(value);
        }
        if (value === "") {
            setTempPriceMax("");
            dispatch(setPriceMax(undefined));
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (tempPriceMin === "") {
                dispatch(setPriceMin(undefined))
            } else {
                dispatch(setPriceMin(tempPriceMin));
            }
            if (tempPriceMax === "") {
                dispatch(setPriceMax(undefined))
            } else {
                dispatch(setPriceMax(tempPriceMax));
            }
        }
    };

    useEffect(() => {
        if (!updatingFilters) {
            return;
        }
        const fetchCategories = async () => {
            
            const result = await getFeaturedCategories(marketingLabel, selectedBrands, priceMin, priceMax);
            console.log(result);
            if (result) {
                dispatch(setCategories(result));
            }
        }
        if (isFeatured && updatingFilters) {
            fetchCategories();
              setUpdatingFilters(false);
        }
    }, [updatingFilters, marketingLabel, isFeatured, selectedBrands, priceMin, priceMax]);

    const handleSelectCategory = (category: string) => {
        setUpdatingFilters(true);
        if (selectedCategories.includes(category)) {
            dispatch(setSelectedCategories(selectedCategories.filter(b => b !== category)));
        } else {
            dispatch(setSelectedCategories([...selectedCategories, category]));
        }
    }

    const handleSelectSubcategory = (subcategory: string) => {
       setUpdatingFilters(true);
        if (selectedSubcategories.includes(subcategory)) {
            dispatch(setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcategory)));
        } else {
            dispatch(setSelectedSubcategories([...selectedSubcategories, subcategory]));
        }
    }

    useEffect(() => {
        if (!updatingFilters) {
            return;
        }
        const fetchSubcategories = async () => {
            let result: string[];
            if (selectedCategories.length > 0) {
                result = await getFeaturedSubcategories(marketingLabel, selectedCategories, selectedBrands, priceMin, priceMax);
                console.log(result);
            } else {
                result = await getFeaturedSubcategories(marketingLabel);
            }
            if (result) {
                dispatch(setSubcategories(result));
            }
        }
        if (updatingFilters) {
            fetchSubcategories();
           setUpdatingFilters(false);
            
        }
        console.log("Fetching");
    }, [selectedCategories, marketingLabel, selectedBrands, priceMin, priceMax]);

    useEffect(() => {
        if (updatingFilters) {
            return;
        }
        if (!updatingFilters) {
            const filteredSubcategories = selectedSubcategories.filter(subcategory => subcategories.includes(subcategory));
            dispatch(setSelectedSubcategories(filteredSubcategories));
        }
           
    }, [updatingFilters]);

      useEffect(() => {
        if (updatingFilters) {
            return;
        }
        if (!updatingFilters) {
            const filteredBrands = selectedBrands.filter(brand => manufacturers.includes(brand));
            dispatch(setSelectedManufacturers(filteredBrands));
        }
          
      }, [updatingFilters])

    const handleClearPriceMinMax = () => {
        setTempPriceMin("");
        dispatch(setPriceMin(undefined));
        setTempPriceMax("");
        dispatch(setPriceMax(undefined));
    }


    return (
       <> <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold">Refine Your Search</h4>
                {isFilterActive && <button onClick={() => handleClearAll()} className="ml-1 text-red-800 text-sm hover:underline">(Clear All)</button>}
            </div>

            {isFeatured && (
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
            {isFeatured && selectedCategories.length > 0 && (
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

            {!isFeatured && showPriceDrop && (
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
                                onChange={() => dispatch(setPriceDrop(!priceDrop))}
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
       </>
           
    )
}