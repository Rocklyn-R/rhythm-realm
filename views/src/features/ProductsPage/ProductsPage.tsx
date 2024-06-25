import { Link, useLocation, useParams } from "react-router-dom";
import { formatCategoryNameForDisplay, formatPrice } from "../../utilities/utilities";
import { selectCategories, selectFeaturedDeals, selectProducts, selectSubcategories, setProducts, setSelectedProduct, setSubcategories } from "../../redux-store/ProductsSlice";
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
import { shuffleArray } from "../../utilities/utilities";

export const ProductsPage = () => {
    const { categoryName, subcategoryName } = useParams<{ categoryName: string, subcategoryName?: string }>();
    const allCategories = useSelector(selectCategories)
    const id = allCategories.find(item => item.name === categoryName)!.id;
    const allSubcategories = useSelector(selectSubcategories);
    const dispatch = useDispatch();
    const allProducts = useSelector(selectProducts);
    const [productVariantsMap, setProductVariantsMap] = useState<Record<string, Product[]>>({});
    const featuredDeals = useSelector(selectFeaturedDeals);
    const [uniqueProducts, setUniqueProducts] = useState(Object.values(productVariantsMap).map(variants => variants[0]))

   
    const formattedSubcategoryName = subcategoryName ? subcategoryName : "";
    const [sorting, setSorting] = useState("Best Match");

    useEffect(() => {
        if(allProducts) {
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

        const fetchDeals = async () => {
            const result = await getFeaturedDeals("On Sale");
            if (result) {
                dispatch(setProducts(result));
            }
        }
        if (categoryName === 'Featured') {
             fetchDeals();
        } else {
             fetchProducts();   
        }
       
        
        
    }, [dispatch, formattedSubcategoryName]);


    return (
        <div className="flex flex-col mb-14">
            <h2 className="text-3xl text-center font-bold mb-6">{formattedSubcategoryName}:</h2>
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
                    />
                    <Products
                        uniqueProducts={uniqueProducts}
                        productVariantsMap={productVariantsMap}
                        sortedProducts={uniqueProducts}
                    />
                </div>

            </div>
        </div>
    )
}