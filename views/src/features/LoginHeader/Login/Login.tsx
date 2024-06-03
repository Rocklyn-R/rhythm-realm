import { Input } from "antd"


export const Login = () => {


    return (
        <div 
        className="flex flex-col justify-center items-center w-full pt-6 pb-8 border-b-2 border-gray-300"
        >
            <form className="flex flex-col justify-center items-center">
                <div className=" bg-red-800 rounded-md w-5/6 p-6">
                    <Input
                        placeholder="Email"
                        className="mb-6"
                    />
                    <Input.Password
                        placeholder="Password"
                        className="text-xl"
                    />
                </div>

                <button className="hover:bg-red-800 transition-colors duration-300 ease p-4 w-5/6 rounded-md bg-black text-white text-xl mt-6">Sign in</button>
            </form>
        </div>

    )
}