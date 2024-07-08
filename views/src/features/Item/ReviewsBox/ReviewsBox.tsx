import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectReviews, selectSelectedProduct } from "../../../redux-store/ProductsSlice"
import { StarRating } from "../StarRating/StarRating";
import { FaRegCircleCheck } from "react-icons/fa6";
import { Reviews } from "./Reviews/Reviews";
import { Bar } from "./Bar/Bar";
import { Select, SelectProps } from "antd";
import { Review } from "../../../types/types";
import { ReviewForm } from "./ReviewForm/ReviewForm";


const calculateStarPercentages = (reviews: Review[]) => {
    const totalReviews = reviews.length;
    const starCounts = [0, 0, 0, 0, 0]; // Index 0 for 1 star, 1 for 2 stars, etc.

    reviews.forEach(review => {
        starCounts[review.rating - 1]++;
    });

    return starCounts.map(count => (count / totalReviews) * 100);
};

export const ReviewsBox = () => {
    const reviews = useSelector(selectReviews);
    const selectedProduct = useSelector(selectSelectedProduct);
    const recommendCount = reviews.filter(review => review.recommend).length;
    const percentageRecommend = Math.round((recommendCount / reviews.length) * 100);
    const percentages = calculateStarPercentages(reviews);
    const [sortByValue, setSortByValue] = useState("Most Recent");
    const sortOptions = ["Most Recent", "Lowest Rated", "Highest Rated", "Oldest"];
    const [filterValue, setFilterValue] = useState<number | null>(null);
    const filteredReviews = filterValue ? reviews.filter(review => review.rating === filterValue) : null;
    const [showWriteReview, setShowWriteReview] = useState(false);

    const handleSelectSortByValue: SelectProps['onChange'] = (value) => {
        setSortByValue(value);
    }


    return (
        <div className="py-10 px-20 w-full">
            {reviews.length === 0 ? (
                <div className="flex flex-col items-center w-full">
                    <h3 className="mb-4">Be the first to review this product.</h3>
                    <button
                        onClick={() => {
                            setShowWriteReview(true);
                            setTimeout(() => {
                                window.scrollTo({
                                    top: 1910,
                                    behavior: 'smooth'
                                });
                            }, 100);
                        }}
                        className="py-2 px-4 bg-red-700 text-white rounded-sm">Write Review
                    </button>
                    {showWriteReview && (
                        <ReviewForm
                            setShowWriteReview={setShowWriteReview}
                        />
                    )}
                </div>
            ) : (
                <>
                    <div className="flex space-x-4">
                        <div className="flex flex-col w-1/3 items-center bg-gray-200 justify-center space-y-3">
                            <p className="text-5xl font-bold">{selectedProduct.avg_rating}</p>
                            <StarRating rating={selectedProduct.avg_rating} />
                            <p>{reviews.length} Reviews</p>
                            <button
                                onClick={() => {
                                    setShowWriteReview(true);
                                    setTimeout(() => {
                                        window.scrollTo({
                                            top: 2100,
                                            behavior: 'smooth'
                                        });
                                    }, 100);
                                }}
                                className="py-2 px-4 bg-red-700 text-white rounded-sm">Write Review
                            </button>
                        </div>
                        <div className="flex flex-col w-1/3 items-center bg-gray-200 justify-center space-y-4">
                            <div className="flex items-center justify-center text-4xl font-semibold text-green-700">
                                <FaRegCircleCheck className="mr-2" />
                                <p>{percentageRecommend}%</p>
                            </div>
                            <p className="w-2/3 text-sm text-center">of respondents would recommend this to a friend</p>
                        </div>
                        <div className="py-10 px-16 flex flex-col w-1/3 items-center bg-gray-200 justify-center">
                            {percentages.reverse().map((percentage, index) => (
                                <button onClick={() => setFilterValue(5 - index)} key={index} className="flex items-center mb-4 w-full">
                                    <span className="w-20 font-semibold">{5 - index}</span>
                                    <Bar percentage={percentage} />
                                    <span className="ml-2 font-semibold">{Math.round(percentage)}%</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {showWriteReview && (
                        <ReviewForm
                            setShowWriteReview={setShowWriteReview}
                        />
                    )}
                    <div className="flex rounded-md mt-10 px-4 py-4 bg-gray-300 items-center justify-between">
                        <h3 className="text-lg font-semibold">
                            {filteredReviews
                                ? `${filteredReviews.length} ${filteredReviews.length === 1 ? 'result' : 'results'}`
                                : `Reviewed by ${reviews.length} customers`}
                        </h3>
                        <Select
                            onChange={handleSelectSortByValue}
                            value={sortByValue}
                            style={{
                                height: "50px",
                                fontFamily: "Montserrat",
                                fontSize: "2rem",
                            }}
                            options={[
                                ...sortOptions.map(option => ({
                                    value: option,
                                    label: option
                                }))
                            ]}
                        />
                    </div>
                    <Reviews
                        sortByValue={sortByValue}
                        filterValue={filterValue}
                        filteredReviews={filteredReviews}
                        setFilterValue={setFilterValue}
                    />
                </>
            )}

        </div>
    )
}