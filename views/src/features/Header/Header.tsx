import logo from "../../images/logo/rhythm-realm-nobg.png";
import { SearchBar } from "../Search/SearchBar";
import { ShoppingCartHeader } from "../ShoppingCart/ShoppingCartHeader/ShoppingCartHeader";
import { UserHeader } from "../User/UserHeader";

export const Header = () => {
    return (
        <div className="flex flex-col items-end justify-between bg-red-800 pt-2 pb-5 w-full">
            <div className="flex w-full sm:flex-row flex-col items-center sm:items-end justify-between">
                <div className="mx-3">
                    <img alt="Rhythm Realm logo" src={logo} width="250" />
                </div>

                <div className="w-full justify-center hidden sm:flex items-center z-40">
                    <SearchBar />
                </div>
                <div className="flex sm:mt-0 mt-4 items-center h-fit lg:space-x-0 space-x-6 md:w-1/3 w-1/2 sm:mr-4 md:mr-0 justify-center sm:justify-end md:justify-center">
                    <div className="lg:w-1/2 flex justify-center">
                        <UserHeader />
                    </div>

                    <div className="lg:w-1/2 flex justify-center">
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