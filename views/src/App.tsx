import './App.css';
import { Header } from './features/Header/Header';
import { Home } from './features/Home/Home';
import { NavBar } from './features/NavBar/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Subcategories } from './features/Subcategories/Subcategories';
import { Products } from './features/Products/Products';
import { useEffect } from 'react';
import { setCategories } from './redux-store/ProductsSlice';
import { useDispatch } from 'react-redux';
import { getCategories } from './api/categories';
import { Item } from './features/Item/Item';
import { Breadcrumbs } from './features/Breadcrumbs/Breadcrumb';
import { Layout } from './Layout';
import { ShoppingCart } from './features/ShoppingCart/ShoppingCart';
import { Checkout } from './features/Checkout/Checkout';
import { useUserFetch } from './hooks/useUserFetch';
import { useInitializeCart } from './hooks/useInitializeCart';

export const App = () => {
  useUserFetch();
  useInitializeCart();

  return (

    <BrowserRouter>
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
            path="/:categoryName"
            element={<Subcategories />}
          />
          <Route
            path="/:categoryName/:subcategoryName"
            element={<Products />}
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
