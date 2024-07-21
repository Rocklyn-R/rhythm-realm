import { IoSearch } from "react-icons/io5";
import React, { useState, useEffect, useRef } from "react";
import { getProductSearchResults, getRecommendedProducts, getSearchByBrand, getSearchByProduct, getSearchSubcategories } from "../../api/search";
import { useDispatch, useSelector } from "react-redux";
import { selectProductResults, selectSubcategoryByBrandResults, selectSubcategoryResults, setProductsResults, setRecommendedProductResults, setSearchResultProducts, setSearchTermParams, setSubcategoryByBrandResults, setSubcategoryResults } from "../../redux-store/SearchSlice";
import { SearchResults } from "./SearchResults/SearchResults";
import { ProductResult, SubcategoryByBrand, SubcategoryResult } from "../../types/types";
import { useLocation, useNavigate } from "react-router-dom";
import { setLoadingProducts, setProducts } from "../../redux-store/ProductsSlice";
import { PayloadAction } from "@reduxjs/toolkit";

export const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerms, setSearchTerms] = useState<string[]>([]);
    const [debouncedSearchTerms, setDebouncedSearchTerms] = useState<string[]>([]);
    const dispatch = useDispatch();
    const currentSubcategoryResults = useSelector(selectSubcategoryResults);
    const currentProductResults = useSelector(selectProductResults);
    const currentByBrandResults = useSelector(selectSubcategoryByBrandResults);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchParameter = searchParams.get('searchTerm');
    const searchInputRef = useRef<HTMLInputElement>(null);
   
    useEffect(() => {
        if (searchParameter) {
            const decodedSearchParameter = decodeURIComponent(searchParameter);
            const termsArray = decodedSearchParameter.split(' ').filter(term => term.trim() !== '');
            dispatch(setSearchTermParams(termsArray));
        }
    }, [searchParameter, dispatch]);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (searchInputRef.current) {
            searchInputRef.current.blur();
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setSearchInput(input);
        const terms = input.split(' ').filter(term => term);
        setSearchTerms(terms);
    };

    useEffect(() => {
        // Debounce logic to set debouncedSearchTerms after 500ms of no typing
        const timerId = setTimeout(() => {
            if (searchTerms.length > 0 && searchTerms[0].length >= 3) {
                
                setDebouncedSearchTerms([...searchTerms]);
            } else {
                setDebouncedSearchTerms([]);
                dispatch(setSubcategoryByBrandResults([]));
                dispatch(setSubcategoryResults([]));
                dispatch(setProductsResults([]));
                dispatch(setRecommendedProductResults([]));
            }
        }, 500);

        return () => {
            clearTimeout(timerId); // Cleanup on component unmount or when searchTerms changes
        };
    }, [searchTerms, dispatch]);

    const clearOtherResults = (resultToKeep: string) => {
        if (resultToKeep === "none") {
            dispatch(setSubcategoryByBrandResults([]));
            dispatch(setRecommendedProductResults([]));
            dispatch(setProductsResults([]));
            dispatch(setSubcategoryResults([]));
        } else if (currentByBrandResults.length > 0 && resultToKeep !== 'bybrand') {
            dispatch(setSubcategoryByBrandResults([]));
            dispatch(setRecommendedProductResults([]));
        } else if (currentProductResults.length > 0 && resultToKeep !== 'products') {
            dispatch(setProductsResults([]));
            dispatch(setRecommendedProductResults([]));
        } else if (currentSubcategoryResults.length > 0 && resultToKeep !== 'subcategories') {
            dispatch(setSubcategoryResults([]));
            dispatch(setRecommendedProductResults([]));
        }
    }


    let brandNonmatchingTerm: string | undefined;
    const searchByManufacturer = async (
        searchType: "keywords" | "searchbar",
        searchTermIndex: number,
        termsToUse: string[],
        reducerToUse: (results: SubcategoryByBrand[]) => { type: string; payload: SubcategoryByBrand[] }) => {
        const byBrandResults: SubcategoryByBrand[] = await getSearchByBrand(termsToUse[searchTermIndex]);
        if (byBrandResults && byBrandResults.length > 0) {
            if (termsToUse.length > 1) {
                const newResults: SubcategoryByBrand[] = [];
                const filteredResults = byBrandResults.filter(result => {
                    // Check if all search terms (starting from index 1) are included in the result name or category_alt_name
                    const matchesAllTerms = termsToUse.every((term, index) => {
                        if (term === termsToUse[searchTermIndex]) {
                            newResults.push(result);
                            return true;
                        }
                        const lowerCaseTerm = term.toLowerCase();
                        if (result.subcategory_name.toLowerCase().includes(lowerCaseTerm)
                            || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.subcategory_alt_name?.toLowerCase().includes(lowerCaseTerm)) {
                            newResults.push(result);
                        }
                        return result.subcategory_name.toLowerCase().includes(lowerCaseTerm)
                            || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.subcategory_alt_name?.toLowerCase().includes(lowerCaseTerm);
                    });
                    if (!matchesAllTerms) {
                        brandNonmatchingTerm = termsToUse.find((term, index) => {
                            const lowerCaseTerm = term.toLowerCase();
                            const foundInNewResults = newResults.some(newResult =>
                                newResult.subcategory_name.toLowerCase().includes(lowerCaseTerm)
                                || (newResult.category_alt_name?.toLowerCase() || '').includes(lowerCaseTerm)
                                || (newResult.subcategory_alt_name?.toLowerCase() || '').includes(lowerCaseTerm)
                                || (newResult.manufacturer?.toLowerCase() || '').includes(lowerCaseTerm) // Added condition
                            );
                            return !foundInNewResults; // Term not found in newResults
                        });
                    }
                    return matchesAllTerms;
                });

                if (filteredResults.length > 0) {
                    if (filteredResults.length !== byBrandResults.length && searchType === "searchbar") {
                        clearOtherResults('bybrand');
                        dispatch(reducerToUse(filteredResults));
                    }
                    if (searchType === "keywords") {
                        clearOtherResults("none");
                        return filteredResults;
                    }
                    return true;
                } else {
                    return false;
                }
            } else {
                if (searchType === "searchbar") {
                    dispatch(reducerToUse(byBrandResults));
                    return true;
                } else {
                    clearOtherResults("none");
                    return byBrandResults;
                }
            }
        } else {
            brandNonmatchingTerm = termsToUse[termsToUse.length - 1];
            return false;
        }
    }

    const searchProducts = async (
        searchType: "keywords" | "searchbar",
        searchTermIndex: number,
        termsToUse: string[],
        reducerToUse: (results: ProductResult[]) => PayloadAction<ProductResult[]>) => {
        const productsResults: ProductResult[] = await getSearchByProduct(termsToUse[searchTermIndex]);
        if (productsResults.length > 0) {
            if (termsToUse.length > 1) {
                const newResults: ProductResult[] = [];
                const filteredResults = productsResults.filter(result => {
                    // Check if all search terms (starting from index 1) are included in the result name or category_alt_name
                    const matchesAllTerms = termsToUse.every((term, index) => {
                        if (term === termsToUse[searchTermIndex]) {
                            newResults.push(result);
                            return true;
                        }
                        const lowerCaseTerm = term.toLowerCase();
                        if (result.name.toLowerCase().includes(lowerCaseTerm)
                            || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.category_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.subcategory_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.subcategory_alt_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.manufacturer?.toLowerCase().includes(lowerCaseTerm)
                            || result.variant_name?.toLowerCase().includes(lowerCaseTerm)) {
                            newResults.push(result);
                        }
                        return result.name.toLowerCase().includes(lowerCaseTerm)
                            || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.category_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.subcategory_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.subcategory_alt_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.manufacturer?.toLowerCase().includes(lowerCaseTerm)
                            || result.variant_name?.toLowerCase().includes(lowerCaseTerm)
                    })
                    if (!matchesAllTerms) {
                        termsToUse.find((term, index) => {
                            const lowerCaseTerm = term.toLowerCase();
                            const foundInNewResults = newResults.some(newResult =>
                                newResult.subcategory_name.toLowerCase().includes(lowerCaseTerm)
                                || (newResult.category_alt_name?.toLowerCase() || '').includes(lowerCaseTerm)
                                || (newResult.subcategory_alt_name?.toLowerCase() || '').includes(lowerCaseTerm)
                                || (newResult.manufacturer?.toLowerCase() || '').includes(lowerCaseTerm) // Added condition
                            );
                            //clearOtherResults('products');
                            return !foundInNewResults; // Term not found in newResults
                        });
                    }
                    return matchesAllTerms;
                })
                if (((filteredResults.length !== productsResults.length) || (filteredResults.length !== newResults.length)) && searchType === "searchbar") {
                    clearOtherResults('products');
                    dispatch(reducerToUse(filteredResults));
                    return true;
                } else {
                    if (searchType === "searchbar") {
                        return true;
                    } else {
                        return filteredResults;
                    }

                }
            } else {
                if (searchType === "searchbar") {
                    clearOtherResults('products');
                    dispatch(reducerToUse(productsResults));
                    return true;
                } else {
                    return productsResults;
                }
            }
        } else {
            return false;
        }
    }

    let nonmatchingTerm: string | undefined;
    // Search Subcategories based on Subcategory name
    const searchSubcategories = async (
        searchType: "keywords" | "searchbar",
        termsToUse: string[],
        reducerToUse: (results: SubcategoryResult[]) => { type: string; payload: SubcategoryResult[] }) => {
        const subcategoryResults: SubcategoryResult[] = await getSearchSubcategories(termsToUse[0]);

        if (subcategoryResults && subcategoryResults.length > 0) {
            if (termsToUse.length > 1) {
                const newResults: SubcategoryResult[] = [];
                const filteredResults = subcategoryResults.filter(result => {
                    const matchesAllTerms = termsToUse.slice(1).every(term => {

                        const lowerCaseTerm = term.toLowerCase();
                        if (result.subcategory_name.toLowerCase().includes(lowerCaseTerm)
                            || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.subcategory_alt_name?.toLowerCase().includes(lowerCaseTerm)) {
                            newResults.push(result);
                        }
                        return result.subcategory_name.toLowerCase().includes(lowerCaseTerm)
                            || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm)
                            || result.subcategory_alt_name?.toLowerCase().includes(lowerCaseTerm);
                    });
                    if (!matchesAllTerms) {
                        nonmatchingTerm = termsToUse.slice(1).find(term => {
                            const lowerCaseTerm = term.toLowerCase();
                            const foundInNewResults = newResults.some(newResult =>
                                newResult.subcategory_name.toLowerCase().includes(lowerCaseTerm)
                                || (newResult.category_alt_name?.toLowerCase() || '').includes(lowerCaseTerm)
                                || (newResult.subcategory_alt_name?.toLowerCase() || '').includes(lowerCaseTerm)
                            );
                            return !foundInNewResults; // Term not found in newResults
                        });
                    }
                    return matchesAllTerms;
                });
                if (searchType === "searchbar") {
                    clearOtherResults("subcategories");
                    dispatch(reducerToUse(filteredResults));
                }


                if (filteredResults.length > 0) {
                    if (searchType === "searchbar") {
                        return true;
                    } else {
                        return filteredResults;
                    }
                } else {
                    return false;
                }
            } else {
                if (searchType === "searchbar") {
                    clearOtherResults('subcategories');
                    dispatch(reducerToUse(subcategoryResults));
                    return true;
                } else {
                    clearOtherResults("none");
                    return subcategoryResults;
                }
            }
        } else {
            nonmatchingTerm = termsToUse[0];
            return false;
        }
    }

    const searchRecommendedProducts = async (results: SubcategoryByBrand[] | SubcategoryResult[]) => {
        const brand = ('manufacturer' in results[0]) ? (results as SubcategoryByBrand[])[0].manufacturer : undefined;
        const subcategories = results.map(result => result.subcategory_name);

        const searchRecommended = await getRecommendedProducts(subcategories, brand);

        if (searchRecommended) {
            dispatch(setRecommendedProductResults(searchRecommended));
        }
    }

    useEffect(() => {
        if (currentByBrandResults.length > 0) {
            searchRecommendedProducts(currentByBrandResults);
        } else {
            setRecommendedProductResults([]);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentByBrandResults]);

    useEffect(() => {
        if (currentSubcategoryResults.length > 0) {
            searchRecommendedProducts(currentSubcategoryResults);
        }
        else {
            setRecommendedProductResults([]);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSubcategoryResults]);

    useEffect(() => {

        //Perform Search
        const performSearch = async () => {
            if (debouncedSearchTerms.length > 0) {
                const brandSearch = await searchByManufacturer("searchbar", 0, debouncedSearchTerms, setSubcategoryByBrandResults);
                if (!brandSearch) {
                    const subcatSearch = await searchSubcategories("searchbar", debouncedSearchTerms, setSubcategoryResults);
                    if (!subcatSearch) {
                        const nonmatchingIndex = debouncedSearchTerms.indexOf(nonmatchingTerm!);
                        const newBrandSearch = await searchByManufacturer("searchbar", nonmatchingIndex, debouncedSearchTerms, setSubcategoryByBrandResults);
                        if (!newBrandSearch) {
                            const brandNonmatchingIndex = debouncedSearchTerms.indexOf(brandNonmatchingTerm!);
                            await searchProducts("searchbar", brandNonmatchingIndex, debouncedSearchTerms, setProductsResults);
                        }
                    }
                }
            } else {
                dispatch(setSubcategoryResults([]));
                dispatch(setSubcategoryByBrandResults([]));
                dispatch(setProductsResults([]));
            }
        }

        performSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerms]);

    const searchProductsBasedOnSearch = async (results: SubcategoryByBrand[] | SubcategoryResult[]) => {
        const brand = ('manufacturer' in results[0]) ? (results as SubcategoryByBrand[])[0].manufacturer : undefined;
        const subcategories = results.map(result => result.subcategory_name);
        const productSearchResults = await getProductSearchResults(subcategories, brand);
        if (productSearchResults) {
            dispatch(setProducts(productSearchResults));
            dispatch(setSearchResultProducts(productSearchResults));
            dispatch(setLoadingProducts(false));
        }
    }
    useEffect(() => {
        const urlPattern = /^\/SearchResults\?searchTerm=.+$/;
        if (urlPattern.test(location.pathname + location.search)) {
            const searchParams = new URLSearchParams(location.search);
            const searchTerm = searchParams.get('searchTerm');
            if (searchTerm) {
                const termsArray = searchTerm.split(' ');
                submitSearchForProducts(termsArray);
                console.log(searchTerm);
            }
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const submitSearchForProducts = async (terms: string[], event?: any, submit?: string) => {
        if (!searchInput && submit === "search") {
            return;
        }
        
        if (event) {
            event.preventDefault();
        }

        if (currentByBrandResults.length > 0 && terms.length === debouncedSearchTerms.length) {
            await searchProductsBasedOnSearch(currentByBrandResults);
        } else if (currentSubcategoryResults.length > 0 && terms.length === debouncedSearchTerms.length) {
            await searchProductsBasedOnSearch(currentSubcategoryResults);

        } else if (currentProductResults.length > 0 && terms.length === debouncedSearchTerms.length) {
            dispatch(setProducts(currentProductResults));
            dispatch(setSearchResultProducts(currentProductResults));
        } else {
            const performSearch = async () => {
                if (terms.length > 0) {

                    const brandSearch = await searchByManufacturer("keywords", 0, terms, setSubcategoryByBrandResults);

                    if (!brandSearch) {

                        const subcatSearch = await searchSubcategories("keywords", terms, setSubcategoryResults);
                        if (!subcatSearch) {
                            const nonmatchingIndex = terms.indexOf(nonmatchingTerm!);
                            const newBrandSearch = await searchByManufacturer("keywords", nonmatchingIndex, terms, setSubcategoryByBrandResults);
                            if (!newBrandSearch) {
                                const brandNonmatchingIndex = terms.indexOf(brandNonmatchingTerm!);
                                const prodSearch = await searchProducts("keywords", brandNonmatchingIndex, terms, setProductsResults);
                                if (!prodSearch) {
                                    dispatch(setProducts([]));
                                    dispatch(setSearchResultProducts([]));
                                    return;
                                } else {
                                    if (Array.isArray(prodSearch)) {
                                        dispatch(setProducts(prodSearch));
                                        dispatch(setSearchResultProducts(prodSearch));
                                        dispatch(setLoadingProducts(false));
                                    }
                                }
                            } else {
                                if (Array.isArray(newBrandSearch)) {
                                    await searchProductsBasedOnSearch(newBrandSearch);
                                }
                            }
                        } else {
                            if (Array.isArray(subcatSearch)) {
                                await searchProductsBasedOnSearch(subcatSearch);
                            }

                        }
                    } else {
                        if (Array.isArray(brandSearch)) {
                            await searchProductsBasedOnSearch(brandSearch);
                        }
                    }
                } else {
                    dispatch(setSubcategoryResults([]));
                    dispatch(setSubcategoryByBrandResults([]));
                    dispatch(setProductsResults([]));
                    dispatch(setProducts([]));
                    dispatch(setSearchResultProducts([]));
                    dispatch(setLoadingProducts(false));
                    return;
                }
            }
            performSearch();
        }

        if (submit === "submit") {
            navigate(`/SearchResults?searchTerm=${encodeURIComponent(searchInput)}`)
            setSearchTerms([]);
            setSearchInput("");
            handleBlur();
            clearOtherResults("none");
        }
    }


    return (
        <div className="relative z-50 w-5/6 sm:w-2/3 md:w-2/3 lg:w-5/6 h-fit">
            {isFocused && <div className="fixed inset-0 bg-black opacity-50" onClick={handleBlur}></div>}
            <div className="flex w-full mb-1 relative z-50">
                <form id="searchbar" className="w-full" onSubmit={(event) => submitSearchForProducts(searchTerms, event, "submit")}>
                    <input
                        name="search"
                        value={searchInput}
                        onFocus={handleFocus}
                        onBlur={() => (searchTerms.length === 0 || (searchTerms[0] && searchTerms[0].length < 3)) && handleBlur()}
                        onChange={handleChange}
                        placeholder="Enter search term..."
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-red-900 focus:border-red-900 focus:outline-red-900 h-12 p-2.5 w-full z-40"
                        ref={searchInputRef}
                        autoComplete="off"
                    />
                    <button type="submit" className="self-center absolute top-1 right-0 text-2xl p-2 text-black ml-2">
                        <IoSearch className="z-50" />
                    </button>
                </form>

            </div>
            {searchTerms.length > 0 && searchTerms[0].length >= 3 && isFocused && (
                <div className="absolute bg-gray-100 top-8 pt-3 border rounded-lg border-gray-300 shadow-lg w-full z-30">
                    <SearchResults
                        handleBlur={handleBlur}
                        setSearchInput={setSearchInput}
                        debouncedSearchTerms={debouncedSearchTerms}
                        searchInput={searchInput}
                    />
                </div>
            )}
        </div>
    );
}