import { getFeaturedDeals } from "../../api/products"
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { selectNewArrivals, setNewArrivals } from "../../redux-store/ProductsSlice";
import { useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const NewArrivals = () => {
    const dispatch = useDispatch();
    const newArrivals = useSelector(selectNewArrivals);
    const [isScrolling, setIsScrolling] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftMouse, setScrollLeftMouse] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    
    useEffect(() => {
        const fetchDeals = async () => {
            const result = await getFeaturedDeals("New Arrival");
            if (result) {
                dispatch(setNewArrivals(result));
            }
        }
        fetchDeals();
    }, [dispatch]);

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
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft ?? 0);
        const walk = (x - startX) * 0.8; // Adjust scroll sensitivity
        scrollContainerRef.current.scrollLeft = scrollLeftMouse - walk;
    };

    const handleMouseUp = () => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);
        setIsDragging(false);

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
    };


    return (
        <div className="p-10 m-4 flex flex-col bg-gradient-to-b from-darkred to-red-600">
            <div className="flex justify-around">
                <div className="flex flex-col items-center text-white">
                    <h1 className="text-8xl font-bold">NEW</h1>
                    <h1 className="text-8xl font-bold">ARRIVALS</h1>
                </div>
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/lYFLQzkqaqc?si=nCOkLri26MfJYez9"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture"
                    allowFullScreen
                >

                </iframe>
            </div>
            <div className="relative"
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
                {newArrivals.map(product => (
                    <button
                        key={product.variant_id}
                        className="product-button flex flex-col cursor-pointer justify-between items-center shadow-sm hover:shadow-xl border border-black w-60 mt-8 bg-white rounded-md flex-none p-2 mr-4"
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
            
            <button className="text-red-800 p-4 bg-white w-fit self-center font-semibold mt-4">Shop All New Arrivals</button>
        </div>
    )
}