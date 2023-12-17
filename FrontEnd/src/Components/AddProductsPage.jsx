import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProductsPage = () => {

    // variables and functions declaration
    const [categoryName, setCategoryName] = useState('');
    const [productName, setProductName] = useState('');
    const [productRate, setProductRate] = useState('');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    // Function to fetch all categories from database into dropdown while page refreshes
    useEffect(() => {
        fetchCategories();
        fetchProductsByCategory();
    }, []);

    useEffect(() => {
        fetchProductsByCategory();
    }, [categoryName])

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/categoryDetails');

            if (response.data.status) {
                console.log('Successfully fetched categories');
                const fetchedCategories = response.data.categories;
                setCategories(fetchedCategories);
            } else {
                console.error('Error fetching categories:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching categories:', error.message);
        }
    }

    // Function to add products into database on button click
    const handleAddProduct = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/productDetails', {
                cName: categoryName,
                pName: productName,
                rate: productRate,
            })

            if (response.data.status) {
                toast('🦄 Successfully created product', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                const productId = response.data.productId;

                await fetchProductsByCategory();
            } else {
                console.error('Error creating product:', response.data.message);
            }
        } catch (error) {
            console.error('Error creating product:', error.message);
        }
    };

    //Function to retrive products based on category for displaying
    const fetchProductsByCategory = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/productCategory', {
                categoryName: categoryName
            })

            if (response.data.status) {
                console.log('Successfully fetched products');
                const fetchedProducts = response.data.products;
                setProducts(fetchedProducts);
                console.log(response.data.products);
            } else {
                console.error('Error fetching products:', response.data.message);
            }
        } catch (error) {
            console.log(error);
            console.error('Error fetching products:', error.message);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="card shadow-1-strong card-registration" style={{ borderRadius: '15px' }}>
                <div className="card-body p-5">
                    <h3 className="mb-4">Add new Product Category</h3>
                    <label>Select Category:  &nbsp;</label>
                    <select
                        value={categoryName}
                        onChange={(e) => {
                            setCategoryName(e.target.value)
                            fetchProductsByCategory()
                        }} >
                        <option value="">---- Select Category ----</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.category_name}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>

                    <div>
                        <label>Product Name: &nbsp;</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)} />
                    </div>

                    <div>
                        <label>Rate of Product: &nbsp;</label>
                        <input
                            type="text"
                            value={productRate}
                            onChange={(e) => setProductRate(e.target.value)} />
                    </div>

                    <div>
                        <button className="btn btn-primary btn-md mt-3" type="submit" onClick={handleAddProduct}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            {products.length > 0 ? (
                <div className="card shadow-1-strong card-registration mt-2" style={{ borderRadius: '15px' }}>
                    <div className="card-body p-2"></div>
                    <h2>Displaying Products</h2>
                    <table style={{ fontFamily: 'Arial, Helvetica, sans-serif', borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <th>Product Name</th>
                                <th>Category Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.category}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
            <div style={{ float: 'left', marginBottom: "10px" }}>
                {/* Links to navigate to Home Screen */}
                <Link to="/"><button className="btn btn-success btn-md mt-3">Back to Home</button></Link>
            </div>
        </>
    )
}

export default AddProductsPage