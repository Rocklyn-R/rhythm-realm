import { Input } from "antd"
import { useState } from "react"

export const NewsletterSignUp = () => {
    const [termsChecked, setTermsChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [termsErrorMessage, setTermsErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleCheckTerms = () => {
        setTermsErrorMessage("");
        setTermsChecked(!termsChecked);
    }

    const handleSignUpForNewsletter = (e: any) => {
        e.preventDefault();
        if (!termsChecked) {
            setTermsErrorMessage("Please click the checkbox to agree to receive emails from Rhythm Realm.");
            return;
        } else {
            setSuccessMessage("You have successfully signed up to receive emails with news and offers from Rhythm Realm!")
        }
    }

    return (
        <div className="w-full bg-gray-300 py-10 flex flex-col items-center">
            <h2 className="font-bold text-xl">Be the first to know about exclusive offers, tips and more.</h2>
            {successMessage ? <p className="mt-10">{successMessage}</p> : (
                <>
                <form className="flex items-center w-1/2 mt-6 mb-4" onSubmit={handleSignUpForNewsletter}>
                <Input
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="px-4 py-3 hover:bg-black transition-colors duration-300 ease ml-4 rounded-md bg-red-800 text-white text-xl min-w-fit"
                >
                    Sign Up
                </button>
            </form>
            <div className="flex flex-col w-1/2 items-center justify-center">
                <div className="flex items-center justify-start w-full">
                    <input
                        type="checkbox"
                        checked={termsChecked}
                        onChange={() => handleCheckTerms()}
                        className="mr-3 w-6 h-6 custom-checkbox"
                    />
                    <label>Yes, I would like to receive emails with news and offers from Rhythm Realm.</label>
                </div>
                {termsErrorMessage && <p className="self-start text-red-800 text-sm">{termsErrorMessage}</p>}
            </div>  
                </>
              
            )}
            


        </div>
    )
}