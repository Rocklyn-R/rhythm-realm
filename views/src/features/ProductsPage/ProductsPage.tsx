import { useParams } from "react-router-dom";
import { X } from "lucide-react";
import { selectProducts, setProducts } from "../../redux-store/ProductsSlice";
import { useSelector } from "react-redux";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { getProducts } from "../../api/products";
import { Product } from "../../types/types";
import { Products } from "./Products/Products";
import { RefineSearch } from "./RefineSearch/RefineSearch";
import { SortBy } from "./SortBy/SortBy";
import { getFeaturedDeals } from "../../api/products";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import {
    setProductsForFilters
} from "../../redux-store/FiltersSlice";
import { LoadingProducts } from "./Loading/Loading";


interface ProductsPageProps {
    brand: string;
    searchTerm: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ searchTerm, brand }) => {
    const { categoryName, subcategoryName } = useParams<{ categoryName: string, subcategoryName?: string }>();
    const dispatch = useDispatch();
    const allProducts = useSelector(selectProducts);
    const [productVariantsMap, setProductVariantsMap] = useState<Record<string, Product[]>>({});
    const [uniqueProducts, setUniqueProducts] = useState(Object.values(productVariantsMap).map(variants => variants[0]))
    const [displayValue, setDisplayValue] = useState(24);
    const formattedSubcategoryName = subcategoryName ? subcategoryName : "";
    const [sorting, setSorting] = useState("Best Match");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFiltersSlider, setShowFiltersSlider] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (overlayRef.current && e.target === overlayRef.current) {
            setShowFiltersSlider(false);
        }
    };
    const [loadingProducts, setLoadingProducts] = useState(true);


    useEffect(() => {
        if (allProducts) {
            const newProductVariantsMap = allProducts.reduce((acc: Record<string, Product[]>, product: Product) => {
                if (!acc[product.id]) {
                    acc[product.id] = [];
                }
                acc[product.id].push(product);
                return acc;
            }, {});
            setProductVariantsMap(newProductVariantsMap);
            setUniqueProducts(sortProducts(Object.values(newProductVariantsMap).map(variants => variants[0]), sorting));
        }
    }, [allProducts, sorting]);


    const sortProducts = (products: Product[], sortingType = "Best match") => {
        return products.slice().sort((a, b) => {

            const getEffectivePrice = (product: Product) => product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.price);

            switch (sortingType) {
                case "Best match":
                    return a.id - b.id;
                case "Price - Low to High":
                    return getEffectivePrice(a) - getEffectivePrice(b);
                case "Price - High to Low":
                    return getEffectivePrice(b) - getEffectivePrice(a);
                case "Brand Name A-Z":
                    if (a.manufacturer < b.manufacturer) return -1;
                    if (a.manufacturer > b.manufacturer) return 1;
                    return 0;
                default:
                    return 0;
            }
        });
    };



    useEffect(() => {
        const fetchProducts = async () => {
            dispatch(setProducts([]));
            dispatch(setProductsForFilters([])) // Clear previous products while fetching new ones
            const productsData: Product[] = await getProducts(formattedSubcategoryName);
            if (productsData) {
                dispatch(setProducts(productsData));
                dispatch(setProductsForFilters(productsData))
            }
        };

        const fetchDeals = async () => {
            const marketingLabel = subcategoryName === "Sale" ? "On Sale" : subcategoryName === "New Arrivals" ? "New Arrival" : "Top Seller";
      
            const result = await getFeaturedDeals(marketingLabel);
      
            if (result) {
                dispatch(setProducts(result));
                dispatch(setProductsForFilters(result))
            }
        }


        if (categoryName === 'Featured') {
            fetchDeals();
        } else if (searchTerm) {
            return;
        } else {
            fetchProducts();
        }



    }, [dispatch, formattedSubcategoryName, categoryName, searchTerm, subcategoryName]);

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage])

    const totalPages = Math.ceil(uniqueProducts.length / displayValue);
    const indexOfLastProduct = currentPage * displayValue;
    const indexOfFirstProduct = indexOfLastProduct - displayValue;
    const currentProducts = uniqueProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const toggleBodyScroll = (enableScroll: boolean) => {
        const body = document.body;
        if (enableScroll) {
            body.classList.add('overflow-hidden');
        } else {
            body.classList.remove('overflow-hidden');
        }
    };

    // Toggle body scroll when the overlay is shown or hidden
    useEffect(() => {
        toggleBodyScroll(showFiltersSlider);
    }, [showFiltersSlider]);

    useEffect(() => {
        if (showFiltersSlider && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [showFiltersSlider]);

    return (
        <div className="flex flex-col mb-14">
            {formattedSubcategoryName ? (
                <h2 className="text-3xl text-center font-bold mb-6">{brand ? brand : ""} {formattedSubcategoryName}:</h2>
            ) : <h2 className="text-3xl text-center font-bold mb-6">Showing search results for "{searchTerm}":</h2>}
            <div className="flex space-between justify-center">
                <div className="md:block hidden w-1/4 p-4 bg-white rounded-md shadow-lg">
                    <RefineSearch
                        setLoadingProducts={setLoadingProducts}
                        setCurrentPage={setCurrentPage}
                        searchTerm={searchTerm}
                        brand={brand}
                        products={uniqueProducts}
                        subcategoryName={formattedSubcategoryName}
                    />
                </div>
                <div className="flex flex-col w-full md:w-3/4 h-full">
                    <SortBy
                        uniqueProducts={uniqueProducts}
                        sorting={sorting}
                        setSorting={setSorting}
                        setDisplayValue={setDisplayValue}
                        displayValue={displayValue}
                        setCurrentPage={setCurrentPage}
                        setShowFiltersSlider={setShowFiltersSlider}
                    />
                    {loadingProducts ? <LoadingProducts /> :

                        <Products
                            uniqueProducts={currentProducts} // Render current page products
                            productVariantsMap={productVariantsMap}
                            sortedProducts={uniqueProducts} // Pass all uniqueProducts for sorting purposes
                        />}

                </div>
            </div>

            <div className="bg-white flex w-full justify-center space-x-2 py-8 mt-2 shadow-md">
                <button className={`flex items-center ${currentPage === 1 ? 'text-gray-400' : ''}`} onClick={handlePreviousPage} disabled={currentPage === 1}><IoCaretBack className="mr-2" />Previous</button>
                {/* Render page number buttons */}
                {Array.from({ length: totalPages }, (_, index) => (
                    <button className={`px-2 rounded-md ${currentPage === totalPages ? "cursor-default" : "cursor-pointer"} ${currentPage === index + 1 ? 'bg-red-800 text-white' : ""}`} key={index + 1} onClick={() => setCurrentPage(index + 1)} >
                        {index + 1}
                    </button>
                ))}
                <button className={`flex items-center ${currentPage === totalPages ? 'text-gray-400' : ''}`} onClick={handleNextPage} disabled={currentPage === totalPages}>Next<IoCaretForward className="ml-2" /></button>
            </div>
            <div ref={overlayRef} className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${showFiltersSlider ? 'block' : 'hidden'}`} onClick={handleOverlayClick}></div>
            <div ref={scrollContainerRef} className={`fixed bottom-0 left-0 w-full h-3/4 bg-white transform ${showFiltersSlider ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300 ease-in-out z-50 overflow-scroll`}>
                <div className="sticky top-0 flex justify-between bg-red-800 p-4 w-full z-10">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={() => setShowFiltersSlider(false)}><X /></button>
                </div>
                <div className="p-10">
                    <RefineSearch
                        setLoadingProducts={setLoadingProducts}
                        setCurrentPage={setCurrentPage}
                        searchTerm={searchTerm}
                        brand={brand}
                        products={uniqueProducts}
                        subcategoryName={formattedSubcategoryName}
                    />
                </div>
            </div>
        </div>
    );
};