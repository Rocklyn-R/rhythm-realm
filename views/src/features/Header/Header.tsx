import logo from "../../images/logo/rhythm-realm-nobg.png";
import { SearchBar } from "../Search/SearchBar";
import { ShoppingCartHeader } from "../ShoppingCart/ShoppingCartHeader/ShoppingCartHeader";
import { UserHeader } from "../User/UserHeader";

export const Header = () => {
    return (
        <div className="flex flex-col items-end justify-between bg-red-800 pt-2 pb-5 w-full">
            <div className="flex w-full sm:flex-row flex-col items-center sm:items-end justify-between">
                <div className="ml-4 mr-4">
                    <img alt="Rhythm Realm logo" src={logo} width="160" />
                </div>

                <div className="1md:flex w-2/3 justify-center hidden items-center z-40 -mb-1">
                    <SearchBar />
                </div>
                <div className="flex sm:mt-0 mt-4 items-center h-fit space-x-6 min-w-48 mr-4 justify-center">
                    
                    <div className="min-w-20 flex justify-center">
                        <UserHeader />
                    </div>

                    <div className=" flex justify-center">
                        <ShoppingCartHeader />
                    </div>
                </div>

            </div>

            <div className="1md:hidden px-4 justify-center w-full flex pt-5">
                <SearchBar />
            </div>
        </div>
    )
}