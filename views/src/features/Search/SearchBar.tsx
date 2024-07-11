import { IoSearch } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { getRecommendedProducts, getSearchByBrand, getSearchByProduct, getSearchSubcategories } from "../../api/search";
import { useDispatch, useSelector } from "react-redux";
import { selectProductResults, selectSubcategoryByBrandResults, selectSubcategoryResults, setProductsResults, setRecommendedProductResults, setSubcategoryByBrandResults, setSubcategoryResults } from "../../redux-store/SearchSlice";
import { SearchResults } from "./SearchResults/SearchResults";
import { ProductResult, Subcategory, SubcategoryByBrand, SubcategoryResult } from "../../types/types";
import e from "express";

export const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerms, setSearchTerms] = useState<string[]>([]);
    const [debouncedSearchTerms, setDebouncedSearchTerms] = useState<string[]>([]);
    const dispatch = useDispatch();
    const currentSubcategoryResults = useSelector(selectSubcategoryResults);
    const currentProductResults = useSelector(selectProductResults);
    const currentByBrandResults = useSelector(selectSubcategoryByBrandResults);

    const handleFocus = () => {
        setIsFocused(true);
        if (!searchInput) {
            setDebouncedSearchTerms([]);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
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
    }, [searchTerms]);

    const clearOtherResults = (resultToKeep: string) => {
        if (currentByBrandResults.length > 0 && resultToKeep !== 'bybrand') {
            dispatch(setSubcategoryByBrandResults([]));
            dispatch(setRecommendedProductResults([]));
        }
        if (currentProductResults.length > 0 && resultToKeep !== 'products') {
            dispatch(setProductsResults([]));
            dispatch(setRecommendedProductResults([]));
        }
        if (currentSubcategoryResults.length > 0 && resultToKeep !== 'subcategories') {
            dispatch(setSubcategoryResults([]));
            dispatch(setRecommendedProductResults([]));
        }
    }

    //Search By Brand First Then Filter By Subcategory
    let brandNonmatchingTerm: string | undefined;
    const searchByManufacturer = async (searchTermIndex: number) => {
        const byBrandResults: SubcategoryByBrand[] = await getSearchByBrand(debouncedSearchTerms[searchTermIndex]);
        if (byBrandResults && byBrandResults.length > 0) {
            if (debouncedSearchTerms.length > 1) {
                const newResults: SubcategoryByBrand[] = [];
                const filteredResults = byBrandResults.filter(result => {
                    // Check if all search terms (starting from index 1) are included in the result name or category_alt_name
                    const matchesAllTerms = debouncedSearchTerms.every((term, index) => {
                        if (term === debouncedSearchTerms[searchTermIndex]) {
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
                        brandNonmatchingTerm = debouncedSearchTerms.find((term, index) => {
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
                clearOtherResults('bybrand');
                dispatch(setSubcategoryByBrandResults(filteredResults));
                //}
                if (filteredResults.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                clearOtherResults('bybrand');
                dispatch(setSubcategoryByBrandResults(byBrandResults));
                return true;
            }
        } else {
            brandNonmatchingTerm = debouncedSearchTerms[0];
            return false;
        }
    }

    const searchProducts = async (searchTermIndex: number) => {
        const productsResults: ProductResult[] = await getSearchByProduct(debouncedSearchTerms[searchTermIndex]);
        if (productsResults) {
            const filteredResults = productsResults.filter(result => {
                return debouncedSearchTerms.every((term, index) => {
                    if (term === debouncedSearchTerms[searchTermIndex]) {
                        return true;
                    }
                    const lowerCaseTerm = term.toLowerCase();
                    return result.name.toLowerCase().includes(lowerCaseTerm)
                        || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm)
                        || result.category_name?.toLowerCase().includes(lowerCaseTerm)
                        || result.subcategory_alt_name?.toLowerCase().includes(lowerCaseTerm)
                        || result.manufacturer?.toLowerCase().includes(lowerCaseTerm)
                        || result.variant_name?.toLowerCase().includes(lowerCaseTerm);
                });
            })
            clearOtherResults('products');
            dispatch(setProductsResults(filteredResults));
        }
        return productsResults;
    }

    let nonmatchingTerm: string | undefined;
    // Search Subcategories based on Subcategory name
    const searchSubcategories = async () => {
        const subcategoryResults: SubcategoryResult[] = await getSearchSubcategories(debouncedSearchTerms[0]);

        if (subcategoryResults && subcategoryResults.length > 0) {
            if (debouncedSearchTerms.length > 1) {
                const newResults: SubcategoryResult[] = [];
                const filteredResults = subcategoryResults.filter(result => {
                    const matchesAllTerms = debouncedSearchTerms.slice(1).every(term => {
                        console.log(term);
                        console.log(result.subcategory_alt_name);
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
                        nonmatchingTerm = debouncedSearchTerms.slice(1).find(term => {
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
                clearOtherResults('subcategories');
                dispatch(setSubcategoryResults(filteredResults));

                if (filteredResults.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                clearOtherResults('subcategories');
                dispatch(setSubcategoryResults(subcategoryResults));
                return true;
            }
        } else {
            nonmatchingTerm = debouncedSearchTerms[0];
            return false;
        }

    }

    const searchRecommendedProducts = async (results: SubcategoryByBrand[] | SubcategoryResult[]) => {
        const brand = ('manufacturer' in results[0]) ? (results as SubcategoryByBrand[])[0].manufacturer : undefined;
        const subcategories = results.map(result => result.subcategory_name);
        console.log(subcategories);
        const searchRecommended = await getRecommendedProducts(subcategories, brand);
        console.log(searchRecommended);
        if (searchRecommended) {
           dispatch(setRecommendedProductResults(searchRecommended)); 
        }
    }

    useEffect(() => {
        if (currentByBrandResults.length > 0) {
            searchRecommendedProducts(currentByBrandResults);
        }
    }, [currentByBrandResults]);

    useEffect(() => {
        if (currentSubcategoryResults.length > 0) {
            searchRecommendedProducts(currentSubcategoryResults);
        }
    }, [currentSubcategoryResults]);

        useEffect(() => {

            //Perform Search
            const performSearch = async () => {
                if (debouncedSearchTerms.length > 0) {
                    const brandSearch = await searchByManufacturer(0);
                    if (!brandSearch) {
                        const subcatSearch = await searchSubcategories();
                        if (!subcatSearch) {
                            const nonmatchingIndex = debouncedSearchTerms.indexOf(nonmatchingTerm!);
                            const newBrandSearch = await searchByManufacturer(nonmatchingIndex);
                            if (!newBrandSearch) {
                                const brandNonmatchingIndex = debouncedSearchTerms.indexOf(brandNonmatchingTerm!);
                                const prodSearch = await searchProducts(brandNonmatchingIndex);
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
        }, [debouncedSearchTerms]);




    return (
        <div className="relative z-50 w-5/6 sm:w-2/3 md:w-2/3 lg:w-5/6 h-10">
            {isFocused && <div className="fixed inset-0 bg-black opacity-50" onClick={handleBlur}></div>}
            <div className="flex w-full mb-1 relative z-50">
                <input
                    value={searchInput}
                    onFocus={handleFocus}
                    onBlur={() => searchTerms.length === 0 || (searchTerms[0] && searchTerms[0].length < 3) && handleBlur()}
                    onChange={handleChange}
                    placeholder="Enter search term..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-red-900 focus:border-red-900 focus:outline-red-900 h-12 p-2.5 w-full z-40"
                />
                <button className="absolute right-0 text-2xl p-2 text-black ml-2">
                    <IoSearch className="z-50" />
                </button>
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