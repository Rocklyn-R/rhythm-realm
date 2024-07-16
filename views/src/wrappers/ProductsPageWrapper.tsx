import { useParams, useLocation } from "react-router-dom";
import { ProductsPage } from "../features/ProductsPage/ProductsPage";
import { useState, useEffect } from "react";

export const ProductsPageWrapper = () => {
  const { categoryName, subcategoryName } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const brand = searchParams.get('brand');
  const searchTerm = searchParams.get('searchTerm');

  const [rerenderKey, setRerenderKey] = useState(0);

  useEffect(() => {
    setRerenderKey(prev => prev + 1); // Increment to trigger re-render
  }, [location]);

  return <ProductsPage
    key={rerenderKey}
    brand={brand || ''}
    searchTerm={searchTerm || ''}
  />;
};