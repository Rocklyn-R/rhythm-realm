import './App.css';
import { Header } from './features/Header/Header';
import { Home } from './features/Home/Home';
import { NavBar } from './features/NavBar/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Subcategories } from './features/Subcategories/Subcategories';
import { Products } from './features/Products/Products';
import { useEffect } from 'react';
import { setCategories } from './redux-store/CategoriesSlice';
import { useDispatch } from 'react-redux';
import { getCategories } from './api/categories';
import { Item } from './features/Item/Item';


function App() {

  return (

    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <NavBar />
        <Routes>
          <Route 
            path="/"
            element={<Home />}
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
            path="/:categoryName/:subcategoryName/:productName"
            element={<Item />}
          />
        </Routes>
      </div >
    </BrowserRouter>

  );
}

export default App;
