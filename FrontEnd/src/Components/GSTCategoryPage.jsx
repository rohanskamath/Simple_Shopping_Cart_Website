import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GSTCategoryPage = () => {

    // variables and functions declared and defined
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [gstRate, setGstRate] = useState('');
    const [categoriesWithGST, setCategoriesWithGST] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    // Fetching all categories while page refreshes
    useEffect(() => {
        axios.get('http://localhost:3000/api/categoryDetails')
            .then(response => {
                const fetchedCategories = response.data.categories;
                setCategoriesWithGST(fetchedCategories.map(category => ({
                    category: category.category_name,
                    gst: category.category_tax,
                })));
                setAllCategories(fetchedCategories.map(category => category.category_name))
                console.log(fetchedCategories)
            })
            .catch(error => {
                console.error('Error fetching categories:', error.message);
            })
    }, [])

    // Fetching all categories while page refreshes
    useEffect(() => {
        if (selectedCategory !== '') {
            const existingCategory = categoriesWithGST.find(category => category.category_name === selectedCategory);
            if (existingCategory) {
                setGstRate(existingCategory.category_tax);
            } else {
                setGstRate('');
            }
        }
    }, [selectedCategory, categoriesWithGST])

    // function to save the tax details based on category into the database on button click
    const handleSaveData = async () => {
        try {
            const response = await axios.put('http://localhost:3000/api/categoryDetails', {
                cNames: selectedCategory,
                cTax: gstRate,
            })

            if (response.data.status) {
                const updatedCategoriesWithGST = categoriesWithGST.map(category => {
                    if (category.category_name === selectedCategory) {
                        return { category: selectedCategory, gst: gstRate };
                    }
                    return category;
                })
                toast('🦄 Data updated Sucessfully', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setCategoriesWithGST(updatedCategoriesWithGST);
            } else {
                console.error('Error updating category GST rates:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating category GST rates:', error.message);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="card shadow-1-strong card-registration" style={{ borderRadius: '15px' }}>
                <div className="card-body p-5">
                    <h3 className="mb-4">Add new Product Category</h3>
                    <label>Select Category: &nbsp;</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}>

                        <option value="">---- Select Category ----</option>
                        {allCategories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <div>
                        <label>Enter GST Rate: &nbsp;</label>
                        <input
                            type="text"
                            value={gstRate}
                            onChange={(e) => setGstRate(e.target.value)} />
                    </div>
                    <div>
                        <button className="btn btn-primary btn-md mt-3" type="submit" onClick={handleSaveData}>
                            Save Data
                        </button>
                    </div>
                </div>
            </div>
            <div style={{ float: 'left', marginBottom: "10px" }}>
                {/* Links to navigate to Home Screen */}
                <Link to="/"><button className="btn btn-success btn-md mt-3">Back to Home</button></Link>
            </div>
        </>
    )
}

export default GSTCategoryPage