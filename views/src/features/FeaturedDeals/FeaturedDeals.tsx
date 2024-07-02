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
    const [isScrolling, setIsScrolling] = useState(false);

    const [uniqueProducts, setUniqueProducts] = useState<Product[]>([]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (featuredDeals) {
            setUniqueProducts(shuffleArray(Object.values(featuredDeals.reduce((acc: Record<string, Product[]>, product: Product) => {
                if (!acc[product.id]) {
                    acc[product.id] = [];
                }
                acc[product.id].push(product);
                return acc;
            }, {})).map(variants => variants[0])))
        }
    }, [featuredDeals]);

    const scrollLeft = () => {
        if (scrollContainerRef.current && !isScrolling) {
            setIsScrolling(true); // Start scrolling
            const buttons = scrollContainerRef.current.querySelectorAll(".featured-product-button");
            if (buttons.length > 0) {
                const firstButtonWidth = buttons[0].getBoundingClientRect().width + 16;
                scrollContainerRef.current.scrollBy({
                    left: -firstButtonWidth,
                    behavior: "smooth"
                });
                setIsScrolling(false)
            }
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current && !isScrolling) {
            setIsScrolling(true); // Start scrolling
            const buttons = scrollContainerRef.current.querySelectorAll(".featured-product-button");
            if (buttons.length > 0) {
                const firstButtonWidth = buttons[0].getBoundingClientRect().width + 16;
                scrollContainerRef.current.scrollBy({
                    left: firstButtonWidth,
                    behavior: "smooth"
                });
                setIsScrolling(false);
            }
        }
    };

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftMouse, setScrollLeftMouse] = useState(0);
    const [dragComplete, setDragComplete] = useState(true);

    const disableTextSelection = () => {
        if (document) {
            document.body.style.userSelect = 'none';
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
        setDragComplete(false);
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft ?? 0);
        const walk = (x - startX) * 0.8; // Adjust scroll sensitivity
        scrollContainerRef.current.scrollLeft = scrollLeftMouse - walk;
    };

    const adjustWheel = () => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth;
            const buttons = scrollContainerRef.current.querySelectorAll(".featured-product-button");
            if (buttons.length > 0) {
                const firstButtonWidth = buttons[0].getBoundingClientRect().width + 16;
                const scrollLeft = scrollContainerRef.current.scrollLeft;
                const visibleWidth = containerWidth + scrollLeft;

                let targetScroll = scrollLeft;
                // Calculate where to scroll to make sure a full button is visible
                if (visibleWidth % firstButtonWidth !== 0) {
                    const remainder = visibleWidth % firstButtonWidth;
                    if (remainder >= firstButtonWidth * 0.5) {
                        targetScroll += firstButtonWidth - remainder;
                    } else {
                        targetScroll -= remainder;
                    }

                }

                // Animate scrolling to the adjusted position
                scrollContainerRef.current.scrollTo({
                    left: targetScroll,
                    behavior: "smooth",
                });
            }
        }
    }


    const handleMouseUp = () => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);
        setIsDragging(false)
        adjustWheel();
        setTimeout(() => { setDragComplete(true) }, 50)
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
        if (!dragComplete) {
            return;
        }
        dispatch(setSelectedProduct(product));
        navigate(`/Featured/Sale/${product.name}${product.variant_name ? `/${product.variant_name}` : ''}`)
    }
    const featuredWheelRef = useRef<HTMLDivElement>(null);

    const [wheelItemWidth, setWheelItemWidth] = useState("");
    useEffect(() => {
        const calculateWheelItemWidth = () => {
            if (featuredWheelRef.current) {
                const wheelWidth = featuredWheelRef.current.offsetWidth;
                console.log(wheelWidth);
                if (wheelWidth >= 1000) {
                    const itemWidth = (wheelWidth / 5);
                    const itemWidthWithoutMargin = itemWidth - 16;
                    setWheelItemWidth(itemWidthWithoutMargin.toFixed(2));
                } else if (wheelWidth >= 850) {
                    const itemWidth = (wheelWidth / 4);
                    const itemWidthWithoutMargin = itemWidth - 16;
                    setWheelItemWidth(itemWidthWithoutMargin.toFixed(2));
                } else if (wheelWidth >= 650) {
                    const itemWidth = (wheelWidth / 3);
                    const itemWidthWithoutMargin = itemWidth - 16;
                    setWheelItemWidth(itemWidthWithoutMargin.toFixed(2));
                } else if (wheelWidth >= 475) {
                    const itemWidth = (wheelWidth / 2);
                    const itemWidthWithoutMargin = itemWidth - 16;
                    setWheelItemWidth(itemWidthWithoutMargin.toFixed(2));
                } else if (wheelWidth < 475) {
                    const itemWidth = wheelWidth / 1
                    const itemWidthWithoutMargin = itemWidth - 16;
                    setWheelItemWidth(itemWidthWithoutMargin.toFixed(2));
                }
            }                   
        

        };

        // Log the initial width
        calculateWheelItemWidth();

        // Add resize event listener
        window.addEventListener('resize', calculateWheelItemWidth);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', calculateWheelItemWidth);
        };
    }, []);

    useEffect(() => {
        adjustWheel(); 
    }, [wheelItemWidth])

    return (
        <div className="py-8 w-full -z-10">
            <div className="flex justify-between px-4">
                <h2 className="text-xl font-bold hover:underline">Featured Deals</h2>
                <button
                    className="text-red-800 flex items-center gap-2"
                    onClick={() => handleViewAll()}
                ><p className="hover:underline">View All</p><IoIosArrowForward /></button>
            </div>
            <div className="relative featured-deals-wheel"
                ref={featuredWheelRef}
                onMouseDown={handleMouseDown}
                onMouseMove={isDragging ? handleMouseMove : undefined}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div ref={scrollContainerRef} className="flex overflow-x-hidden w-full">
                    <button
                        className="absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md"
                        onClick={scrollLeft}
                    >
                        <IoIosArrowBack className="text-2xl" />
                    </button>

                    {uniqueProducts.map(product => (
                        <button
                            style={{ width: `${wheelItemWidth}px` }}
                            onClick={() => handleClickProduct(product)}
                            key={product.id}
                            className="mx-2 featured-product-button max-h-90 flex flex-col cursor-pointer justify-between items-center shadow-sm hover:shadow-xl border border-black mt-8 bg-white rounded-md flex-none p-2"
                        >
                            <img src={product.image1} className="w-full h-auto" alt={product.name} draggable="false" />
                            <div className="p-4 flex flex-col items-center">
                                <h3 className="text-lg font-semibold text-center">{product.name}</h3>
                                <div>
                                    <p className="text-gray-700 line-through">${product.price}</p>
                                    <p className="text-red-800">${product.sale_price}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                <button
                    className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md"
                    onClick={scrollRight}
                >
                    <IoIosArrowForward className="text-2xl cursor-pointer" />
                </button>
            </div>
        </div>
    );
}