import { Link } from "react-router-dom"
import PayPalLogo from '../../../images/icons/PaypalLogo.png';

export const CheckoutOrPaypal = () => {
    return (
        <div className="flex flex-col items-center mt-4">
            <Link to="/Checkout" className="w-full">
                <button className="hover:bg-red-800 transition-colors duration-300 ease w-full x-36 p-4 rounded-md bg-black text-white text-xl">
                    Checkout
                </button>
             </Link>    
                <p className="mt-4">OR</p>
                <button className="hover:bg-yellow-500 transition-colors duration-300 ease w-full x-36 py-4 rounded-md bg-yellow-400 text-white text-xl mt-4 flex justify-center">
                    <img alt="PayPal Logo" src={PayPalLogo} width="110" />
                </button>
           

        </div>
    )
}