import { useSelector } from "react-redux"
import { selectUserEmail, selectFirstName, selectLastName } from "../../../../redux-store/UserSlice"

export const AccountDetails = () => {
    const userFirstName = useSelector(selectFirstName);
    const userLastName = useSelector(selectLastName);
    const userEmail = useSelector(selectUserEmail);
    
    return (
        <div className="w-full flex items-start flex-col pt-4">
        <p>Name: {userFirstName} {userLastName}</p>
        <p>Email: {userEmail}</p>
    </div>
    )
}