import GuitarsImg from "../../../images/categories/Guitars.png";
import BassesImg from "../../../images/categories/Bass.png";
import DrumsImg from "../../../images/categories/Drums.png";
import KeysImg from "../../../images/categories/Keys.png";
import StringsImg from "../../../images/categories/Strings.png";
import WindsImg from "../../../images/categories/Winds.png";
import AudioImg from "../../../images/categories/Audio.png";
import AccessoriesImg from "../../../images/categories/Accessories.png";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../../api/categories";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories, setCategories } from "../../../redux-store/ProductsSlice";


export const Categories = () => {
    const dispatch = useDispatch();
    const instrumentCategories = useSelector(selectCategories);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoryData = await getCategories();
            if (categoryData) {
                dispatch(setCategories(categoryData));
            }
        }
        fetchCategories();
    }, [dispatch])

   
 
    return (
        <div className="flex flex-col items-center">
            <h1 className="mb-8 text-3xl text-center font-bold">Rhythm Realm - Online Shop for Musical Instruments</h1>
            <h2 className="text-center text-xl">Shop by category:</h2>
            <div className="flex flex-wrap justify-center sm:w-full md:w-full lg:w-5/6">
              {instrumentCategories.map((category) => (
                <div className="border border-black mx-8 w-32 sm:w-36 md:w-40 lg:w-48 mt-8">
                    <button>
                        <Link to={`/${category.name}`}>
                            <img src={category.image} />
                            {category.name}
                        </Link>
                    </button>
                </div>
            ))}
            </div>
        </div>
    )
}