import { FaUser } from "react-icons/fa";
import { SlidingLogin } from "./SlidingLogin/SlidingLogin";
import { selectFirstName, selectIsAuthenticated, selectHeaderIsOpen, setHeaderIsOpen, selectCartQuestion } from "../../redux-store/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { UserAccount } from "./UserAccount/UserAccount";
import { HandleCart } from "./HandleCart/HandleCart";

export const UserHeader = () => {
    const userHeaderIsOpen = useSelector(selectHeaderIsOpen)
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userFirstName = useSelector(selectFirstName);
    const dispatch = useDispatch();
    const cartQuestion = useSelector(selectCartQuestion);

    const toggleUserHeader = () => {
        dispatch(setHeaderIsOpen());
    }

    return (
        <>
            <button
                className="flex flex-col items-center"
                onClick={() => toggleUserHeader()}
            >
                <FaUser className="text-3xl" />
                <p>{isAuthenticated ? `Hi, ${userFirstName}` : "Sign In"}</p>
            </button>
    
            <div
                className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform z-50 ${
                    userHeaderIsOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {isAuthenticated ? (
                    <UserAccount toggleUserAccount={toggleUserHeader} isOpen={userHeaderIsOpen} />
                ) : (
                    <SlidingLogin toggleLogin={toggleUserHeader} isOpen={userHeaderIsOpen} />
                )}
            </div>
    
      
            {userHeaderIsOpen && (
                <div
                    onClick={toggleUserHeader}
                    className="fixed inset-0 bg-black opacity-50 z-40"
                ></div>
            )}
    
    
            {cartQuestion && (
                <>
                
                    <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
    
             
                    <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
                        <HandleCart toggleUserHeader={toggleUserHeader} />
                    </div>
                </>
            )}
        </>
    );
}