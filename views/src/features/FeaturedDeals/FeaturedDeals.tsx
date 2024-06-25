import { useEffect, useRef, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFeaturedDeals } from "../../api/products";
import { selectFeaturedDeals, setFeaturedDeals, setSelectedProduct } from "../../redux-store/ProductsSlice";
import { Product } from "../../types/types";
import { shuffleArray } from "../../utilities/utilities";

export const FeaturedDeals = () => {
    const dispatch = useDispatch();
    const featuredDeals = useSelector(selectFeaturedDeals);
    const productVariantsMap = featuredDeals.reduce((acc: Record<string, Product[]>, product: Product) => {
        if (!acc[product.id]) {
            acc[product.id] = [];
        }
        acc[product.id].push(product);
        return acc;
    }, {});


    const [uniqueProducts, setUniqueProducts] = useState(shuffleArray(Object.values(productVariantsMap).map(variants => variants[0])));

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(featuredDeals) {
            setUniqueProducts(shuffleArray(Object.values(productVariantsMap).map(variants => variants[0])))
        }
    }, [featuredDeals]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };
    
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };
    
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftMouse, setScrollLeftMouse] = useState(0);

    const disableTextSelection = () => {
        if (document) {
            document.body.style.userSelect = 'none';
        }
    };

    const enableTextSelection = () => {
        if (document) {
            document.body.style.userSelect = '';
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft ?? 0));
        setScrollLeftMouse(scrollContainerRef.current?.scrollLeft ?? 0);
        disableTextSelection();
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollContainerRef.current) return;
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft ?? 0);
        const walk = (x - startX) * 0.8; // Adjust scroll sensitivity
        scrollContainerRef.current.scrollLeft = scrollLeftMouse - walk;
    };


    const handleMouseUp = () => {
        setIsDragging(false);
        enableTextSelection();
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseUp);
    };


    useEffect(() => {
        const fetchDeals = async () => {
            const result = await getFeaturedDeals("On Sale");
            if (result) {
                dispatch(setFeaturedDeals(result));
            }
        }
        fetchDeals();
    }, [dispatch]);

    const handleViewAll = () => {
        navigate("/Featured/Sale")
    }

    const handleClickProduct = (product: Product) => {
        dispatch(setSelectedProduct(product));
        navigate(`/Featured/Sale/${product.name}${product.variant_name ? `/${product.variant_name}` : ''}`)
    }

    return (
        <div className="py-8 w-full relative">
        <div className="flex justify-between px-4">
            <h2 className="text-xl font-bold hover:underline">Featured Deals</h2>
            <button 
            className="text-red-800 flex items-center gap-2"
            onClick={() => handleViewAll()}
            ><p className="hover:underline">View All</p><IoIosArrowForward /></button>
        </div>
        <div className="relative"
                 onMouseDown={handleMouseDown}
                 onMouseMove={isDragging ? handleMouseMove : undefined}
                 onMouseUp={handleMouseUp}
                 onMouseLeave={handleMouseUp}
            >
            <button 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md z-10" 
                onClick={scrollLeft}
            >
                <IoIosArrowBack className="text-2xl"/>
            </button>
            <div ref={scrollContainerRef} className="flex overflow-x-auto w-full space-x-4 p-4">
                {uniqueProducts.map(product => (
                    <div 
                    onClick={() => handleClickProduct(product)}
                    key={product.id} 
                    className="flex flex-col cursor-pointer justify-between items-center shadow-sm hover:shadow-xl border border-black w-60 mt-8 bg-white rounded-md flex-none p-2"
                    >
                        <img src={product.image1} className="w-full h-auto" alt={product.name} draggable="false" />
                        <div className="p-4 flex flex-col items-center">
                            <h3 className="text-lg font-semibold text-center">{product.name}</h3>
                            <div>
                                <p className="text-gray-700 line-through">${product.price}</p>
                                <p className="text-red-800">${product.sale_price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md z-10" 
                onClick={scrollRight}
            >
                <IoIosArrowForward className="text-2xl"/>
            </button>
        </div>
    </div>
);
}