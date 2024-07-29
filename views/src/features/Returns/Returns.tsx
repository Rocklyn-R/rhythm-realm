import { Input } from "antd";
import { useState } from "react";
import jsPDF from "jspdf";
import { IoMdDocument } from 'react-icons/io';
import { findOrder } from "../../api/order";

const fakeAddress = `
123 Return Street
Return City, RC 12345
Country
`;

export const Returns = () => {
    const [orderNoInput, setOrderNoInput] = useState("");
    const [pdfUrl, setPdfUrl] = useState("");
    const [showInput, setShowInput] = useState(true);
    const [orderNum, setOrderNum] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const submitFindOrder = async () => {
        const result = await findOrder(orderNoInput);
        if (result.length > 0) {
            setOrderNum(orderNoInput);
            generatePDF();
            setOrderNoInput("");
            setShowErrorMessage(false);
        } else {
            setShowErrorMessage(true);
        }
    }

    const returnInstructions = [{
        number: "Print the Return Authorization Form:",
        bullets: ["Click the “Download Return PDF” link to generate and download the return authorization form.",
            "Print the form using your home printer."
        ]
    },
    {
        number: "Prepare the Return Package:",
        bullets: ["Carefully pack the item(s) you wish to return. Ensure that the items are securely packed to avoid damage during transit.",
            "Include the printed return authorization form inside the package. This form is essential for processing your return."
        ]
    },
    {
        number: "Attach Shipping Labels:",
        bullets: ["If a return shipping label was provided, affix it securely to the outside of the package. Ensure the label is clearly visible.",
            "If a return shipping label was not provided, please use a reliable courier service to ship the package. Make sure to keep a copy of the shipping receipt."
        ]
    },
    {
        number: "Ship the Package:",
        bullets: ["Drop off the package at your nearest courier location or schedule a pickup, depending on your chosen shipping method.",
            "Retain the tracking number for your reference. This will help you track the package and confirm delivery."
        ]
    },
    {
        number: "Await Confirmation:",
        bullets: [
            "Once the returned item is received and inspected, you will be notified of the status of your return.",
            "If approved, a refund or exchange will be processed as per our return policy."]
    }]

    const generatePDF = () => {
        if (!orderNoInput) {
            alert('Please enter an order number.');
            return;
        }

        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text("Return Authorization Form", 14, 22);

        // Add order number
        doc.setFontSize(12);
        doc.text(`Order Number: ${orderNoInput}`, 14, 40);

        // Add fake address
        doc.text("Return Address:", 14, 60);
        doc.text(fakeAddress, 14, 70);

        // Add instructions
        doc.text("Please include this form with your return shipment.", 14, 120);

        // Generate a Blob URL
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        setShowInput(false)
    };

    return (
        <div className="flex flex-col mb-14 px-4 w-full items-center">
            <h2 className="text-3xl text-center font-bold mb-6">Returns</h2>
            <div className="flex flex-col items-center p-6 w-2/3 bg-white rounded-md shadow-lg space-y-4">
                {showInput && (
                    <>
                        <p>Enter the order number of the order you wish to return:</p>
                        <div className="flex space-x-4 items-center w-full justify-center">
                            <Input
                                placeholder="Order No:"
                                value={orderNoInput}
                                onChange={(e) => setOrderNoInput(e.target.value)}
                                className="w-1/2"
                            />
                            <button onClick={submitFindOrder} className="hover:bg-red-800 transition-colors duration-300 ease x-36 p-4 rounded-md bg-black text-white text-xl self-center">Submit</button>
                        </div>
                    </>
                )}
                {showErrorMessage && (
                    <p className="text-red-800">Invalid Order Number</p>
                )}


                {pdfUrl && (
                    <div className="p-6 w-full space-y-6">
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="flex w-full justify-center items-center space-x-2 text-blue-600">
                            <IoMdDocument className="text-2xl" />
                            <span>Download Return PDF for Order No: {orderNum}</span>
                        </a>
                        <h2 className="text-xl font-semibold w-full text-center">Return Instructions</h2>
                        {returnInstructions.map((step, index) => (
                            <div key={index} className="space-y-4">
                                <p className="font-semibold text-lg mt-4">{index + 1}. {step.number}</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    {step.bullets.map((bullet, bulletIndex) => (
                                        <li key={bulletIndex}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}