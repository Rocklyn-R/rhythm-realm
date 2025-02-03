import { useEffect, useRef, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFeaturedDeals } from "../../api/products";
import { clearFilters } from "../../redux-store/FiltersSlice";
import { selectFeaturedDeals, selectTopSellers, setFeaturedDeals, setSelectedProduct, setTopSellers } from "../../redux-store/ProductsSlice";
import { Product } from "../../types/types";
import { shuffleArray } from "../../utilities/utilities";
import { formatPrice } from "../../utilities/utilities";

interface FeaturedDealsProps {
    marketingLabel: "On Sale" | "Top Seller";
}

export const FeaturedDeals: React.FC<FeaturedDealsProps> = ({ marketingLabel }) => {
    const dispatch = useDispatch();
    const featuredDeals = useSelector(selectFeaturedDeals);
    const [isScrolling, setIsScrolling] = useState(false);
    const topSellers = useSelector(selectTopSellers);
    const [uniqueProducts, setUniqueProducts] = useState<Product[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const dragCompleteRef = useRef(false);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        if (featuredDeals && marketingLabel === "On Sale") {
            setUniqueProducts(shuffleArray(Object.values(featuredDeals.reduce((acc: Record<string, Product[]>, product: Product) => {
                if (!acc[product.id]) {
                    acc[product.id] = [];
                }
                acc[product.id].push(product);
                return acc;
            }, {})).map(variants => variants[0])))
        }
    }, [featuredDeals, marketingLabel]);

    useEffect(() => {
        if (topSellers && marketingLabel === "Top Seller") {
            setUniqueProducts(shuffleArray(Object.values(topSellers.reduce((acc: Record<string, Product[]>, product: Product) => {
                if (!acc[product.id]) {
                    acc[product.id] = [];
                }
                acc[product.id].push(product);
                return acc;
            }, {})).map(variants => variants[0])))
        }
    }, [topSellers, marketingLabel]);

    const scrollLeft = () => {
        if (scrollContainerRef.current && !isScrolling) {
            const buttons = scrollContainerRef.current.querySelectorAll(".featured-product-button");
            if (buttons.length > 0) {
                setIsScrolling(true); // Start scrolling
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
            const buttons = scrollContainerRef.current.querySelectorAll(".featured-product-button");
            if (buttons.length > 0) {
                setIsScrolling(true); // Start scrolling
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





    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        console.log("Handle Mouse Down Called");

        isDraggingRef.current = false; // Assume it's not a drag at the start
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;

        setIsDragging(true);
        setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft ?? 0));
        setScrollLeftMouse(scrollContainerRef.current?.scrollLeft ?? 0);

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseleave", handleMouseUp);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollContainerRef.current) {
            dragCompleteRef.current = true;
            return;
        }
        const distanceX = Math.abs(e.clientX - startXRef.current);
        const distanceY = Math.abs(e.clientY - startYRef.current);

        // If the movement is larger than a threshold, mark it as a drag
        if (distanceX > 5 || distanceY > 5) {
            isDraggingRef.current = true;
        }

        if (isDraggingRef.current) {
            dragCompleteRef.current = false;
            console.log("Dragging detected");

            const x = e.pageX - (scrollContainerRef.current?.offsetLeft ?? 0);
            const walk = (x - startX) * 0.8;
            scrollContainerRef.current.scrollLeft = scrollLeftMouse - walk;
        }
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


    const handleMouseUp = (e: MouseEvent) => {
        console.log("Handle Mouse Up called");
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);

        setIsDragging(false);

        setTimeout(() => {
            dragCompleteRef.current = true;
        }, 30);

        adjustWheel();
    };

    const handleClickProduct = (product: Product) => {
        setTimeout(() => {
            if (isDraggingRef.current) {
                console.log("THIS IS WHY (Click ignored because of dragging)");
                return;
            }
            console.log("HANDLE CLICK PRODUCT CALLED");
            const deal = marketingLabel === "On Sale" ? "Sale" : "Top Sellers";
            dispatch(setSelectedProduct(product));
            navigate(`/Featured/${deal}/${product.name}${product.variant_name ? `/${product.variant_name}` : ''}`);
        }, 70);
    };

    useEffect(() => {
        const fetchDeals = async () => {
            const result = await getFeaturedDeals(marketingLabel);
            if (result) {
                if (marketingLabel === "On Sale") {
                    dispatch(setFeaturedDeals(result));
                }
                if (marketingLabel === "Top Seller") {
                    dispatch(setTopSellers(result));
                }
            }
        }
        fetchDeals();
    }, [dispatch]);



    const handleViewAll = () => {
        window.scrollTo(0, 0);
        dispatch(clearFilters());
        const deal = marketingLabel === "On Sale" ? "Sale" : "Top Sellers"
        navigate(`/Featured/${deal}`)
    }


    const featuredWheelRef = useRef<HTMLDivElement>(null);

    const [wheelItemWidth, setWheelItemWidth] = useState("");
    useEffect(() => {
        const calculateWheelItemWidth = () => {
            if (featuredWheelRef.current) {
                const wheelWidth = featuredWheelRef.current.offsetWidth;
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
                <h2 className="text-xl font-bold hover:underline">{marketingLabel === "On Sale" ? "Featured Deals" : "Top Sellers"}</h2>
                <button
                    className="text-red-800 flex items-center gap-2"
                    onClick={() => handleViewAll()}
                ><p className="hover:underline">View All</p><IoIosArrowForward /></button>
            </div>
            <div className="relative featured-deals-wheel"
                ref={featuredWheelRef}
                onMouseDown={handleMouseDown}
                onMouseMove={isDragging ? handleMouseMove : undefined}
            //onMouseUp={handleMouseUp}
            //onMouseLeave={handleMouseUp}
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
                                    <p className={`text-gray-700 text-xl font-bold ${product.sale_price ? "line-through" : ""}`}>${formatPrice(product.price)}</p>
                                    {product.sale_price && <p className="text-red-800 font-bold text-lg">${formatPrice(product.sale_price)}</p>}
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