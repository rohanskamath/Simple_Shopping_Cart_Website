const express = require('express');
const mysql = require('mysql2/promise'); // Use the promise version

const cors=require('cors');

const app = express();

app.use(express.json())
app.use(cors())

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'deepfeet',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});

// Define a route to test the connection
app.get('/', (req, res) => {
  res.send('Hello, MySQL!');
})

/* Category functions */

//Retrive all categories from the category table
app.get('/api/categoryDetails', async (req, res) => {
  try {
    const [rows, fields] = await pool.execute('SELECT * FROM category');
    return res.status(200).json({
      status: true,
      message: 'Successfully retrieved categories',
      categories: rows
    });
  } catch (e) {
    return res.status(400).json({
      status: false,
      message: e.message,
      categories: []
    });
  }
})

//Add new Category into category table
app.post('/api/categoryDetails', async (req, res) => {
  try {
    const { name } = req.body;
    await pool.execute('INSERT INTO category (category_name, category_tax) VALUES (?, 0)', [name.trim()]);
    return res.status(200).json({
      status: true,
      message: 'Successfully created category'
    });
  } catch (e) {
    return res.status(400).json({
      status: false,
      message: e.message
    });
  }
})

//Update rows in Category Table
app.put('/api/categoryDetails', async (req, res) => {
  try {
    const { cNames, cTax } = req.body;
    await pool.execute('UPDATE category SET category_tax = ? WHERE category_name = ?', [cTax, cNames]);
    return res.status(200).json({
      status: true,
      message: 'Successfully updated category GST rate'
    });
  } catch (e) {
    return res.status(400).json({
      status: false,
      message: e.message
    });
  }
})

/* Product functions */

// Retrive all products from product table
app.get('/api/product/:productName', async (req, res) => {
    try {
        const { productName } = req.params;
        const [productRows] = await pool.execute('SELECT * FROM product WHERE product_name = ?', [productName]);

        if (!productRows[0]) {
            return res.status(404).json({
                status: false,
                message: 'Product not found',
                product: null
            });
        }
        const product = productRows[0];

        //Retrive Category from category table using category_id
        const [categoryRows] = await pool.execute('SELECT * FROM category WHERE category_id = ?', [product.product_category]);

        if (!categoryRows[0]) {
            return res.status(404).json({
                status: false,
                message: 'Category not found for the product',
                product: null
            });
        }

        const category = categoryRows[0];
        
        // Calculate GST on the product price
        const gstTax = (product.product_price * category.category_tax) / 100;

        // return success response with product details
        return res.status(200).json({
            status: true,
            message: 'Successfully retrieved product details',
            product: {
                category: category.category_name,
                rate: product.product_price,
                gstTax: gstTax
            }
        });
    } catch (e) {

        // handle error and return failure response
        return res.status(400).json({
            status: false,
            message: e.message,
            product: null
        });
    }
});

// Retrive products based category_id from product table using Join Clause
app.post('/api/productCategory', async (req, res) => {
    try {

        // get category name from request body
        const { categoryName } = req.body;

        if (categoryName===undefined) {
            return res.status(400).json({
                status: false,
                message: "categoryName not provided",
                products: []
            });
        }

        // find all products belonging to the category using JOIN
        const [productsRows] = await pool.execute(`
            SELECT p.product_name, p.product_price, c.category_name
            FROM product p
            INNER JOIN category c ON p.product_category = c.category_id
            WHERE c.category_name = ?
        `, [categoryName]);

        // extract product details from the result
        const products = productsRows.map((product) => ({
            name: product.product_name,
            rate: product.product_price,
            category: product.category_name,
        }));

        // return success response with product details
        return res.status(200).json({
            status: true,
            message: "Successfully retrieved products",
            products: products
        });
    } catch (e) {

        // handle error and return failure response
        return res.status(400).json({
            status: false,
            message: e.message,
            products: []
        });
    }
});


// Add new products into product Table
app.post('/api/productDetails', async (req, res) => {
    try {

        // get required data from request body
        const { cName, pName, rate } = req.body;

        // validate required fields
        if (!cName || !pName || !rate) {
            return res.status(400).json({
                status: false,
                message: 'Missing required fields: cName, pName, rate',
            });
        }

        // find the associated category
        const [categoryRows] = await pool.execute('SELECT * FROM category WHERE category_name = ?', [cName]);

        if (!categoryRows[0]) {
            return res.status(404).json({
                status: false,
                message: 'Category not found',
                productId: '-1'
            });
        }

        const category = categoryRows[0];

        // create and save new product
        await pool.execute('INSERT INTO product (product_name,product_category,product_price) VALUES (?, ?, ?)', [pName.trim(), category.category_id,rate]);

        // return success response with product ID
        return res.status(200).json({
            status: true,
            message: "Successfully created product"
        });
    } catch (e) {

        // handle errors and return failure response
        return res.status(400).json({
            status: false,
            message: e.message,
            productId: '-1'
        });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
