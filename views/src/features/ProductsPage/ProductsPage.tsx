import { Link, useLocation, useParams } from "react-router-dom";
import { formatCategoryNameForDisplay, formatPrice } from "../../utilities/utilities";
import { selectCategories, selectProducts, selectSubcategories, setProducts, setSelectedProduct, setSubcategories } from "../../redux-store/ProductsSlice";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { getSubcategories } from "../../api/categories";
import { useDispatch } from "react-redux";
import { getProducts } from "../../api/products";
import { Product } from "../../types/types";
import { Products } from "./Products/Products";
import { RefineSearch } from "./RefineSearch/RefineSearch";
import { SortBy } from "./SortBy/SortBy";


export const ProductsPage = () => {
    const { categoryName, subcategoryName } = useParams<{ categoryName: string, subcategoryName?: string }>();
    const allCategories = useSelector(selectCategories)
    const id = allCategories.find(item => item.name === categoryName)!.id;
    const allSubcategories = useSelector(selectSubcategories);
    const dispatch = useDispatch();
    const allProducts = useSelector(selectProducts);
    const productVariantsMap = allProducts.reduce((acc: Record<string, Product[]>, product: Product) => {
        if (!acc[product.id]) {
            acc[product.id] = [];
        }
        acc[product.id].push(product);
        return acc;
    }, {});
   
    let uniqueProducts = Object.values(productVariantsMap).map(variants => variants[0]);

   
    const formattedSubcategoryName = subcategoryName ? formatCategoryNameForDisplay(subcategoryName) : "";
    const [sorting, setSorting] = useState("Best Match");
   

    const sortProducts = (products: Product[], sortingType = "Best match") => {
        return products.slice().sort((a, b) => {
            switch (sortingType) {
                case "Best match":
                    return a.id - b.id; // Sort by ID ascending
                case "Price - Low to High":
                    return parseFloat(a.price) - parseFloat(b.price); // Sort by price ascending
                case "Price - High to Low":
                    return parseFloat(b.price) - parseFloat(a.price); // Sort by price descending
                case "Brand Name A-Z":
                    if (a.manufacturer < b.manufacturer) return -1; // Sort by manufacturer name ascending
                    if (a.manufacturer > b.manufacturer) return 1;
                    return 0; // Treat as equal if manufacturer names are the same
                default:
                    return 0; // No sorting
            }
        });
    };

    let sortedProducts = sortProducts(uniqueProducts, sorting);

    useEffect(() => {
        const fetchSubcategories = async () => {
            const subcategoryData = await getSubcategories(id);
            if (subcategoryData) {
                dispatch(setSubcategories(subcategoryData))
            }
        }
        if (allSubcategories.length === 0) {
            fetchSubcategories();
        }
    }, [dispatch]);


    useEffect(() => {
        const fetchProducts = async () => {
            dispatch(setProducts([])); // Clear previous products while fetching new ones
            const productsData: Product[] = await getProducts(formattedSubcategoryName);
            if (productsData) {
                dispatch(setProducts(productsData));
            }
        };
        fetchProducts();
    }, [dispatch, formattedSubcategoryName]);


    return (
        <div className="flex flex-col">
            <h2 className="text-3xl text-center font-bold mb-6">{formattedSubcategoryName}:</h2>
            <div className="flex space-between">
                <RefineSearch />
                <div className="flex flex-col w-3/4">
                    <SortBy 
                        uniqueProducts={uniqueProducts}
                        sorting={sorting}
                        setSorting={setSorting}
                    />
                    <Products
                        uniqueProducts={uniqueProducts}
                        productVariantsMap={productVariantsMap}
                        sortedProducts={sortedProducts}
                    />
                </div>

            </div>
        </div>
    )
}