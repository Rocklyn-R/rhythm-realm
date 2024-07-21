import { useSelector } from "react-redux"
import { selectEmail, selectFirstName, selectIsAuthenticated, selectIsLoadingAuth, selectLastName, setUserEmail, setUserFirstName, setUserLastName } from "../../redux-store/UserSlice"
import { FaEdit, FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { updateUserEmail, updateUserName, updateUserPassword } from "../../api/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";





export const AccountSettings = () => {
    const userFirstName = useSelector(selectFirstName);
    const userLastName = useSelector(selectLastName);
    const userEmail = useSelector(selectEmail);
    const [editName, setEditName] = useState(false);
    const [firstName, setFirstName] = useState(userFirstName);
    const [lastName, setLastName] = useState(userLastName);
    const [editEmail, setEditEmail] = useState(false);
    const [email, setEmail] = useState(userEmail);
    const [editPassword, setEditPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
    const navigate = useNavigate();

    const handleChangeName = async () => {
        const updateName = await updateUserName(firstName, lastName);
        if (updateName) {
            dispatch(setUserFirstName(firstName));
            dispatch(setUserLastName(lastName));
        }
        setEditName(false);
    }

    const handleChangeEmail = async () => {
        const updateEmail = await updateUserEmail(email);
        if (updateEmail) {
            dispatch(setUserEmail(email));
        }
        setEditEmail(false);
    }

    const handleChangePassword = async () => {
        if (oldPassword === password) {
            setPasswordError("Both passwords are the same.")
            return;
        }
        const updatePassword = await updateUserPassword(oldPassword, password);
        console.log(updatePassword);
        if (updatePassword === "Success") {
            setPasswordSuccess("Password successfully changed!");
            setEditPassword(false);
            setOldPassword("");
            setPassword("");
            setPasswordError("");
        } else if (updatePassword === "Old password incorrect") {
            setPasswordError("Current password is incorrect.");
        }


    }

    useEffect(() => {
        let timeoutId: any;
        if (passwordSuccess) {
            timeoutId = setTimeout(() => {
                setPasswordSuccess("");
            }, 3000);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [passwordSuccess]);

    useEffect(() => {
        if (!isAuthenticated && !isLoadingAuth) {
            navigate("/");
        }
    }, [isAuthenticated, isLoadingAuth]);

    if (isLoadingAuth) {
        return <div></div>
    }

    return (
        <div className="flex flex-col mb-14 w-full items-center">
            <h2 className="text-3xl text-center font-bold mb-6">Account Settings</h2>
            <div className="flex flex-col bg-white w-3/4 md:w-1/2 lg:w-2/5 shadow-lg items-center rounded-md p-6">
                <div className="flex flex-col items-start w-full space-y-10">
                    <div className={`flex ${editName ? "lg:flex-row flex-col" : "flex-row"} justify-between items-center space-x-8 p-2 rounded-md w-full`}>
                        <p className={`font-semibold ${editName ? "lg:mb-0 mb-4" : ""}`}>Name:</p>
                        {!editName &&
                            <>
                                <p>{userFirstName} {userLastName}</p>
                                <button onClick={() => setEditName(true)} className="ml-auto"><FaEdit /></button>
                            </>
                        }
                        {editName &&
                            <div className="flex space-x-4">
                                <Input
                                    value={firstName}
                                    name="First Name"
                                    placeholder="First Name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <Input
                                    value={lastName}
                                    name="Last Name"
                                    placeholder="Last Name"
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <button onClick={() => handleChangeName()}><FaCheck /></button>
                                <button onClick={() => setEditName(false)} className="text-xl"><FaXmark /></button>
                            </div>
                        }
                    </div>
                    <div className={`flex ${editEmail ? "lg:flex-row flex-col" : "flex-row"} justify-between items-center space-x-4 p-2 rounded-md w-full`}>
                        <p className={`font-semibold ${editEmail ? "lg:mb-0 mb-4" : ""}`}>Email:</p>
                        {!editEmail &&
                            <>
                                <p>{userEmail}</p>
                                <button onClick={() => setEditEmail(true)}><FaEdit /></button>
                            </>
                        }
                        {editEmail &&
                            <>

                                <Input
                                    value={email}
                                    className="w-1/2"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="flex items-center space-x-4 lg:mt-0 mt-4 ">
                                    <button onClick={() => handleChangeEmail()}><FaCheck /></button>
                                    <button onClick={() => setEditEmail(false)} className="text-xl"><FaXmark /></button>
                                </div>

                            </>
                        }
                    </div>
                    <div className={`flex ${editPassword ? "lg:flex-row flex-col" : "flex-row"} justify-between items-center space-x-4 p-2 rounded-md w-full`}>
                        <p className={`font-semibold ${editName ? "lg:mb-0 mb-4" : ""}`}>Password:</p>
                        {!editPassword &&
                            <>
                                <p>*********</p>
                                <button onClick={() => setEditPassword(true)}><FaEdit /></button>
                            </>
                        }
                        {editPassword &&
                            <div className="flex space-x-4">
                                <Input
                                    value={oldPassword}
                                    name="Current Password"
                                    placeholder="Current Password"
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <Input
                                    value={password}
                                    name="New Password"
                                    placeholder="New Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button onClick={() => handleChangePassword()}><FaCheck /></button>
                                <button onClick={() => setEditPassword(false)} className="text-xl"><FaXmark /></button>
                            </div>
                        }
                    </div>
                </div>
                {passwordError && <p className="mt-4 text-red-800">{passwordError}</p>}
            </div>
            {passwordSuccess && <p className="mt-4 w-full flex justify-center text-red-800">{passwordSuccess}</p>}
        </div>
    )
}