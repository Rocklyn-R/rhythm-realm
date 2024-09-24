import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../../api/categories";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories, setCategories } from "../../../redux-store/ProductsSlice";


export const Categories = () => {
  const dispatch = useDispatch();
  const instrumentCategories = useSelector(selectCategories);
  const filteredCategories = instrumentCategories.filter(category => category.name !== "Featured");
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
      <h2 className="text-center text-xl mb-6">Shop by category:</h2>
      <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8 w-fit max-w-7xl">
        {filteredCategories.map((category) => (
          <Link
            to={`/${category.name}`}
            key={category.name}
            className="relative group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-60 h-60 transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
              <p className="text-white text-lg font-bold text-center">{category.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}