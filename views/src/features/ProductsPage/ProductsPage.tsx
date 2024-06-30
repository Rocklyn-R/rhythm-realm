import { useParams } from "react-router-dom";

import { selectCategories, selectProducts, selectSubcategories, setProducts, setSubcategories } from "../../redux-store/ProductsSlice";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { getSubcategories } from "../../api/categories";
import { useDispatch } from "react-redux";
import { getProducts } from "../../api/products";
import { Product } from "../../types/types";
import { Products } from "./Products/Products";
import { RefineSearch } from "./RefineSearch/RefineSearch";
import { SortBy } from "./SortBy/SortBy";
import { getFeaturedDeals } from "../../api/products";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";


export const ProductsPage = () => {
    const { categoryName, subcategoryName } = useParams<{ categoryName: string, subcategoryName?: string }>();
    const allCategories = useSelector(selectCategories)
    const [id, setId] = useState<number>();
    const allSubcategories = useSelector(selectSubcategories);
    const dispatch = useDispatch();
    const allProducts = useSelector(selectProducts);
    const [productVariantsMap, setProductVariantsMap] = useState<Record<string, Product[]>>({});
    const [uniqueProducts, setUniqueProducts] = useState(Object.values(productVariantsMap).map(variants => variants[0]))
    const [displayValue, setDisplayValue] = useState(24);

    const formattedSubcategoryName = subcategoryName ? subcategoryName : "";
    const [sorting, setSorting] = useState("Best Match");
    const [currentPage, setCurrentPage] = useState(1);

  

    useEffect(() => {
        if (allCategories) {
            setId(allCategories.find(item => item.name === categoryName)!.id)
        }
    }, [allCategories, categoryName])

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
        const fetchSubcategories = async () => {
            if (id) {
                const subcategoryData = await getSubcategories(id);
                if (subcategoryData) {
                    dispatch(setSubcategories(subcategoryData))
                }
            }

        }
        if (allSubcategories.length === 0) {
            fetchSubcategories();
        }
    }, [dispatch, id, allSubcategories.length]);


    useEffect(() => {
        const fetchProducts = async () => {
            dispatch(setProducts([])); // Clear previous products while fetching new ones
            const productsData: Product[] = await getProducts(formattedSubcategoryName);
            if (productsData) {
                dispatch(setProducts(productsData));
            }
        };

        const fetchDeals = async () => {
            console.log("RUNS")
            if (subcategoryName === "Sale") {
                const result = await getFeaturedDeals("On Sale");
                if (result) {
                    dispatch(setProducts(result));
                }
            } else if (subcategoryName === "New Arrivals") {
                const result = await getFeaturedDeals("New Arrival");
                if (result) {
                    dispatch(setProducts(result));
                }
            }
        }
        if (categoryName === 'Featured') {
            fetchDeals();
        } else {
            fetchProducts();
        }



    }, [dispatch, formattedSubcategoryName, categoryName]);

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const totalPages = Math.ceil(uniqueProducts.length / displayValue);
    const indexOfLastProduct = currentPage * displayValue;
    const indexOfFirstProduct = indexOfLastProduct - displayValue;
    const currentProducts = uniqueProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  
    return (
        <div className="flex flex-col mb-14">
            <h2 className="text-3xl text-center font-bold">{formattedSubcategoryName}:</h2>
            <div className="flex space-between ">
                <RefineSearch
                    products={uniqueProducts}
                    subcategoryName={formattedSubcategoryName}
                />
                <div className="flex flex-col w-3/4">
                    <SortBy
                        uniqueProducts={uniqueProducts}
                        sorting={sorting}
                        setSorting={setSorting}
                        setDisplayValue={setDisplayValue}
                        displayValue={displayValue}
                        setCurrentPage={setCurrentPage}
                    />
                    <Products
                        uniqueProducts={currentProducts} // Render current page products
                        productVariantsMap={productVariantsMap}
                        sortedProducts={uniqueProducts} // Pass all uniqueProducts for sorting purposes
                    />
                </div>
            </div>
            <div className="bg-white flex w-full justify-center space-x-2 py-8 mt-2 border-t border-b border-gray-300">
                <button className={`flex items-center ${currentPage === 1 ? 'text-gray-400' : ''}`} onClick={handlePreviousPage} disabled={currentPage === 1}><IoCaretBack className="mr-2" />Previous</button>
                {/* Render page number buttons */}
                {Array.from({ length: totalPages }, (_, index) => (
                    <button className={`px-2 rounded-md ${currentPage === index + 1 ? 'bg-red-800 text-white' : ""}`} key={index + 1} onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                    </button>
                ))}
                <button className="flex items-center" onClick={handleNextPage} disabled={currentPage === totalPages}>Next<IoCaretForward className="ml-2" /></button>
            </div>
        </div>
    );
};