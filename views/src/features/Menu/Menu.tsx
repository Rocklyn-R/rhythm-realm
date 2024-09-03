import { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import { SlidingMenu } from "./SlidingMenu/SlidingMenu";
import { SubcategoryMenu } from "./SubcategoryMenu/SubcategoryMenu";
import { Category } from "../../types/types";

export const Menu = () => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [subcategoryMenuIsOpen, setSubcategoryMenuIsOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);

    const toggleMenu = () => {
        setMenuIsOpen(!menuIsOpen);
        setSubcategoryMenuIsOpen(false);
    }

    const closeSubcategoryMenu = () => {
        setSubcategoryMenuIsOpen(false);
    }

    const openSubcategoryMenu = () => {
        setSubcategoryMenuIsOpen(true);
    }

    const handleMouseMove = (event: MouseEvent) => {
        const slidingMenuElement = document.getElementById('slidingMenu');
        const subcategoryMenuElement = document.getElementById('subcategoryMenu');

        if (
            slidingMenuElement &&
            subcategoryMenuElement &&
            !slidingMenuElement.contains(event.target as Node) &&
            !subcategoryMenuElement.contains(event.target as Node)
        ) {
            closeSubcategoryMenu();
        }
    };

    useEffect(() => {
        if (subcategoryMenuIsOpen) {
            document.addEventListener('mousemove', handleMouseMove);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [subcategoryMenuIsOpen]);

    return (
        <>
            <button className="flex flex-col items-center" onClick={toggleMenu}>
                <IoMenu className="text-5xl" />
                <p>SHOP</p>
            </button>

            <div
                id="slidingMenu"
                className={`fixed top-0 left-0 h-full xs:w-1/2 w-2/3 sm:w-2/5 md:w-1/3 lg:w-1/4 bg-white shadow-lg transform transition-transform z-50 ${menuIsOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <SlidingMenu
                    toggleMenu={toggleMenu}
                    isOpen={menuIsOpen}
                    closeSubcategoryMenu={closeSubcategoryMenu}
                    setHoveredCategory={setHoveredCategory}
                    openSubcategoryMenu={openSubcategoryMenu}
                    hoveredCategory={hoveredCategory}
                />
            </div>
            {menuIsOpen && (
                <div
                    id="subcategoryMenu"
                    className={`fixed top-0 left-96 h-full xs:w-1/2 w-2/3 sm:w-2/5 md:w-1/3 lg:w-1/4 bg-white shadow-lg transform transition-transform z-45 ${subcategoryMenuIsOpen ? 'translate-x-0 translate-y-0' : '-translate-x-full -translate-y-full'}`}
                    style={{ transition: 'transform 0.3s ease-in-out' }}
                >
                    <SubcategoryMenu
                        toggleMenu={toggleMenu}
                        category={hoveredCategory}
                    />
                </div>
            )}


            {menuIsOpen && (
                <div
                    onClick={toggleMenu}
                    className="fixed inset-0 bg-black opacity-50 z-40"
                ></div>
            )}
        </>
    )
}