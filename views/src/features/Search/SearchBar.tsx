import { IoSearch } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { getSearchByBrand, getSearchByProduct, getSearchSubcategories } from "../../api/search";
import { useDispatch, useSelector } from "react-redux";
import { selectSubcategoryResults, setProductsResults, setSubcategoryByBrandResults, setSubcategoryResults } from "../../redux-store/SearchSlice";
import { SearchResults } from "./SearchResults/SearchResults";
import { ProductResult, Subcategory, SubcategoryByBrand, SubcategoryResult } from "../../types/types";
import e from "express";

export const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerms, setSearchTerms] = useState<string[]>([]);
    const [debouncedSearchTerms, setDebouncedSearchTerms] = useState<string[]>([]);
    const dispatch = useDispatch();
    //const subcategoryResults = useSelector(selectSubcategoryResults);

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
            if (searchTerms.length > 0 && searchTerms.every(term => term.length >= 3)) {
                setDebouncedSearchTerms([...searchTerms]);
            } else {
                setDebouncedSearchTerms([]);
                dispatch(setSubcategoryByBrandResults([]));
                dispatch(setSubcategoryResults([]));
                dispatch(setProductsResults([]));
            }
        }, 500);

        return () => {
            clearTimeout(timerId); // Cleanup on component unmount or when searchTerms changes
        };
    }, [searchTerms]);


    useEffect(() => {
        //Search By Brand First Then Filter By Subcategory
        let brandNonmatchingTerm: string | undefined;
        const searchByManufacturer = async (searchTermIndex: number) => {
            const byBrandResults: SubcategoryByBrand[] = await getSearchByBrand(debouncedSearchTerms[searchTermIndex]);
            if (byBrandResults.length > 0) {
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
                            if (result.subcategory_name.toLowerCase().includes(lowerCaseTerm) || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm)) {
                                newResults.push(result);
                            }
                            return result.subcategory_name.toLowerCase().includes(lowerCaseTerm) || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm);
                        });
                        if (!matchesAllTerms) {
                            brandNonmatchingTerm = debouncedSearchTerms.find((term, index) => {
                                const lowerCaseTerm = term.toLowerCase();
                                const foundInNewResults = newResults.some(newResult =>
                                    newResult.subcategory_name.toLowerCase().includes(lowerCaseTerm) ||
                                    (newResult.category_alt_name?.toLowerCase() || '').includes(lowerCaseTerm) ||
                                    (newResult.manufacturer?.toLowerCase() || '').includes(lowerCaseTerm) // Added condition
                                );
                                return !foundInNewResults; // Term not found in newResults
                            });
                        }
                        return matchesAllTerms;
                    });
                    dispatch(setSubcategoryByBrandResults(filteredResults));
                    if (filteredResults.length > 0) {
                        return true;
                    } else {
                        return false;
                    } 
                } else {
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
                        || result.manufacturer?.toLowerCase().includes(lowerCaseTerm)
                        || result.variant_name?.toLowerCase().includes(lowerCaseTerm);
                    });
                })
                dispatch(setProductsResults(filteredResults));
            }
            return productsResults;
        }

        let nonmatchingTerm: string | undefined;
        // Search Subcategories based on Subcategory name
        const searchSubcategories = async () => {
            const subcategoryResults: SubcategoryResult[] = await getSearchSubcategories(debouncedSearchTerms[0]);
            if (subcategoryResults.length > 0) {
                if (debouncedSearchTerms.length > 1) {
                    const newResults: SubcategoryResult[] = [];
                    const filteredResults = subcategoryResults.filter(result => {
                        const matchesAllTerms = debouncedSearchTerms.slice(1).every(term => {
                            const lowerCaseTerm = term.toLowerCase();
                            if (result.subcategory_name.toLowerCase().includes(lowerCaseTerm) || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm)) {
                                newResults.push(result);
                            }
                            return result.subcategory_name.toLowerCase().includes(lowerCaseTerm) || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm);
                        });
                        if (!matchesAllTerms) {
                            nonmatchingTerm = debouncedSearchTerms.slice(1).find(term => {
                                const lowerCaseTerm = term.toLowerCase();
                                const foundInNewResults = newResults.some(newResult =>
                                    newResult.subcategory_name.toLowerCase().includes(lowerCaseTerm) ||
                                    (newResult.category_alt_name?.toLowerCase() || '').includes(lowerCaseTerm)
                                );
                                return !foundInNewResults; // Term not found in newResults
                            });
                        }
                        return matchesAllTerms;
                    });
                    dispatch(setSubcategoryResults(filteredResults));
                    if (filteredResults.length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    console.log("TRUE")
                    dispatch(setSubcategoryResults(subcategoryResults));
                    return true;
                }
            } else {
                nonmatchingTerm = debouncedSearchTerms[0];
                return false;
            }
        }

    

        //Perform Search
        const performSearch = async () => {
            dispatch(setSubcategoryByBrandResults([]));
            dispatch(setSubcategoryResults([]));
            dispatch(setProductsResults([]));
            if (debouncedSearchTerms.length > 0) {
                const brandSearch = await searchByManufacturer(0);
                if (!brandSearch) {
                    console.log("RAN NOW")
                    const subcatSearch = await searchSubcategories();
                    console.log(subcatSearch);
                    if (!subcatSearch) {
                        console.log("NEXT")
                        const nonmatchingIndex = debouncedSearchTerms.indexOf(nonmatchingTerm!);
                        const newBrandSearch = await searchByManufacturer(nonmatchingIndex);
                        if (!newBrandSearch) {
                            console.log("NEXT");
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
        <div className="relative z-50 w-5/6 sm:w-2/3 md:w-2/3 lg:w-5/6 h-10 mb-1">
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
                <div className="absolute bg-gray-100 top-8 pt-3 border rounded-lg border-gray-300 shadow-lg w-full mt-1 z-30">
                    <SearchResults
                        handleBlur={handleBlur}
                        setSearchInput={setSearchInput}
                        debouncedSearchTerms={debouncedSearchTerms}
                    />
                </div>
            )}
        </div>
    );
}