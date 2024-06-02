import { Select } from "antd";
import { FiftyStates } from "./50states";
import { DefaultOptionType } from "antd/es/select";
import { useSelector } from "react-redux";
import { selectSelectedState } from "../../../redux-store/ShippingSlice";

interface SelectStateProps {
    handleSelectState: (value: any, option: DefaultOptionType | DefaultOptionType[]) => void;
    missingStateMessage: string;
    page: "Checkout" | "Cart";
    US_state: string;
    editMode?: boolean;
}

export const SelectState: React.FC<SelectStateProps> = ({handleSelectState, missingStateMessage, page, US_state, editMode}) => {
    const selectedState = useSelector(selectSelectedState);

    

    return (
        <div className={page === "Cart" ? "w-1/4" : "flex w-1/3"}>
            <Select
                placeholder="State"
                onChange={handleSelectState}
                value={page === "Checkout" ? US_state || undefined : undefined}
                style={{
                    height: "50px",
                    width: "100%",
                    fontFamily: "Montserrat",
                    fontSize: "2rem",
                    
                }}
                className={`${page === "Cart" ? "mr-4" : `mt-4`}`}
                popupClassName="custom-popup"
                options={[
                    ...FiftyStates.map(state => ({ 
                        value: state.abbreviation, 
                        label: page === "Cart" ? state.abbreviation : `${state.abbreviation} - ${state.name}`}))
                ]}
            />
            {missingStateMessage ? <p className="text-red-700 text-xs my-1">{missingStateMessage}</p> : ""}
        </div>
    )
}