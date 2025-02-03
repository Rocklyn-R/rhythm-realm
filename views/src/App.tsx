import './App.css';
import { Home } from './features/Home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Subcategories } from './features/Subcategories/Subcategories';
import { Item } from './features/Item/Item';
import { Layout } from './wrappers/Layout';
import { ShoppingCart } from './features/ShoppingCart/ShoppingCart';
import { Checkout } from './features/Checkout/Checkout';
import { useUserFetch } from './hooks/useUserFetch';
import { useInitializeCart } from './hooks/useInitializeCart';
import { useFetchWishList } from './hooks/useFetchWishList';
import { ScrollTop } from './utilities/ScrollTop';
import { ProductsPageWrapper } from './wrappers/ProductsPageWrapper';
import { WishList } from './features/WishList/WishList';
import { AccountSettings } from './features/AccountSettings/AccountSettings';
import { OrderHistory } from './features/OrderHistory/OrderHistory';
import { useFetchOrderHistory } from './hooks/useFetchOrderHistory';
import { Returns } from './features/Returns/Returns';
import { OrderComplete } from './features/Checkout/OrderComplete/OrderComplete';
import { AddressBook } from './features/AddressBook/AddressBook';
import { useFetchAddressBook } from './hooks/useFetchAddressBook';
import { ResetPassword } from './features/User/ResetPassword/ResetPassword';

export const App = () => {
  useUserFetch();
  useInitializeCart();
  useFetchWishList();
  useFetchAddressBook();
  useFetchOrderHistory();

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
           path={'/reset-password/:token'}
           element={<ResetPassword />}
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
            path="/Checkout/:orderNo"
            element={<OrderComplete />}
          />
          <Route
            path="/OrderHistory"
            element={<OrderHistory />}
          />
          <Route 
            path="/Returns"
            element={<Returns />}
          />
          <Route
            path='/SearchResults'
            element={<ProductsPageWrapper />}
          />
          <Route 
            path="/WishList"
            element={<WishList />}
          />
          <Route 
            path="/AddressBook"
            element={<AddressBook />}
          />
          <Route 
            path="/AccountSettings"
            element={<AccountSettings />}
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
