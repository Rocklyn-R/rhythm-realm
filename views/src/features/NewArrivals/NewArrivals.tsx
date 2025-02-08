import { getFeaturedDeals } from "../../api/products"
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { selectNewArrivals, setNewArrivals, setSelectedProduct } from "../../redux-store/ProductsSlice";
import { useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Product } from "../../types/types";
import { Link, useNavigate } from "react-router-dom";
import { clearFilters } from "../../redux-store/FiltersSlice";
import { formatImage, formatName, formatPrice } from "../../utilities/utilities";
import ReactPlayer from "react-player";

export const NewArrivals = () => {
    const dispatch = useDispatch();
    const newArrivals = useSelector(selectNewArrivals);
    const [isScrolling, setIsScrolling] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftMouse, setScrollLeftMouse] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const wheelRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [uniqueProducts, setUniqueProducts] = useState<Product[]>([]);
    const dragCompleteRef = useRef(false);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const isDraggingRef = useRef(false);

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
                const timeout = setTimeout(() => {
                    setIsScrolling(false);
                }, 500); // Adjust the timeout as needed based on your scroll animation duration
                return () => clearTimeout(timeout);
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
                const timeout = setTimeout(() => {
                    setIsScrolling(false);
                }, 500); // Adjust the timeout as needed based on your scroll animation duration
                return () => clearTimeout(timeout);
            }
        }
    };

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

    const handleMouseUp = (e: MouseEvent) => {
        console.log("Handle Mouse Up called");
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);

        setIsDragging(false);

        const timeout = setTimeout(() => {
            dragCompleteRef.current = true;
        }, 30);

        adjustWheel();
        return () => clearTimeout(timeout);
    };

    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleClickProduct = (product: Product) => {
        // Clear any existing timeout before setting a new one
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }
        clickTimeoutRef.current = setTimeout(() => {
            if (isDraggingRef.current) {
                console.log("THIS IS WHY (Click ignored because of dragging)");
                return;
            }
            console.log("HANDLE CLICK PRODUCT CALLED");
            dispatch(setSelectedProduct(product));
            navigate(`/Featured/Sale/${formatName(product.name)}${product.variant_name ? `/${formatName(product.variant_name)}` : ''}`)
        }, 70);

    };
    const [wheelItemWidth, setWheelItemWidth] = useState("");

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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
            timeoutRef.current = setTimeout(() => {
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
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);


    const handleViewAll = () => {
        window.scrollTo(0, 0);
        dispatch(clearFilters());
        navigate("/Featured/New Arrivals")
    }


    return (
        <div className="p-10 m-4 flex flex-col bg-gradient-to-b from-darkred to-red-600">
            <div className="flex lg:flex-row flex-col items-center lg:justify-around w-full">
                <div className="flex flex-col items-center text-white pb-4 lg:pb-0">
                    <h1 className="lg:text-7xl xs:text-5xl font-bold">NEW</h1>
                    <h1 className="lg:text-7xl xs:text-5xl font-bold">ARRIVALS</h1>
                </div>
                <div className="lg:w-fit sm:w-2/3 w-full flex flex-col items-center justify-center">
                    <Link to="/Audio/Audio%20Interfaces/Focusrite%20Scarlett%202i2%20USB-C%20Audio%20Interface%20Gen%204" className="text-xl mb-2 text-white">Focusrite Scarlett 2i2 USB-C Audio Interface Gen 4</Link>
                    <ReactPlayer
                        url="https://www.youtube.com/embed/G02KlTmTcSg?si=s77MBKHnTzh5_ac8"
                        controls={true}
                    >

                    </ReactPlayer>
                </div>

            </div>
            <div className="new-arrivals-wheel relative"
                ref={wheelRef}
                onMouseDown={handleMouseDown}
                onMouseMove={isDragging ? handleMouseMove : undefined}
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
                            <img src={formatImage(product.image1, "l")} className="w-full h-auto" alt={product.name} draggable="false" />
                            <div className="flex flex-col items-center">
                                <h3 className="mb-2 text-lg font-semibold text-center">{product.name}</h3>
                                <div>
                                    <p className="text-gray-700 font-semibold">${formatPrice(product.price)}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                    <button
                        onClick={scrollRight}
                        className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md z-10"
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