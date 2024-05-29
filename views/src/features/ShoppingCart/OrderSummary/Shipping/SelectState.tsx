import { Select } from "antd";
import { FiftyStates } from "./50states";
import { DefaultOptionType } from "antd/es/select";

interface SelectStateProps {
    handleSelectState: (value: any, option: DefaultOptionType | DefaultOptionType[]) => void;
    missingStateMessage: string;
    page: "Checkout" | "Cart";
}

export const SelectState: React.FC<SelectStateProps> = ({handleSelectState, missingStateMessage, page}) => {
    return (
        <div className={page === "Cart" ? "w-1/4" : "flex items-center w-1/3"}>
            <Select
                placeholder="State"
                onChange={handleSelectState}
                style={{
                    height: "50px",
                    width: "100%",
                    fontFamily: "Montserrat",
                    fontSize: "2rem",
                }}
                className={page === "Cart" ? "mr-4" : ""}
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