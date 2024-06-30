import ShoppingBag from '../../../images/shopRhythmRealm/shopping-bag.png';
import GuitarPlay from '../../../images/shopRhythmRealm/guitar-play.png';
import World from '../../../images/shopRhythmRealm/world.png';
import Rock from '../../../images/shopRhythmRealm/rock-symbol.png';
import { FiPhone } from "react-icons/fi";

export const ShopRhythmRealm = () => {
    return (
        <div className="w-full flex flex-col items-center bg-gray-200 py-10">
            <div className="lg:w-2/3 px-4 w-full flex flex-col items-center">
                <h1 className="text-4xl text-center text-red-800 font-bold mb-10">Why Shop at Rhythm Realm?</h1>
                <h2 className="text-2xl font-semibold text-center mb-10">With a commitment to quality and service, we support all musicians, wherever they are in their musical journey.</h2>
                <button className="p-4 hover:bg-black transition-colors duration-300 ease flex-1 x-36 py-4 mx-4 rounded-md bg-red-800 text-white text-xl">Learn More</button>
            </div>
            <div className='flex flex-col sm:flex-row sm:space-y-0 sm:items-start items-center space-y-6 w-4/5 justify-center mt-10'>
                <div className='flex flex-col items-center px-8 sm:w-1/5'>
                    <img alt="World" src={World} width={80} />
                    <p className='text-center mt-2 font-medium'>World's Largest Selection</p>
                </div>
                <div className='flex flex-col items-center px-8 sm:w-1/5'>
                    <img alt="Guitar Playing" src={GuitarPlay} width={80} />
                    <p className='text-center mt-2 font-medium'>Try Before You Buy</p>
                </div>
                <div className='flex flex-col items-center px-8 sm:w-1/5'>
                    <img alt="Shopping bag" src={ShoppingBag} width={80} />
                    <p className='text-center mt-2 font-medium'>Shop With Ease</p>
                </div>
                <div className='flex flex-col items-center px-8 sm:w-1/5'>
                    <img alt="Rock" src={Rock} width={80} />
                    <p className='text-center mt-2 font-medium'>Play With Confidence</p>
                </div>
            </div>
            <div className='py-6 mt-10 w-2/3 border border-gray-300 rounded-md bg-white flex flex-col lg:flex-row items-center justify-evenly'>
                <h4 className='font-semibold text-lg text-center'>Expert Advice: Get personalized recommendations</h4>
                <div className='text-red-800 mt-4 lg:mt-0 flex border-2 border-red-800 items-center px-4 py-1 rounded-md'>
                    <FiPhone className='mr-2 text-xl' />
                    <p className='text-lg font-semibold'>703-687-7317</p>
                </div>
            </div>
        </div>
    )
}