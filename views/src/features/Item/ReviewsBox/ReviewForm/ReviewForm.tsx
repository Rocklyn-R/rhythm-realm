import { Rating } from "@mui/material";
import { Input } from "antd"
import { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectFirstName, selectIsAuthenticated } from "../../../../redux-store/UserSlice";
import { getAverageRating, postReview } from "../../../../api/products";
import { addReview, selectSelectedProduct, setAverageRating } from "../../../../redux-store/ProductsSlice";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";
const { TextArea } = Input; // Destructuring TextArea from Input

interface ReviewFormProps {
    setShowWriteReview: (arg0: boolean) => void;
    reviewsRef: React.RefObject<HTMLDivElement>;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ reviewsRef, setShowWriteReview }) => {
    const [headline, setHeadline] = useState("");
    const [comments, setComments] = useState("");
    const [firstName, setFirstName] = useState("");
    const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userFirstName = useSelector(selectFirstName);
    const selectedProduct = useSelector(selectSelectedProduct);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [missingRating, setMissingRating] = useState("");
    const [missingRecommend, setMissingRecommend] = useState("");
    const dispatch = useDispatch();


    const isSmallScreen = useMediaQuery("(max-width:450px)");
    const isExtraSmallScreen = useMediaQuery("(max-width:350px)")

    useEffect(() => {
        if (isAuthenticated) {
            setFirstName(userFirstName);
        }
    }, [isAuthenticated, userFirstName])


    const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (headline && comments && firstName && (wouldRecommend !== null) && rating) {

            const reviewData = await postReview(selectedProduct.id, rating, headline, comments, firstName, wouldRecommend, orderNumber);

            if (reviewData) {
                setShowSuccessMessage(true);

                dispatch(addReview(reviewData));
                if (reviewsRef.current) {
                    reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
                }
                setShowWriteReview(false);
                const newAverageRating = await getAverageRating(selectedProduct.id);

                if (newAverageRating) {
                    dispatch(setAverageRating(newAverageRating));
                }
            }
        }
        if (!rating) {
            setMissingRating("Please rate the product.");
        }
        if (wouldRecommend === null) {
            setMissingRecommend("Please select one.")
        }
    }

    useEffect(() => {
        if (!showSuccessMessage) return;

        const timeout = setTimeout(() => {
            setShowSuccessMessage(false);
            setShowWriteReview(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, [showSuccessMessage, setShowSuccessMessage, setShowWriteReview]);


    return (
        <div className="mt-10 bg-gray-200 py-12 lg:px-20 md:px-8 px-6 rounded-lg relative w-full">
            {showSuccessMessage ? (
                <p className="py-20 flex justify-center text-xl font-semibold">Your review has been submitted!</p>
            ) : (
                <>
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
                        <button onClick={() => setShowWriteReview(false)} className="absolute right-4 top-4 text-xl"><FaX /></button>
                    </div>

                    <form id="review" className="space-y-6 flex flex-col" onSubmit={handleSubmitReview}>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-2">Headline:</label>
                            <Input
                                name="Headline"
                                placeholder="I would buy this product again and again."
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-2">Comments:</label>
                            <TextArea
                                autoSize={{ minRows: 4 }} // Adjust the number of rows as per your design
                                placeholder="How you use the product. Things that are great about it. Things that aren't great about it."
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="font-semibold mb-2">Your Rating:</label>
                            {missingRating && <p className="text-red-800 -mt-2 mb-2">{missingRating}</p>}
                            <div className="w-full" style={{
                                transform: isExtraSmallScreen ? "scale(0.5)" : isSmallScreen ? "scale(0.8)" : "scale(1)",
                                transformOrigin: "left center"
                            }}>
                                <Rating
                                    name="simple-controlled"
                                    value={rating}
                                    onChange={(event, newValue) => {
                                        if (newValue == null) {
                                            setRating(5);
                                            setMissingRating("");
                                        } else {
                                            setRating(newValue);
                                            setMissingRating("");
                                        }
                                    }}
                                    size={"large"}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-2">Would you recommend this product to a friend?</label>
                            {missingRecommend && <p className="text-red-800 -mt-2 mb-2">{missingRecommend}</p>}
                            <div className="flex items-center">
                                <input
                                    name="Would Recommend"
                                    type="radio"
                                    value="Yes"
                                    checked={wouldRecommend !== null && wouldRecommend !== false}
                                    onChange={() => {
                                        setWouldRecommend(true);
                                        setMissingRecommend("");
                                    }}
                                    className="mr-3 custom-radio"
                                />
                                <p>Yes</p>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    name="Not Recommend"
                                    type="radio"
                                    value="No"
                                    checked={wouldRecommend !== null && wouldRecommend !== true}
                                    onChange={() => {
                                        setWouldRecommend(false);
                                        setMissingRecommend("");
                                    }}
                                    className="mr-3 custom-radio"
                                />
                                <p>No</p>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-2">First Name:</label>
                            <Input
                                name="name"
                                value={firstName}
                                placeholder="Ex: James"
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-2 flex">Order Number (optional): </label>
                            <Input
                                name="Order No."
                                placeholder="Ex: CFG12934920"
                                value={orderNumber ? orderNumber : ""}
                                onChange={(e) => setOrderNumber(e.target.value)}
                            />
                            <p className="text-xs">This is used to verify your purchase.</p>
                        </div>
                        <button type="submit" className="hover:bg-red-800 transition-colors duration-300 ease flex-1 x-36 p-4 mx-4 mt-6 rounded-md bg-black text-white text-xl self-center">Submit Review</button>
                    </form>
                </>
            )}

        </div>
    );
}