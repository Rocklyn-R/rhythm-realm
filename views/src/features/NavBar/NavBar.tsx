import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"
import { setSubcategories } from "../../redux-store/FiltersSlice";

export const NavBar = () => {

    const dispatch = useDispatch();
    return (
        <div className="hidden sm:block">
            <ul className="flex justify-around p-2 bg-gray-900 text-gray-100 text-lg">
                <li><Link onClick={() => dispatch(setSubcategories([]))} to="/Guitars" className="hover:underline">Guitars</Link></li>
                <li><Link onClick={() => dispatch(setSubcategories([]))} to="/Basses" className="hover:underline">Basses</Link></li>
                <li><Link onClick={() => dispatch(setSubcategories([]))} to="/Drums" className="hover:underline">Drums</Link></li>
                <li><Link onClick={() => dispatch(setSubcategories([]))} to="/Keys" className="hover:underline">Keys</Link></li>
                <li><Link onClick={() => dispatch(setSubcategories([]))} to="/Strings" className="hover:underline">Strings</Link></li>
                <li><Link onClick={() => dispatch(setSubcategories([]))} to="/Winds" className="hover:underline">Winds</Link></li>
                <li><Link onClick={() => dispatch(setSubcategories([]))} to="/Audio" className="hover:underline">Audio</Link></li>
                <li><Link onClick={() => dispatch(setSubcategories([]))} to="/Accessories" className="hover:underline">Accessories</Link></li>
            </ul>
        </div>
    )
}