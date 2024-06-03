import { Input } from "antd"



export const Signup = () => {
    return (
        <div 
        className="flex flex-col justify-center items-center w-full pt-6 pb-8 border-b-2 border-gray-300"
        >
            <form className="flex flex-col justify-center items-center">
                <div className=" bg-red-800 rounded-md w-5/6 p-6">
                    <Input
                        placeholder="First name"
                        className="mb-6"
                        required
                    />
                    <Input
                        placeholder="Last name"
                        className="mb-6"
                        required
                    />
                    <Input
                        placeholder="Email"
                        className="mb-6"
                        required
                    />
                    <Input.Password
                        placeholder="Password"
                        className="mb-6 text-xl"
                        required
                    />
                </div>
                <p className="text-xs pt-4 w-5/6 font-light text-center">By creating an account, you have agreed to Rhythm Realm's Purchase Terms and Conditions, and you have reviewed Rhythm Realm's Privacy Policy.
</p>
                <button
                    className="hover:bg-red-800 transition-colors duration-300 ease p-4 w-5/6 rounded-md bg-black text-white text-xl mt-6"
                >
                    Create Account
                </button>
            </form>
        </div>
    )
}