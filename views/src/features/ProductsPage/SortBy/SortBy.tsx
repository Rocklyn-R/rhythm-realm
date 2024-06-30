import { Select, SelectProps } from "antd"
import { Product } from "../../../types/types";

interface SortByProps {
    uniqueProducts: Product[]
    setSorting: (arg0: string) => void;
    sorting: string;
    setDisplayValue: (arg0: number) => void;
    displayValue: number;
    setCurrentPage: (arg0: number) => void;
}

export const SortBy: React.FC<SortByProps> = ({ setCurrentPage, setDisplayValue, displayValue, uniqueProducts, sorting, setSorting}) => {
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
        <div className="flex items-center w-full px-6 justify-between">
            <Select 
            onChange={handleSelectSorting}
             value={sorting}
             style={{
                 height: "50px",
                 width: "20%",
                 fontFamily: "Montserrat",
                 fontSize: "2rem",
             }}
             options={[
                ...options.map(option => ({ 
                     value: option, 
                     label: option }))
             ]}
            />
             <p className="text-center font-semibold">({uniqueProducts.length} matches found)</p>
            <div className="flex items-center w-fit">
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
                             label: option }))
                     ]}
                />
            </div>
        </div>
    )
}