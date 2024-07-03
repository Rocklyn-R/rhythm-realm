import { useParams } from "react-router-dom";
import { ProductsPage } from "../features/ProductsPage/ProductsPage";

export const ProductsPageWrapper = () => {
    const { categoryName, subcategoryName } = useParams();
    console.log(categoryName);
    console.log(subcategoryName);
    return <ProductsPage key={`${categoryName}-${subcategoryName}`} />;
  };