import { useEffect, useState } from 'react';
import FenderAd from "../../../images/ad/FenderAd.png"
import GibsonAd from '../../../images/ad/GibsonAd.png';
import TaylorAd from '../../../images/ad/TaylorAd.png';
import { ArrowBigLeft, ArrowBigRight, Circle, CircleDot } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const adImages = [
    {
        url: FenderAd,
        path: "Guitars/Electric%20Guitars/Fender%20Stratocaster%20'69%20Nos%202003%20Electric%20Guitar/Sparkle%20Blue"
    }, 
    {
        url: GibsonAd,
        path: "Guitars/Electric%20Guitars/Gibson%20Les%20Paul%20Standard%20'60s%20Figured%20Top%20Electric%20Guitar/Unburst"
    }, 
    {
        url: TaylorAd,
        path: "Guitars/Acoustic%20Guitars/Taylor%2050th%20Anniversary%20Builder's%20Edition%20314ce%20LTD/Natural"
    }];

export const SlidingAd = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const navigate = useNavigate();

    const showPrevImage = () => {
        setImageIndex(index => {
            if (index === 0) return adImages.length - 1;
            return index - 1;
        })
    }

    const showNextImage = () => {
        setImageIndex(index => {
            if (index === adImages.length - 1) return 0;
            return index + 1;
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            showNextImage();
        }, 5000);

        return () => clearInterval(interval);
    }, [imageIndex])

    const handleAdClick = (path: string) => {
        navigate(path)
    }

    return (
        <div className='w-5/6 h-full flex flex-col items-center relative m-auto mb-8'>
            <div className='w-full h-full flex flex-row overflow-hidden'>
                {adImages.map(ad => (
                   
                    <img
                        key={ad.url}
                        src={ad.url}
                        className="w-full h-full flex-shrink-0 flex-grow-0 cursor-pointer"
                        style={{
                            translate: `${-100 * imageIndex}%`,
                            transition: 'translate 300ms ease-in-out'
                        }}
                        onClick={() => handleAdClick(ad.path)}
                    />
                
                   
                ))}
            </div>

            <div className='self-start'>
                <button
                    className='arrow-btn block absolute top-0 bottom-0 cursor-pointer left-0 p-1 hover:bg-black focus-visible:bg-black hover:bg-opacity-20 focus-visible:bg-opacity-20 transition duration-2000 ease-in-out bg-transparent'
                    onClick={showPrevImage}
                >
                    <ArrowBigLeft
                    />
                </button>
                <button
                    className='arrow-btn block absolute top-0 bottom-0 cursor-pointer right-0 p-1 hover:bg-black focus-visible:bg-black hover:bg-opacity-20 focus-visible:bg-opacity-20 transition duration-2000 ease-in-out bg-transparent'
                    onClick={showNextImage}
                >
                    <ArrowBigRight

                    />
                </button>
            </div>
            <div className='absolute bottom-2 left-1/2 -translate-x-2/4 flex gap-1'>
                {adImages.map((_, index) => (
                    <button
                        className='circle-btn cursor-pointer block w-4 h-4 hover:scale-125 focus-visible:scale-125 transition duration-100 ease-in-out'
                        onClick={() => setImageIndex(index)}
                    >
                        {index === imageIndex ? <CircleDot /> : <Circle />}
                    </button>
                ))}
            </div>

        </div>
    )
}