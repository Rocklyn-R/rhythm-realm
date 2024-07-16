import './App.css';
import { Home } from './features/Home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Subcategories } from './features/Subcategories/Subcategories';
import { ProductsPage } from "./features/ProductsPage/ProductsPage";
import { Item } from './features/Item/Item';
import { Layout } from './wrappers/Layout';
import { ShoppingCart } from './features/ShoppingCart/ShoppingCart';
import { Checkout } from './features/Checkout/Checkout';
import { useUserFetch } from './hooks/useUserFetch';
import { useInitializeCart } from './hooks/useInitializeCart';
import { useFetchWishList } from './hooks/useFetchWishList';
import { ScrollTop } from './utilities/ScrollTop';
import { ProductsPageWrapper } from './wrappers/ProductsPageWrapper';


export const App = () => {
  useUserFetch();
  useInitializeCart();
  useFetchWishList();

  return (

    <BrowserRouter>
      <ScrollTop />
      <Routes>
        <Route
          path="/"
          element={<Layout />}
        >
          <Route
            index
            element={<Home />}
          />
          <Route
            path="/Cart"
            element={<ShoppingCart />}
          />
          <Route
            path="/Checkout"
            element={<Checkout />}
          />
          <Route
            path='/SearchResults'
            element={<ProductsPageWrapper />}
          />
          <Route
            path="/:categoryName"
            element={<Subcategories />}
          />
          <Route
            path="/:categoryName/:subcategoryName"
            element={<ProductsPageWrapper />}
          />
          <Route
            path="/:categoryName/:subcategoryName/:productName/"
            element={<Item />}
          />
          <Route
            path="/:categoryName/:subcategoryName/:productName/:variantName"
            element={<Item />}
          />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
