import { Link, useLocation, useParams } from "react-router-dom";
import { formatCategoryNameForDisplay } from "../../utilities/utilities";
import { selectCategories, selectProducts, selectSubcategories, setProducts, setSelectedProduct, setSubcategories } from "../../redux-store/ProductsSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getSubcategories } from "../../api/categories";
import { useDispatch } from "react-redux";
import { getProducts } from "../../api/products";

export const Products = () => {
    const { categoryName, subcategoryName } = useParams<{ categoryName: string, subcategoryName?: string }>();
    const allCategories = useSelector(selectCategories)
    const id = allCategories.find(item => item.name === categoryName)!.id;
    const allSubcategories = useSelector(selectSubcategories);
    const dispatch = useDispatch();
    const allProducts = useSelector(selectProducts);

    const formattedSubcategoryName = subcategoryName ? formatCategoryNameForDisplay(subcategoryName) : "";

    useEffect(() => {
        const fetchSubcategories = async () => {
            const subcategoryData = await getSubcategories(id);
            if (subcategoryData) {
                dispatch(setSubcategories(subcategoryData))
            }
        }
        if (allSubcategories.length === 0) {
            fetchSubcategories();
        }
    }, [dispatch]);

    useEffect(() => {
        const fetchProducts = async () => {
            const productsData = await getProducts(formattedSubcategoryName);
            if (productsData) {
                console.log(productsData);
                dispatch(setProducts(productsData))
            }
        }
        fetchProducts();
    }, [dispatch])


    return (
        <div className="flex flex-col items-center">
            <h2 className="text-center text-xl">{formattedSubcategoryName}:</h2>
            <div className="flex flex-wrap justify-center sm:w-full md:w-full lg:w-5/6">
                {allProducts.map(product => (
                    <div className="mx-8 w-32 sm:w-36 md:w-40 lg:w-48 mt-8 bg-white">
                        <button className="hover:border border-black" onClick={() => dispatch(setSelectedProduct(product))}>
                            <Link to={`/${categoryName}/${subcategoryName}/${product.name}/${product.variant_name}`}>
                                <img src={product.image1} />
                                <p className="p-1">{product.name} {product.variant_name}</p>
                                <p className="pt-1">${product.price}</p>
                            </Link>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}