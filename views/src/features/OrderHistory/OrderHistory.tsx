import { useSelector } from "react-redux"
import { selectOrders } from "../../redux-store/UserSlice"

export const OrderHistory = () => {
    const orders = useSelector(selectOrders);
    

    return (
        <div className="flex flex-col mb-14">
            <h2 className="text-3xl text-center font-bold mb-6">Order History</h2>
            <div className="flex flex-col bg-white rounded-md shadow-lg">
                  {orders.map((order, index) => (
                <button key={index} className="flex w-full justify-around">
                    <p>{order.id}</p>
                    <p>{order.status}</p>
                </button>
            ))}
            </div>
          
        </div>
    )
}