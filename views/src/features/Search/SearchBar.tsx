import { IoSearch } from "react-icons/io5";

export const SearchBar = () => {
    return (
        <div className="flex w-1/2 mb-1">
            <input 
                placeholder="Enter search term..."
                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-900 focus:border-red-900 focus:outline-red-900 h-10 p-2.5 w-full"
            />
            <button className="text-2xl p-2 text-gray-100 bg-gray-950 ml-2 rounded-md">
                 <IoSearch />  
            </button>
        </div>
    )
}