import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories } from "../../../redux-store/ProductsSlice";
import { setHeaderIsOpen } from "../../../redux-store/UserSlice";
import { Link } from "react-router-dom";
import { GrNext } from "react-icons/gr";
import { Category } from "../../../types/types";


interface SlidingMenuProps {
    toggleMenu: () => void;
    isOpen: boolean;
    closeSubcategoryMenu: () => void;
    openSubcategoryMenu: () => void;
    setHoveredCategory: (arg0: Category | null) => void;
    hoveredCategory: Category | null;
}
export const SlidingMenu: React.FC<SlidingMenuProps> = ({
    toggleMenu,
    openSubcategoryMenu,
    setHoveredCategory,
    closeSubcategoryMenu,
    hoveredCategory
}) => {
    const dispatch = useDispatch();
    const categories = useSelector(selectCategories);

    const handleClickSignIn = () => {
        dispatch(setHeaderIsOpen());
        toggleMenu();
    }

    const handleHover = (category: Category) => {
        openSubcategoryMenu();
        setHoveredCategory(category);
    }

    const handleUnHover = () => {
        setHoveredCategory(null);
        //closeSubcategoryMenu();
    }

    const handleLeaveHover = () => {
        setHoveredCategory(null);
        closeSubcategoryMenu();
    }


    return (
        <div
            className="flex flex-col w-full items-center h-full z-100 overflow-y-auto"
        >
            <div className="w-full" onMouseEnter={() => handleLeaveHover()}>
                <div className="flex justify-between bg-red-800 p-4 w-full">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button
                        onClick={toggleMenu}
                    ><X /></button>
                </div>
                <div className="w-full font-semibold p-4 flex justify-start text-lg hover:underline">
                    <button onClick={() => handleClickSignIn()}>Sign In</button>
                </div>
            </div>

            <div className="w-full flex flex-col">
                <h2 onMouseEnter={() => handleLeaveHover()} className="font-semibold px-2 py-2">Shop By Category</h2>
                <div className="h-fit">
                    {categories.map((category, index) => (
                
                  
                        <Link
                            key={index}
                            onClick={toggleMenu}
                            to={`/${category.name}`}
                            className={`flex ${hoveredCategory === category && "bg-gray-200"} p-4 items-center justify-between hover:bg-gray-200`}
                            onMouseEnter={() => handleHover(category)}
                            
                        >
                            

                                <p>{category.name}</p>
                            
                            <p><GrNext /></p>
                        </Link>
               
                        
                    ))}
                </div>

            </div>

        </div>
    )
}