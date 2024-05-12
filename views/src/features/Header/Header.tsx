import logo from "../../images/logo/rhythm-realm-nobg.png";
import { SearchBar } from "../Search/SearchBar";
import { ShoppingCart } from "../ShoppingCart/ShoppingCart";

export const Header = () => {
    return (
            <div className="flex items-end justify-around bg-red-800 pt-2 pb-5">
                <img src={logo} width="250" />
                <SearchBar />
                <ShoppingCart />
            </div>    
    )
}