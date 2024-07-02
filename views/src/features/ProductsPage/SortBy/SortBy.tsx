import { Select, SelectProps } from "antd"
import { Product } from "../../../types/types";
import { BsSliders } from "react-icons/bs";


interface SortByProps {
    uniqueProducts: Product[]
    setSorting: (arg0: string) => void;
    sorting: string;
    setDisplayValue: (arg0: number) => void;
    displayValue: number;
    setCurrentPage: (arg0: number) => void;
    setShowFiltersSlider: (arg0: boolean) => void;
}

export const SortBy: React.FC<SortByProps> = ({ setShowFiltersSlider, setCurrentPage, setDisplayValue, displayValue, uniqueProducts, sorting, setSorting }) => {
    const totalProducts = uniqueProducts.length;
    const options = ["Best match", "Price - Low to High", "Price - High to Low", "Brand Name A-Z"]
    const displayOptions = [24, 48, 96]



    const handleSelectSorting: SelectProps['onChange'] = (value) => {
        setSorting(value);
    }

    const handleSelectDisplayValue: SelectProps['onChange'] = (value) => {
        console.log(totalProducts);
        setDisplayValue(value);
        if (totalProducts < value) {
            setCurrentPage(1);
        }
    }




    return (
        <div className="flex md:flex-row md:space-y-0 space-y-4 flex-col items-center w-full px-2 sm:px-16 md:px-6 justify-between">
            <Select
                onChange={handleSelectSorting}
                value={sorting}
                style={{
                    height: "50px",
                    fontFamily: "Montserrat",
                    fontSize: "2rem",
                }}
                options={[
                    ...options.map(option => ({
                        value: option,
                        label: option
                    }))
                ]}
            />
            <button onClick={() => setShowFiltersSlider(true)} className="md:hidden flex items-center space-x-2 border border-gray-300 bg-white p-3 rounded-md">
                <BsSliders />
                <p>Select Filters</p>
            </button>
            <p className="text-center font-semibold">({uniqueProducts.length} matches found)</p>
            <div className="md:flex hidden items-center w-fit">
                <h4 className="font-semibold mr-2">Display:</h4>
                <Select
                    onChange={handleSelectDisplayValue}
                    value={displayValue}
                    style={{
                        height: "50px",
                        width: "100%",
                        fontFamily: "Montserrat",
                        fontSize: "2rem",
                    }}
                    options={[
                        ...displayOptions.map(option => ({
                            value: option,
                            label: option
                        }))
                    ]}
                />
            </div>
        </div>
    )
}