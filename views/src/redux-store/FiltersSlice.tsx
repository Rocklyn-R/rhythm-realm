import { createSlice } from "@reduxjs/toolkit"
import { FilterState } from "../types/types";
import { RootState } from "./store";

export const FiltersSlice = createSlice({
    name: "filters",
    initialState: {
        manufacturers: [],
        selectedManufacturers: [],
        priceDrop: false,
        priceMin: undefined,
        priceMax: undefined,
        categories: [],
        selectedCategories: [],
        subcategories: [],
        selectedSubcategories: [],
    } as FilterState,

    reducers: {
        setManufacturers: (state, action) => {
            state.manufacturers = action.payload;
        },
        setSelectedManufacturers: (state, action) => {
            state.selectedManufacturers = action.payload;
        },
        setPriceDrop: (state, action) => {
            state.priceDrop = action.payload;
        },
        setPriceMin: (state, action) => {
            state.priceMin = action.payload;
        },
        setPriceMax: (state, action) => {
            state.priceMax = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setSelectedCategories: (state, action) => {
            state.selectedCategories = action.payload;
        },
        setSubcategories: (state, action) => {
            state.subcategories = action.payload;
        },
        setSelectedSubcategories: (state, action) => {
            state.selectedSubcategories = action.payload;
        },
        clearFilters: (state) => {
            state.selectedManufacturers = [];
            state.selectedCategories = [];
            state.priceMin = undefined;
            state.priceMax = undefined;
            state.selectedSubcategories = [];
            state.priceDrop = false;
        }
    }
})

export const {
   setManufacturers,
   setSelectedManufacturers,
   setPriceDrop,
   setPriceMin,
   setPriceMax,
   setCategories,
   setSelectedCategories,
   setSubcategories,
   setSelectedSubcategories,
   clearFilters
} = FiltersSlice.actions;

export const selectManufacturersFilter = (state: RootState) => state.filters.manufacturers;
export const selectSelectedManufacturers = (state: RootState) => state.filters.selectedManufacturers;
export const selectPriceDrop = (state: RootState) => state.filters.priceDrop;
export const selectPriceMin = (state: RootState) => state.filters.priceMin;
export const selectPriceMax = (state: RootState) => state.filters.priceMax;
export const selectCategoriesFilter = (state: RootState) => state.filters.categories;
export const selectSelectedCategories = (state: RootState) => state.filters.selectedCategories;
export const selectSubcategoriesFilter = (state: RootState) => state.filters.subcategories;
export const selectSelectedSubcategories = (state: RootState) => state.filters.selectedSubcategories;

export default FiltersSlice.reducer;
/*const [manufacturers, setManufacturers] = useState<string[]>([])
const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
const [priceDrop, setPriceDrop] = useState(false);
const [showPriceDrop, setShowPriceDrop] = useState(true);
const [priceMin, setPriceMin] = useState<string | undefined>(undefined);
const [priceMax, setPriceMax] = useState<string | undefined>(undefined);
const [tempPriceMin, setTempPriceMin] = useState<string>('');
const [tempPriceMax, setTempPriceMax] = useState<string>('');
const [showBrands, setShowBrands] = useState(false);
const [showSavings, setShowSavings] = useState(false);
const [showPrice, setShowPrice] = useState(false);
const [isFeatured, setIsSale] = useState((subcategoryName === 'Sale') || subcategoryName === "New Arrivals");
const [categories, setCategories] = useState<string[]>([]);
const [selectedCategories, setSelectedCategories] = useState<string[]>([])
const [showCategories, setShowCategories] = useState(false);
const [subcategories, setSubcategories] = useState<string[]>([]);
const [showSubcategories, setShowSubcategories] = useState(false);
const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
const allProducts = useSelector(selectProducts);
const [isFilterActive, setIsFilterActive] = useState(false);
const dispatch = useDispatch();
const [updatingFilters, setUpdatingFilters] = useState(true);
const marketingLabel = subcategoryName === "Sale" ? "On Sale" :
subcategoryName === "New Arrivals" ? "New Arrival" :
"";*/