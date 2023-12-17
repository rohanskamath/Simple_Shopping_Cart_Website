import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductTablePage = () => {

    // variables and functions declared and defined
    const [categoryName, setCategoryName] = useState('');
    const [productName, setProductName] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);

    // useEffect to fetch categories and set the default category when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/categoryDetails');

                if (response.data.status) {
                    setCategories(response.data.categories);
                } else {
                    console.error('Error fetching categories:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching categories:', error.message);
            }
        };

        fetchCategories();

        if (categories.length > 0) {
            setCategoryName(categories[0].name);
        } else {
            setCategoryName("none");
        }
    }, []);

    // useEffect to fetch products when the selected category changes
    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                const response = await axios.post('http://localhost:3000/api/productCategory', {
                    categoryName: categoryName,
                });

                if (response.data.status) {
                    setCategoryProducts(response.data.products);
                    console.log(categoryProducts)
                } else {
                    console.error('Error fetching products:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };

        fetchProductsByCategory();
    }, [categoryName]);

    // Function to fetch product details based on the selected product name
    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/product/${productName}`);

            if (response.data.status) {

                const productDetails = response.data.product;
                const newProduct = { category: productDetails.category, name: productName, rate: productDetails.rate, tax: productDetails.gstTax };

                setProducts([...products, newProduct]);
                setTableData([...tableData, newProduct]);

            } else {
                console.error('Error fetching product details:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching product details:', error.message);
        }
    };

    // Function to handle adding a new product to the list
    const handleAddProduct = () => {
        if (categoryName.trim() !== '' && productName.trim() !== '') {
            fetchProductDetails();
        }
    };

    // Function to handle submitting the form and generating the bill
    const handleSubmit = () => {
        console.log('Table Content:', tableData);
        setIsVisible(true);
        toast('🦄 Bill generated sucessfully', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

    };

    return (
        <>
        <ToastContainer />
            <div className="card shadow-1-strong card-registration" style={{ borderRadius: '15px' }}>
                <div className="card-body p-5">
                    <h3 className="mb-4">Product Selection</h3>
                    <label>Category Name: &nbsp;</label>
                    <select
                        value={categoryName}
                        onChange={(e) => { setCategoryName(e.target.value) }} >
                        <option value="">---- Select Category ----</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.category_name}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    <div>
                        <label>Product Name: &nbsp;</label>
                        <select
                            value={productName}
                            onChange={(e) => { setProductName(e.target.value) }}>
                            <option value="">---- Select Product ----</option>
                            {categoryProducts.map((product, index) => (
                                <option key={index} value={product.name}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button className="btn btn-primary btn-md mt-3" type="submit" onClick={handleAddProduct}>
                            Buy Product
                        </button>
                    </div>
                </div>
            </div>
            <div style={{float:'left',marginBottom:"10px"}}>
                {/* Links to navigate to Home Screen */}
                <Link to="/"><button className="btn btn-success btn-md mt-3">Back to Home</button></Link>
            </div>

            {/* Display Product as user selects the products */}
            {tableData.length > 0 && (
                <div>
                    <h2 className='mt-3'>Product Details</h2>
                    <table style={{ fontFamily: 'Arial, Helvetica, sans-serif', borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <th>Product Name</th>
                                <th>Category Name</th>
                                <th>Price</th>
                                <th>GST (Tax)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((product, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.category}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.rate}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.tax}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="btn btn-success btn-md mt-3" onClick={handleSubmit}>Generate Bill</button>
                    {isVisible && <BillElement tableData={tableData} />}

                </div>
            )}
        </>
    )
}

// BillElement component to display the bill details
const BillElement = ({ tableData }) => {

    // Function to calculate totals for rate, tax, and sum total
    const calculateTotals = () => {
        let totalRate = 0;
        let totalTax = 0;

        tableData.forEach((product) => {
            totalRate += parseFloat(product.rate);
            totalTax += parseFloat(product.tax);
        });

        const totalAmount = totalRate + totalTax;
        return { totalRate, totalTax, totalAmount };
    };

    const { totalRate, totalTax, totalAmount } = calculateTotals();

    /* Display Generated Bill */
    return (
        <>
            <div>
                <h2 className='mt-4'>Final Invoice</h2>
                <table style={{ fontFamily: 'Arial, Helvetica, sans-serif', borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr style={{ border: '1px solid #ddd', padding: '8px' }}>
                            <th>Product Name</th>
                            <th>Category Name</th>
                            <th>Price</th>
                            <th>GST (Tax)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((product, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.category}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.rate}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.tax}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="3" style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Total GST</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{totalTax}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Total Price</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{totalRate}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Total Amount Payable</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{totalAmount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ProductTablePage