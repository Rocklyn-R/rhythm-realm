import { useSelector } from "react-redux"
import { selectReviews } from "../../../../redux-store/ProductsSlice"
import { StarRating } from "../../StarRating/StarRating";
import { formatDate } from "../../../../utilities/utilities";
import { FaCircleCheck } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { Review } from "../../../../types/types";
import { VscChromeClose } from "react-icons/vsc";

interface ReviewsProps {
    sortByValue: string;
    filterValue: null | number;
    filteredReviews: Review[] | null;
    setFilterValue: (arg0: null) => void;
}

export const Reviews: React.FC<ReviewsProps> = ({ sortByValue, filterValue, filteredReviews, setFilterValue }) => {
    const reviews = useSelector(selectReviews);
    const [sortedReviews, setSortedReviews] = useState<Review[]>([]);

    useEffect(() => {
        const sortReviews = () => {
            let sorted;
            if (filteredReviews) {
                sorted = [...filteredReviews];
            } else {
                sorted = [...reviews];
            }

            if (sortByValue === 'Most Recent') {
                sorted.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
            } else if (sortByValue === 'Oldest') {
                sorted.sort((a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime());
            } else if (sortByValue === 'Lowest Rated') {
                sorted.sort((a, b) => a.rating - b.rating);
            } else if (sortByValue === 'Highest Rated') {
                sorted.sort((a, b) => b.rating - a.rating);
            }

            setSortedReviews(sorted);
        };

        sortReviews();
    }, [reviews, sortByValue, filteredReviews]);


    return (
        <div className="mt-4 w-full">
            {filterValue && (
                <div>
                    <h3 className="font-semibold mb-4">Filters applied:</h3>
                    <button onClick={() => setFilterValue(null)} className="bg-gray-200 py-1 justify-between flex px-2 text-sm items-center">{filterValue} Stars <VscChromeClose className="text-md ml-2" /></button>
                </div>
            )}

            {sortedReviews.map((review, index) => (
                <div key={index} className="border-b border-gray-300 py-8">
                    <div className="flex lg:flex-row flex-col justify-start w-full lg:space-x-40">
                        <div className="w-3/4">
                            <h2 className="font-semibold mb-2">{review.title}</h2>
                            <StarRating rating={review.rating} />
                        </div>
                        <div className="flex flex-col lg:mt-0 mt-3 justify-start items-start lg:w-1/5 md:w-1/4 text-xs space-y-2">
                            {review.verified && (
                                <div className="space-x-1 flex">
                                    <FaCircleCheck className="text-green-700 text-lg" /><p>Verified Buyer</p>
                                </div>
                            )}

                            <div className="flex">
                                <p className="mr-1 font-semibold">submitted</p>
                                <p>{formatDate(review.date_created)}</p>
                            </div>
                            <div className="flex">
                                <p className="mr-1 font-semibold">by</p>
                                <p>{review.name}</p>
                            </div>

                        </div>


                    </div>
                    <div>
                        <p className="mt-8 font-light">{review.review}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}