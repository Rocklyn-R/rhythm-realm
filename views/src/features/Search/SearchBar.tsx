import { IoSearch } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { getSearchByBrand, getSearchSubcategories } from "../../api/search";
import { useDispatch, useSelector } from "react-redux";
import { selectSubcategoryResults, setSubcategoryByBrandResults, setSubcategoryResults } from "../../redux-store/SearchSlice";
import { SearchResults } from "./SearchResults/SearchResults";
import { Subcategory, SubcategoryByBrand } from "../../types/types";
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
            }
        }, 500);

        return () => {
            clearTimeout(timerId); // Cleanup on component unmount or when searchTerms changes
        };
    }, [searchTerms]);


    useEffect(() => {
        //Search By Brand First Then Filter By Subcategory
        const searchByManufacturer = async (searchTermIndex: number) => {
            const byBrandResults: SubcategoryByBrand[] = await getSearchByBrand(debouncedSearchTerms[searchTermIndex]);
            if (byBrandResults.length > 0) {
                if (debouncedSearchTerms.length > 1) {
                    const filteredResults = byBrandResults.filter(result => {
                        // Check if all search terms (starting from index 1) are included in the result name or category_alt_name
                        return debouncedSearchTerms.every((term, index) => {
                            if (index === searchTermIndex) {
                                return true;
                            }
                            const lowerCaseTerm = term.toLowerCase();
                            return result.name.toLowerCase().includes(lowerCaseTerm) || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm);
                        });
                    });
                    dispatch(setSubcategoryByBrandResults(filteredResults));
                    if (filteredResults.length > 0) {
                        return true;
                    } else return false;
                } else {
                    dispatch(setSubcategoryByBrandResults(byBrandResults));
                    return true;
                }
            } else {
                return false;
            }
        }

        let nonmatchingTerm: string | undefined;
        // Search Subcategories based on Subcategory name
        const searchSubcategories = async () => {
            const subcategoryResults: Subcategory[] = await getSearchSubcategories(debouncedSearchTerms[0]);
            if (subcategoryResults) {
                if (debouncedSearchTerms.length > 1) {
                    const newResults: Subcategory[] = [];
                    const filteredResults = subcategoryResults.filter(result => {
                        const matchesAllTerms = debouncedSearchTerms.slice(1).every(term => {
                            const lowerCaseTerm = term.toLowerCase();
                            if (result.name.toLowerCase().includes(lowerCaseTerm) || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm)) {
                                newResults.push(result);
                            }
                            return result.name.toLowerCase().includes(lowerCaseTerm) || result.category_alt_name?.toLowerCase().includes(lowerCaseTerm);
                        });
                        if (!matchesAllTerms) {
                            nonmatchingTerm = debouncedSearchTerms.slice(1).find(term => {
                                const lowerCaseTerm = term.toLowerCase();
                                const foundInNewResults = newResults.some(newResult =>
                                    newResult.name.toLowerCase().includes(lowerCaseTerm) ||
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
                    dispatch(setSubcategoryResults(subcategoryResults));
                    return true;
                }
            } else {
                return false;
            }
        }

    

        //Perform Search
        const performSearch = async () => {
            dispatch(setSubcategoryByBrandResults([]));
            dispatch(setSubcategoryResults([]));
            if (debouncedSearchTerms.length > 0) {
                const brandSearch = await searchByManufacturer(0);
                if (!brandSearch) {
                    console.log("CALLING");
                    const subcatSearch = await searchSubcategories();
                    if (!subcatSearch) {
                        console.log(nonmatchingTerm);
                        const nonmatchingIndex = debouncedSearchTerms.indexOf(nonmatchingTerm!);
                        const newBrandSearch = await searchByManufacturer(nonmatchingIndex);
                        if (!newBrandSearch) {
                            
                        }
                    }
                }
            } else {
                dispatch(setSubcategoryResults([]));
                dispatch(setSubcategoryByBrandResults([]));
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
                <div className="absolute bg-gray-100 top-8 py-4 px-2 border rounded-lg border-gray-300 shadow-lg w-full mt-1 z-30">
                    <SearchResults
                        handleBlur={handleBlur}
                        setSearchInput={setSearchInput}
                    />
                </div>
            )}
        </div>
    );
}