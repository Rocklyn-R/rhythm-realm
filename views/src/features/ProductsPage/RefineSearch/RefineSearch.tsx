import { Input } from "antd";
import { useEffect, useCallback, useState, ChangeEvent, KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { getFeaturedDeals, getProducts } from "../../../api/products";
import { selectProducts, setProducts } from "../../../redux-store/ProductsSlice";
import { Product, ProductResult } from "../../../types/types";
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
    setSelectedSubcategories,
    clearFilters,
    selectProductsForFilters
} from "../../../redux-store/FiltersSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { selectSearchResultProducts } from "../../../redux-store/SearchSlice";
import { sortCategoriesArray } from "../../../utilities/utilities";

interface RefineSearchProps {
    products: Product[];
    subcategoryName: string;
    brand: string;
    searchTerm: string;
    setCurrentPage: (arg0: number) => void;
}

export const RefineSearch: React.FC<RefineSearchProps> = ({ setCurrentPage, searchTerm, brand, subcategoryName }) => {
    const manufacturers = useSelector(selectManufacturersFilter);
    const selectedBrands = useSelector(selectSelectedManufacturers);
    const priceDrop = useSelector(selectPriceDrop);
    const [showPriceDrop, setShowPriceDrop] = useState(true);
    const priceMin = useSelector(selectPriceMin);
    const priceMax = useSelector(selectPriceMax);
    const [tempPriceMin, setTempPriceMin] = useState<string>("");
    const [tempPriceMax, setTempPriceMax] = useState<string>("");
    const [showBrands, setShowBrands] = useState(brand ? true : false);
    const [showSavings, setShowSavings] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const isFeatured = subcategoryName === 'Sale' || subcategoryName === "New Arrivals" || subcategoryName === "Top Sellers";
    const categories = useSelector(selectCategoriesFilter);
    const selectedCategories = useSelector(selectSelectedCategories);
    const [showCategories, setShowCategories] = useState(false);
    const subcategories = useSelector(selectSubcategoriesFilter);
    const [showSubcategories, setShowSubcategories] = useState(false);
    const selectedSubcategories = useSelector(selectSelectedSubcategories);
    const allProducts = useSelector(selectProducts);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const dispatch = useDispatch();
    const [updatingFilters, setUpdatingFilters] = useState(true);
    const marketingLabel = subcategoryName === "Sale" ? "On Sale" :
        subcategoryName === "New Arrivals" ? "New Arrival" : subcategoryName === "Top Sellers" ? "Top Seller" : "";
    const navigate = useNavigate();
    const { categoryName } = useParams();
    const searchResultProducts = useSelector(selectSearchResultProducts);
    const location = useLocation();
    const productsForFilters = useSelector(selectProductsForFilters);



    useEffect(() => {
        setUpdatingFilters(true);
    }, [location]);

    useEffect(() => {
        if (priceMin) {
            setTempPriceMin(priceMin);
        } else {
            setTempPriceMin("")
        }
        if (priceMax) {
            setTempPriceMax(priceMax);
        } else {
            setTempPriceMax("")
        }
    }, [priceMin, priceMax]);

    useEffect(() => {
        if (selectedCategories.length > 0) {
            setShowCategories(true)
        }
        if (selectedSubcategories.length > 0) {
            setShowSubcategories(true);
        }
        if (selectedBrands.length > 0) {
            setShowBrands(true);
        }
        if (priceMin || priceMax) {
            setShowPrice(true)
        }
        if (priceDrop) {
            setShowPriceDrop(true)
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleClearAll = useCallback((clearBrandParameter: boolean) => {
        if (brand && clearBrandParameter) {
            navigate(`/${categoryName}/${subcategoryName}/`)
        }
        setUpdatingFilters(true);
        dispatch(clearFilters());
        setTempPriceMin("");
        setTempPriceMax("");
        setCurrentPage(1);
    }, [brand, navigate, categoryName, subcategoryName, dispatch, setTempPriceMin, setTempPriceMax, setCurrentPage, setUpdatingFilters]);

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


    const handleSelectBrand = (manufacturer: string) => {
        setCurrentPage(1);
        setUpdatingFilters(true);
        if (selectedBrands.includes(manufacturer)) {
            if (brand) {
                navigate(`/${categoryName}/${subcategoryName}/`)
            }
            dispatch(setSelectedManufacturers(selectedBrands.filter(b => b !== manufacturer)));
        } else {
            dispatch(setSelectedManufacturers([...selectedBrands, manufacturer]));
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

    const getManufacturers = (product: (Product | ProductResult)[]) => {
        const uniqueBrands = Array.from(
            new Set(
                product
                    .filter(product =>
                        (selectedCategories.length === 0 || selectedCategories.includes(product.category_name)) &&
                        (selectedSubcategories.length === 0 || selectedSubcategories.includes(product.subcategory_name)) &&
                        (!priceDrop || product.sale_price) &&
                        (!priceMin || ((product.sale_price !== null ? parseFloat(product.sale_price) : parseFloat(product.price)) >= parseFloat(priceMin))) &&
                        (!priceMax || ((product.sale_price !== null ? parseFloat(product.sale_price) : parseFloat(product.price)) <= parseFloat(priceMax)))
                    )
                    .map(product => product.manufacturer)
            )
        ).sort((a, b) => a.localeCompare(b));          
        dispatch(setManufacturers(uniqueBrands));
        if (brand) {
            dispatch(setSelectedManufacturers([brand]));
        }
    }

    const getCategories = useCallback((products: Product[] | ProductResult[]) => {
        const uniqueCategories = Array.from(
            new Set(products.map(result => result.category_name))
        );
        dispatch(setCategories(sortCategoriesArray(uniqueCategories)));
    }, [dispatch])

    const fetchSubcategories = useCallback((products: (Product | ProductResult)[]) => {
        const uniqueSubcategories = Array.from(
            new Set(
                products.filter(product => selectedCategories.includes(product.category_name) &&
                    (selectedBrands.length === 0 || selectedBrands.includes(product.manufacturer)) &&
                    (!priceDrop || product.sale_price) &&
                    (!priceMin || ((product.sale_price !== null ? parseFloat(product.sale_price) : parseFloat(product.price)) >= parseFloat(priceMin))) &&
                    (!priceMax || ((product.sale_price !== null ? parseFloat(product.sale_price) : parseFloat(product.price)) <= parseFloat(priceMax)))
                )
                    .map(product => product.subcategory_name)
            )
        );
        dispatch(setSubcategories(uniqueSubcategories));
    }, [dispatch, priceDrop, priceMax, priceMin, selectedBrands, selectedCategories])

    useEffect(() => {
        if (!searchTerm) {
            getCategories(productsForFilters);
            getManufacturers(productsForFilters)
            setUpdatingFilters(false);

        }
        if (searchTerm) {
            getCategories(searchResultProducts);
            getManufacturers(searchResultProducts)
            setUpdatingFilters(false);
    
    
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsForFilters, searchResultProducts, searchTerm])

    useEffect(() => {
        if (!updatingFilters) {
            return;
        }

        if (!isFeatured && updatingFilters && !searchTerm) {
            getManufacturers(productsForFilters);
            setUpdatingFilters(false);
        } else if (isFeatured && updatingFilters && !searchTerm) {
            getManufacturers(productsForFilters);
            setUpdatingFilters(false);
        }
        if (searchTerm && updatingFilters) {
            getManufacturers(searchResultProducts);
            setUpdatingFilters(false);
        }
 // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, brand, marketingLabel, updatingFilters, priceDrop, isFeatured, selectedCategories, selectedSubcategories, subcategoryName, priceMin, priceMax]);


    useEffect(() => {
        if (brand) {
            handleClearAll(false);
            dispatch(setSelectedManufacturers([brand]));
            setShowBrands(true);
        } else {
            handleClearAll(false);
            dispatch(setSelectedManufacturers([]));
        }
        
    }, [brand, dispatch, handleClearAll]);

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
        if (!isFeatured && !searchTerm) {
            filteredProductsFetch();

        }
        if (isFeatured && !searchTerm) {
            filteredSaleProductsFetch();

        }
        if (searchTerm) {
            const filteredProducts = searchResultProducts.filter(product =>
                (selectedCategories.length === 0 || selectedCategories.includes(product.category_name)) &&
                (selectedSubcategories.length === 0 || selectedSubcategories.includes(product.subcategory_name)) &&
                (selectedBrands.length === 0 || selectedBrands.includes(product.manufacturer)) &&
                (!priceDrop || product.sale_price) &&
                (!priceMin || ((product.sale_price !== null ? parseFloat(product.sale_price) : parseFloat(product.price)) >= parseFloat(priceMin))) &&
                (!priceMax || ((product.sale_price !== null ? parseFloat(product.sale_price) : parseFloat(product.price)) <= parseFloat(priceMax)))
            )
            dispatch(setProducts(filteredProducts));

        }

    }, [dispatch, searchTerm, searchResultProducts, marketingLabel, isFeatured, selectedCategories, selectedSubcategories, selectedBrands, priceDrop, priceMin, priceMax, subcategoryName]);

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isNaN(Number(value))) {
            setTempPriceMin(value);
        }
        if (value === "") {
            setTempPriceMin("")
            dispatch(setPriceMin(undefined));
        }
        setCurrentPage(1);
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
        setCurrentPage(1);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (tempPriceMin === "") {
                dispatch(setPriceMin(undefined))
                setCurrentPage(1);
            } else {
                dispatch(setPriceMin(tempPriceMin));
                setCurrentPage(1);
            }
            if (tempPriceMax === "") {
                dispatch(setPriceMax(undefined))
                setCurrentPage(1);
            } else {
                dispatch(setPriceMax(tempPriceMax));
                setCurrentPage(1);
            }
        }
    };

    useEffect(() => {
        if (!updatingFilters) {
            return;
        }

        if (isFeatured && updatingFilters && !searchTerm) {
            getCategories(productsForFilters);
            setUpdatingFilters(false)
        }
        if (searchTerm && updatingFilters) {
            getCategories(searchResultProducts);
            setUpdatingFilters(false)
        }

    }, [searchTerm, productsForFilters, getCategories, location, searchResultProducts, updatingFilters, marketingLabel, isFeatured, selectedBrands, priceMin, priceMax]);

    const handleSelectCategory = (category: string) => {
        setCurrentPage(1);
        setUpdatingFilters(true);
        if (selectedCategories.includes(category)) {
            dispatch(setSelectedCategories(selectedCategories.filter(b => b !== category)));
        } else {
            dispatch(setSelectedCategories([...selectedCategories, category]));
        }
    }

    const handleSelectSubcategory = (subcategory: string) => {
        setCurrentPage(1);
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

        if (updatingFilters && !searchTerm) {
            fetchSubcategories(productsForFilters);
            setUpdatingFilters(false);
        }
        if (updatingFilters && searchTerm) {
            fetchSubcategories(searchResultProducts);
            setUpdatingFilters(false);
        }


    }, [selectedCategories, productsForFilters, searchResultProducts, fetchSubcategories, searchTerm, updatingFilters, marketingLabel, selectedBrands, priceMin, priceMax]);

    useEffect(() => {
        if (updatingFilters) {
            return;
        }
        if (!updatingFilters) {
            const filteredSubcategories = selectedSubcategories.filter(subcategory => subcategories.includes(subcategory));
            dispatch(setSelectedSubcategories(filteredSubcategories));
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatingFilters]);

    useEffect(() => {
        if (updatingFilters) {
            return;
        }
        if (!updatingFilters) {
            const filteredBrands = selectedBrands.filter(brand => manufacturers.includes(brand));
            dispatch(setSelectedManufacturers(filteredBrands));
        }
  // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatingFilters])

    useEffect(() => {
        if (updatingFilters) {
            return;
        }
        if (!updatingFilters) {
            const filteredCategories = selectedCategories.filter(category => categories.includes(category));
            dispatch(setSelectedCategories(filteredCategories))
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatingFilters]);

    const handleClearPriceMinMax = () => {
        setTempPriceMin("");
        dispatch(setPriceMin(undefined));
        setTempPriceMax("");
        dispatch(setPriceMax(undefined));
        setCurrentPage(1);
    }


    return (
        <> <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold">Refine Your Search</h4>
            {isFilterActive && <button onClick={() => handleClearAll(true)} className="ml-1 text-red-800 text-sm hover:underline">(Clear All)</button>}
        </div>

            {(isFeatured || searchTerm) && (
                <div className="border-t-2 border-gray-200 py-4">
                    <div className="flex items-center justify-between w-full">
                        <h4 className="font-semibold">Category</h4>
                        <button onClick={() => setShowCategories(!showCategories)}>{showCategories ? <GoDash className="text-2xl text-gray-500" /> : <GoPlus className="text-2xl text-gray-500" />}</button>
                    </div>
                    <div
                        className="overflow-hidden transition-max-height duration-500 ease-in-out"
                        style={{ maxHeight: showCategories ? `${categories.length * 40}px` : "0px" }}
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
            {(((isFeatured && selectedCategories.length > 0) || (selectedCategories.length > 0 && searchTerm)) && (subcategories.length > 1)) && (
                <div className="border-t-2 border-gray-200 py-4">
                    <div className="flex items-center justify-between w-full">
                        <h4 className="font-semibold">Subcategory</h4>
                        <button onClick={() => setShowSubcategories(!showSubcategories)}>{showSubcategories ? <GoDash className="text-2xl text-gray-500" /> : <GoPlus className="text-2xl text-gray-500" />}</button>
                    </div>
                    <div
                        className="overflow-hidden transition-max-height duration-500 ease-in-out"
                        style={{ maxHeight: showSubcategories ? `${subcategories.length * 40}px` : "0px" }}
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
            {manufacturers.length > 1 && (
                <div className="border-t-2 border-gray-200 py-4 w-full">
                    <div className="flex items-center justify-between w-full">
                        <h4 className="font-semibold">Brand</h4>
                        <button onClick={() => setShowBrands(!showBrands)}>{showBrands ? <GoDash className="text-2xl text-gray-500" /> : <GoPlus className="text-2xl text-gray-500" />}</button>
                    </div>
                    <div
                        className="overflow-hidden transition-max-height duration-500 ease-in-out"
                        style={{ maxHeight: showBrands ? `${manufacturers.length * 40}px` : "0px" }}
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
                                onChange={() => {
                                    dispatch(setPriceDrop(!priceDrop));
                                    setCurrentPage(1);
                                    setUpdatingFilters(true);
                                }}
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
                        {(priceMin || priceMax) && <button onClick={() => handleClearPriceMinMax()} className="ml-1 text-red-800 text-sm hover:underline">(Clear)</button>}
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