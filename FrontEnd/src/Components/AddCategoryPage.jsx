import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategoryPage = () => {

    // variables and functions defined and declared
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);

    //Function to add category on button click
    const handleAddCategory = async () => {
        try {
            if (categoryName.trim() !== '') {
                const response = await axios.post('http://localhost:3000/api/categoryDetails', {
                    name: categoryName.trim(),
                })

                if (response.data.status) {
                    const newCategory = {
                        name: categoryName.trim(),
                        _id: response.data.categoryId,
                    }
                    setCategories([...categories, newCategory]);
                    setCategoryName('');
                    toast('🦄 '+response.data.message, {
                        position: "top-center",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                } else {
                    console.error('Error creating category:', response.data.message);
                }
            }
        } catch (error) {
            console.error('Error creating category:', error.message);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="card shadow-1-strong card-registration" style={{ borderRadius: '15px' }}>
                <div className="card-body p-5">
                    <h3 className="mb-4">Add new Product Category</h3>
                    <label>Enter new Category: &nbsp;</label>
                    <input
                        type="text"
                        className='form-control-md'
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <div>
                        <button className="btn btn-primary btn-md mt-3" type="submit" onClick={handleAddCategory}>
                            Submit
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

export default AddCategoryPage