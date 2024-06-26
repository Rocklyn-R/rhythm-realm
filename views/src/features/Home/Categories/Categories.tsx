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
    <div className="flex flex-col items-center mb-14">
      <h1 className="mb-8 text-3xl text-center font-bold">Rhythm Realm - Online Shop for Musical Instruments</h1>
      <h2 className="text-center text-xl">Shop by category:</h2>
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:w-full md:w-full lg:w-5/6 gap-4 px-8">
        {instrumentCategories.map((category) => (
          <div key={category.name} className="w-40 sm:w-40 md:w-46 lg:w-48 mt-8 mx-auto">
            <button className="">
              <Link to={`/${category.name}`}>
                <img src={category.image} alt={category.name} className="hover:shadow-xl block w-full rounded-md" />
                <p className="font-bold text-lg mt-2">{category.name}</p>
              </Link>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}