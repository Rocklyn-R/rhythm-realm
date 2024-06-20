import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { TfiYoutube } from "react-icons/tfi";
import { FaXTwitter } from "react-icons/fa6";

export const SocialMedia = () => {
    return (
        <div className="bg-gray-200 w-full py-8 flex flex-col items-center">
            <h1 className="text-2xl font-bold">Connect With Us</h1>
            <div className="flex gap-6 items-center mt-6">
                    <FaFacebook className="cursor-pointer text-4xl" />
                    <FaInstagram className="cursor-pointer text-4xl" />
                    <TfiYoutube className="cursor-pointer text-4xl" />
                    <FaXTwitter className="cursor-pointer text-4xl" />
            </div>
        </div>
    )
}