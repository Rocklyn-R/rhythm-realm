import { Link } from "react-router-dom"

export const NavBar = () => {
    return (
        <div className="hidden sm:block">
            <ul className="flex justify-around p-2 bg-gray-900 text-gray-100 text-lg">
                <li><Link to="/guitars" className="hover:underline">Guitars</Link></li>
                <li><Link to="/basses" className="hover:underline">Basses</Link></li>
                <li><Link to="/drums" className="hover:underline">Drums</Link></li>
                <li><Link to="/keys" className="hover:underline">Keys</Link></li>
                <li><Link to="/strings" className="hover:underline">Strings</Link></li>
                <li><Link to="/winds" className="hover:underline">Winds</Link></li>
                <li><Link to="/audio" className="hover:underline">Audio</Link></li>
                <li><Link to="/accessories" className="hover:underline">Accessories</Link></li>
            </ul>
        </div>
    )
}