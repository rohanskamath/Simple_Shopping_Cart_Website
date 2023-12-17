import React from 'react'
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
        <>
            <h1>DeepFleet Coding Challenge</h1>
            <div className="d-flex flex-row mt-5">

                {/* Card 1 */}
                <Link to="/add-category" className="card border-secondary me-3" style={{ maxWidth: "18rem" }}>
                    <div className="card-header">Add Category</div>
                    <div className="card-body text-secondary">
                        <h5 className="card-title">Add new various Product Categories</h5>
                    </div>
                </Link>

                {/* Card 2 */}
                <Link to="/gst-rate-screen" className="card border-secondary me-3" style={{ maxWidth: "18rem" }}>
                    <div className="card-header">GST Rate Screen</div>
                    <div className="card-body text-secondary">
                        <h5 className="card-title">Capture GST rates for various product categories</h5>
                    </div>
                </Link>

                {/* Card 3 */}
                <Link to="/add-products" className="card border-secondary me-3" style={{ maxWidth: "18rem" }}>
                    <div className="card-header">Add Products</div>
                    <div className="card-body text-secondary">
                        <h5 className="card-title">Create products in various product categories</h5>
                    </div>
                </Link>

                {/* Card 4 */}
                <Link to="/product-selection" className="card border-secondary me-3" style={{ maxWidth: "18rem" }}>
                    <div className="card-header">Product Selection</div>
                    <div className="card-body text-secondary">
                        <h5 className="card-title">Create a sale where user chooses the product from a drop down and product category and GST is populated in next cells</h5>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default MainPage