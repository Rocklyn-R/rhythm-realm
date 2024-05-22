import { Link } from "react-router-dom"

export const NavBar = () => {
    return (
        <div className="hidden sm:block">
            <ul className="flex justify-around p-2 bg-gray-900 text-gray-100 text-lg">
                <li><Link to="/guitars" className="hover:underline">Guitars</Link></li>
                <li><a href="#" className="hover:underline">Basses</a></li>
                <li><a href="#" className="hover:underline">Drums</a></li>
                <li><a href="#" className="hover:underline">Keys</a></li>
                <li><a href="#" className="hover:underline">Strings</a></li>
                <li><a href="#" className="hover:underline">Winds</a></li>
                <li><a href="#" className="hover:underline">Audio</a></li>
                <li><a href="#" className="hover:underline">Accessories</a></li>
            </ul>
        </div>
    )
}