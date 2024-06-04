import logo from "../../images/logo/rhythm-realm-nobg.png";
import { SearchBar } from "../Search/SearchBar";
import { ShoppingCartHeader } from "../ShoppingCart/ShoppingCartHeader/ShoppingCartHeader";
import { UserHeader } from "../User/UserHeader";

export const Header = () => {
    return (
        <div className="flex flex-col items-end justify-between bg-red-800 pt-2 pb-5 w-full">
            <div className="flex w-full items-end justify-between">
                <div className="mx-3">
                    <img src={logo} width="250" />
                </div>

                <div className="w-full justify-center hidden sm:flex">
                    <SearchBar />
                </div>
                <div className="flex items-center h-fit w-1/4 justify-center">
                    <div className="w-1/3">
                        <UserHeader />
                    </div>

                    <div className="w-1/3 flex justify-center">
                        <ShoppingCartHeader />
                    </div>
                </div>

            </div>

            <div className="sm:hidden justify-center w-full flex pt-5">
                <SearchBar />
            </div>
        </div>
    )
}