import { PiShoppingCartFill } from "react-icons/pi";


export const ShoppingCart = () => {
    return (
        <div>
            <button className="flex flex-col items-center px-3">
                <PiShoppingCartFill className="text-3xl" />
                <p>0 items</p>
                <p>$0.00</p>
            </button>
        </div>
    )
}