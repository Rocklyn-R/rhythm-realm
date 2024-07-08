import { useParams, useLocation } from "react-router-dom";
import { ProductsPage } from "../features/ProductsPage/ProductsPage";

export const ProductsPageWrapper = () => {
  const { categoryName, subcategoryName } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const brand = searchParams.get('brand');
  
  return <ProductsPage
    key={`${categoryName}-${subcategoryName}`}
    brand={brand || ''}
  />;
};