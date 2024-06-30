import { getFeaturedDeals } from "../../api/products"
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { selectNewArrivals, setNewArrivals, setSelectedProduct } from "../../redux-store/ProductsSlice";
import { useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Product } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { shuffleArray } from "../../utilities/utilities";

export const NewArrivals = () => {
    const dispatch = useDispatch();
    const newArrivals = useSelector(selectNewArrivals);
    const [isScrolling, setIsScrolling] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftMouse, setScrollLeftMouse] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const wheelRef = useRef<HTMLDivElement>(null);
    const [dragComplete, setDragComplete] = useState(true);
    const navigate = useNavigate();
    const [uniqueProducts, setUniqueProducts] = useState<Product[]>([]);


    useEffect(() => {
        const fetchDeals = async () => {
            const result = await getFeaturedDeals("New Arrival");
            if (result) {
                dispatch(setNewArrivals(result));
            }
        }
        fetchDeals();
    }, [dispatch]);

    useEffect(() => {
        if (newArrivals) {
            setUniqueProducts(Object.values(newArrivals.reduce((acc: Record<string, Product[]>, product: Product) => {
                if (!acc[product.id]) {
                    acc[product.id] = [];
                }
                acc[product.id].push(product);
                return acc;
            }, {})).map(variants => variants[0]))
        }
    }, [newArrivals]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current && !isScrolling) {
            setIsScrolling(true);
            const buttons = scrollContainerRef.current.querySelectorAll(".product-button");
            if (buttons.length > 0) {
                const firstButtonWidth = buttons[0].getBoundingClientRect().width + 16;
                scrollContainerRef.current.scrollBy({
                    left: -firstButtonWidth,
                    behavior: "smooth"
                });
                setTimeout(() => {
                    setIsScrolling(false);
                }, 500); // Adjust the timeout as needed based on your scroll animation duration
            }
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current && !isScrolling) {
            setIsScrolling(true);
            const buttons = scrollContainerRef.current.querySelectorAll(".product-button");
            if (buttons.length > 0) {
                const firstButtonWidth = buttons[0].getBoundingClientRect().width + 16;
                scrollContainerRef.current.scrollBy({
                    left: firstButtonWidth,
                    behavior: "smooth"
                });
                setTimeout(() => {
                    setIsScrolling(false);
                }, 500); // Adjust the timeout as needed based on your scroll animation duration
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft ?? 0));
        setScrollLeftMouse(scrollContainerRef.current?.scrollLeft ?? 0);
        //disableTextSelection();
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
            const buttons = scrollContainerRef.current.querySelectorAll(".product-button");
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
        setIsDragging(false);
        adjustWheel();
        setTimeout(() => {
             setDragComplete(true); 
        }, 50)
      
    };
    const [wheelItemWidth, setWheelItemWidth] = useState("");
    useEffect(() => {
        const calculateWheelItemWidth = () => {
            if (wheelRef.current) {
                const wheelWidth = wheelRef.current.offsetWidth;
                if (wheelWidth >= 880) {
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
                    const itemWidth = wheelWidth
                    const itemWidthWithoutMargin = itemWidth - 16;
                    setWheelItemWidth(itemWidthWithoutMargin.toFixed(2));
                }
            }
            setTimeout(() => {
                adjustWheel();
            }, 500)

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

    const handleClickProduct = (product: Product) => {
        if (!dragComplete) {
            return;
        }
        dispatch(setSelectedProduct(product));
        navigate(`/Featured/Sale/${product.name}${product.variant_name ? `/${product.variant_name}` : ''}`)
    }

    const handleViewAll = () => {
        navigate("/Featured/New Arrivals")
    }

    return (
        <div className="p-10 m-4 flex flex-col bg-gradient-to-b from-darkred to-red-600">
            <div className="flex lg:flex-row flex-col items-center lg:justify-around w-full">
                <div className="flex flex-col items-center text-white pb-4 lg:pb-0 w-full">
                    <h1 className="lg:text-8xl xs:text-5xl font-bold">NEW</h1>
                    <h1 className="lg:text-8xl xs:text-5xl font-bold">ARRIVALS</h1>
                </div>
                <div className="lg:w-3/4 sm:w-2/3 sm:h-80 xs:w-full xs:h-80">
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube-nocookie.com/embed/lYFLQzkqaqc?si=nCOkLri26MfJYez9"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture"
                        allowFullScreen
                    >

                    </iframe>
                </div>

            </div>
            <div className="new-arrivals-wheel relative"
                ref={wheelRef}
                onMouseDown={handleMouseDown}
                onMouseMove={isDragging ? handleMouseMove : undefined}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    ref={scrollContainerRef}
                    className="pl-2 flex justify-start overflow-x-hidden w-full">
                    <button
                        onClick={scrollLeft}
                        className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md z-10 ml-2"
                    >
                        <IoIosArrowBack className="text-2xl" />
                    </button>
                    {uniqueProducts.map(product => (
                        <button
                            onClick={() => handleClickProduct(product)}
                            style={{ width: `${wheelItemWidth}px` }}
                            key={product.variant_id}
                            className="product-button flex flex-col cursor-pointer justify-between items-center shadow-sm hover:shadow-xl border border-black mt-8 bg-white rounded-md flex-none p-2 mr-4"
                        >
                            <img src={product.image1} className="w-full h-auto" alt={product.name} draggable="false" />
                            <div className="flex flex-col items-center">
                                <h3 className="mb-2 text-lg font-semibold text-center">{product.name}</h3>
                                <div>
                                    <p className="text-gray-700">${product.price}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                    <button
                        onClick={scrollRight}
                        className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md z-10"
                    >
                        <IoIosArrowForward className="text-2xl" />
                    </button>
                </div>
            </div>

            <button 
            onClick={() => handleViewAll()}
            className="text-red-800 p-4 bg-white w-fit self-center font-semibold mt-4"
            >Shop All New Arrivals</button>
        </div>
    )
}