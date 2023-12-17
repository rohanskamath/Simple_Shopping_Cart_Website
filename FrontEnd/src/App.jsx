import './App.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './Components/MainPage'
import AddCategoryPage from './Components/AddCategoryPage'
import GSTCategoryPage from './Components/GSTCategoryPage';
import AddProductsPage from './Components/AddProductsPage';
import ProductTablePage from './Components/ProductTablePage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={
            <>
              {/* Main Page starts */}
              <section>
                <MainPage />
              </section>
              {/* Main Page ends */}
            </>}>
          </Route>

          <Route exact path='/add-category' element={
            <>
              {/* Add Category Page starts */}
              <section>
                <AddCategoryPage />
              </section>
              {/* Add Category Page ends */}
            </>
          }>
          </Route>

          <Route exact path='/gst-rate-screen' element={
            <>
              {/* GST Page starts */}
              <section>
                <GSTCategoryPage />
              </section>
              {/* GST Page ends */}
            </>
          }>
          </Route>

          <Route exact path='/add-products' element={
            <>
              {/* Add Products Page starts */}
              <section>
                <AddProductsPage />
              </section>
              {/* Add Products Page ends */}
            </>
          }>
          </Route>

          <Route exact path='/product-selection' element={
            <>
              {/* Product Selection Page starts */}
              <section>
                <ProductTablePage />
              </section>
              {/* Product Selection Page ends */}
            </>
          }>
          </Route>
        </Routes>
      </Router>
    </>
  )
}
export default App
