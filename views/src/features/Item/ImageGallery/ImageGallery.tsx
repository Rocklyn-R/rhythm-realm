import { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { selectSelectedProduct } from "../../../redux-store/ProductsSlice"
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { formatImage } from "../../../utilities/utilities";

export const ImageGallery = () => {
    const selectedProduct = useSelector(selectSelectedProduct);
    const [imageIndex, setImageIndex] = useState(0);
    
    const galleryImages = [selectedProduct.image1, selectedProduct.image2, selectedProduct.image3].filter(image => image !== null);
    const singleImageInGallery = galleryImages.length === 1;

    const showPrevImage = () => {
        setImageIndex(index => {
            if (index === 0) return index;
            return index - 1;
        })
    }

    const showNextImage = () => {
        setImageIndex(index => {
            if (index === galleryImages.length - 1) return index;
            return index + 1;
        })
    }

    useEffect(() => {
        setImageIndex(0);
    }, [selectedProduct]);

    return (

        <div className='rounded-sm mx-4 pb-4 shadow-md bg-white lg:w-3/5 lg:h-full lg:ml-6 flex flex-col items-center justify-center relative overflow-hidden'>

            <div className='lg:w-full md:w-5/6 flex flex-row lg:overflow-x-hidden pb-8'>

                {galleryImages.map((url, index) => (
                    <img
                        alt="Product"
                        key={index}
                        src={url}
                        className="w-full h-full flex-shrink-0 flex-grow-0 px-12"
                        style={{
                            translate: `${-100 * imageIndex}%`,
                            transition: 'translate 300ms ease-in-out'
                        }}
                    />
                ))}
            </div>
            {!singleImageInGallery && (
                <div className='self-start'>
                    <button
                        className={`${imageIndex === 0 ? 'gallery-gray-btn' : 'gallery-arrow-btn'} block absolute top-0 bottom-0 cursor-pointer left-0 p-1 bg-transparent`}
                        onClick={showPrevImage}
                    >
                        <ChevronLeftCircle
                        />
                    </button>
                    <button
                        className={`${imageIndex === galleryImages.length - 1 ? "gallery-gray-btn" : 'gallery-arrow-btn'} block absolute top-0 bottom-0 cursor-pointer right-0 p-1 bg-transparent`}
                        onClick={showNextImage}
                    >
                        <ChevronRightCircle
                        />
                    </button>
                </div>
            )}


            <div className='flex'>
                {galleryImages.map((src, index) => (
                    <button
                        key={index}
                        className={`${imageIndex === index ? 'border-red-800 border-2' : 'border-gray-400 border'} w-16 mx-2 rounded-sm cursor-pointer block hover:scale-125 focus-visible:scale-125 transition duration-100 ease-in-out`}
                        onClick={() => setImageIndex(index)}
                    >
                        <img
                            alt="Product"
                            src={formatImage(src, "b")}
                        />
                    </button>
                ))}
            </div>

        </div>

    )
}