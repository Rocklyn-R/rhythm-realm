import { Input, SelectProps, Select } from "antd"
import { useState } from "react";
import { FaX } from "react-icons/fa6";
const { TextArea } = Input; // Destructuring TextArea from Input

interface ReviewFormProps {
    setShowWriteReview: (arg0: boolean) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ setShowWriteReview }) => {
    const [headline, setHeadline] = useState("");
    const [comments, setComments] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [wouldRecommend, setWouldRecommend] = useState("");

    const handleSelectRecommend: SelectProps['onChange'] = (value) => {
        setWouldRecommend(value);
    }


    return (
        <div className="mt-10 bg-gray-200 p-6 rounded-lg relative">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
                <button onClick={() => setShowWriteReview(false)} className="absolute right-4 top-4 text-xl"><FaX /></button>
            </div>

            <form className="space-y-6 flex flex-col">
                <div className="flex flex-col">
                    <label className="font-semibold mb-2">Headline:</label>
                    <Input
                        placeholder="I would buy this product again and again."
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2">Comments:</label>
                    <TextArea
                        autoSize={{ minRows: 4 }} // Adjust the number of rows as per your design
                        placeholder="How you use the product. Things that are great about it. Things that aren't great about it."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2">Would you recommend this product to a friend?</label>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            value="Yes"
                            checked={wouldRecommend === 'Yes'}
                            onChange={() => setWouldRecommend('Yes')}
                            className="mr-3 custom-radio"
                        />
                        <p>Yes</p>
                    </div>
                    <div className="flex items-center mt-2">
                        <input
                            type="radio"
                            value="No"
                            checked={wouldRecommend === 'No'}
                            onChange={() => setWouldRecommend('No')}
                            className="mr-3 custom-radio"
                        />
                        <p>No</p>
                    </div>

                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2">First Name:</label>
                    <Input
                        placeholder="Ex: James"
                        value={headline}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2 flex">Order Number (optional): </label>
                    <Input
                        placeholder="Ex: CFG12934920"
                        value={headline}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <p className="text-xs">This is used to verify your purchase.</p>
                </div>
                <button className="hover:bg-red-800 transition-colors duration-300 ease flex-1 x-36 p-4 mx-4 mt-6 rounded-md bg-black text-white text-xl self-center">Submit Review</button>
            </form>
        </div>
    );
}