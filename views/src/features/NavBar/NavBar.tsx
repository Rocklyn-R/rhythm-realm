import { Link } from "react-router-dom"

export const NavBar = () => {
    return (
        <div className="hidden sm:block">
            <ul className="flex justify-around p-2 bg-gray-900 text-gray-100 text-lg">
                <li><Link to="/Guitars" className="hover:underline">Guitars</Link></li>
                <li><Link to="/Basses" className="hover:underline">Basses</Link></li>
                <li><Link to="/Drums" className="hover:underline">Drums</Link></li>
                <li><Link to="/Keys" className="hover:underline">Keys</Link></li>
                <li><Link to="/Strings" className="hover:underline">Strings</Link></li>
                <li><Link to="/Winds" className="hover:underline">Winds</Link></li>
                <li><Link to="/Audio" className="hover:underline">Audio</Link></li>
                <li><Link to="/Accessories" className="hover:underline">Accessories</Link></li>
            </ul>
        </div>
    )
}