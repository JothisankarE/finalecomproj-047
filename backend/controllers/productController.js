const productModel = require("../models/productModel");
const fs = require('fs');
const xlsx = require('xlsx');

// all product list
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ success: true, data: products })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// add Product
// add Product
const addProduct = async (req, res) => {
    try {
        let image_filename = `${req.files[0].filename}`;

        // Handle extra images (if any)
        let extra_images = [];
        if (req.files.length > 1) {
            extra_images = req.files.slice(1).map(file => file.filename);
        }

        const product = new productModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            image: image_filename,
            extraImages: extra_images
        })

        await product.save();
        res.json({ success: true, message: "Product Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Bulk Add Products via Excel
const bulkAddProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No file uploaded" });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Iterate and save
        // Expected columns: Name, Description, Price, Category, Stock, Image (filename if pre-uploaded or URL)
        // Note: Handling images in bulk via Excel is complex. We assume 'Image' column has a valid filename or URL.
        // For simplicity in this demo, we might set a default image if missing or just trust the filename.

        const products = data.map(item => ({
            name: item.Name,
            description: item.Description,
            price: item.Price,
            category: item.Category,
            stock: item.Stock || 0,
            image: item.Image || "default_product.png", // Fallback
            extraImages: []
        }));

        await productModel.insertMany(products);

        // Cleanup uploaded excel file
        fs.unlink(req.file.path, () => { });

        res.json({ success: true, message: `${products.length} Products Added Successfully` });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error processing file" });
    }
}

// delete Product
const removeProduct = async (req, res) => {
    try {

        const product = await productModel.findById(req.body.id);
        fs.unlink(`uploads/${product.image}`, () => { })

        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}



module.exports = {
    listProduct,
    addProduct,
    removeProduct,
    bulkAddProduct
}



