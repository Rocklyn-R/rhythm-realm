import { PiCopyrightBold } from "react-icons/pi";

export const Copyright = () => {
    return (
        <div className="flex bg-black text-white text-xs py-4 justify-evenly">
            <p className="flex items-center font-semibold ">Copyright <PiCopyrightBold className="mx-1" /> Rhythm Realm, Inc. All Rights Reserved.</p>
            <p className="cursor-pointer">Purchase Terms & Conditions</p>
            <p className="cursor-pointer">Your Privacy Rights</p>
            <p className="cursor-pointer">Terms of Use</p>
            <p className="cursor-pointer">Do Not Sell or Share My Info</p>
            <p className="cursor-pointer">Data Rights Request</p>
        </div>
    )
}