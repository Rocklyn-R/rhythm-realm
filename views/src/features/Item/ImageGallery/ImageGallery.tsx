import { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { selectSelectedProduct } from "../../../redux-store/ProductsSlice"
import { ChevronLeftCircle, ChevronRightCircle, CircleDot, Circle } from "lucide-react";

export const ImageGallery = () => {
    const selectedProduct = useSelector(selectSelectedProduct);
    const [imageIndex, setImageIndex] = useState(0);

    const galleryImages = [selectedProduct.image1, selectedProduct.image2, selectedProduct.image3];


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

    return (

        <div className='m-4 pb-4 bg-white lg:w-1/2 md:w-4/5 lg:ml-10 h-full flex flex-col items-center relative overflow-hidden'>
            
            <div className='lg:w-full md:w-5/6 flex flex-row lg-overflow-hidden pb-8'>

                {galleryImages.map(url => (
                    <img
                        key={url}
                        src={url}
                        className="w-full h-full flex-shrink-0 flex-grow-0"
                        style={{
                            translate: `${-100 * imageIndex}%`,
                            transition: 'translate 300ms ease-in-out'
                        }}
                    />
                ))}
            </div>
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

            <div className='flex'>
                {galleryImages.map((src, index) => (
                    <button
                        className={`${imageIndex === index ? 'border-red-800 border-2' : 'border-gray-400 border'} w-16 mx-2 rounded-sm cursor-pointer block hover:scale-125 focus-visible:scale-125 transition duration-100 ease-in-out`}
                        onClick={() => setImageIndex(index)}
                    >
                        <img
                            src={src}
                        />
                    </button>
                ))}
            </div>

        </div>

    )
}