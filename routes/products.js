const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


// Hiển thị form thêm sản phẩm
router.get('/addProduct', (req, res) => {
  res.render('products/addProduct'); 
});

// Xử lý thêm sản phẩm
router.post('/add', async (req, res) => {
  try {
      const { name, price, description, image } = req.body;
      const newProduct = new Product({
          name,
          price,
          description,
          image
      });
      await newProduct.save(); 
      res.redirect('/products'); 
  } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      res.status(500).send('Lỗi server');
  }
});

// Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products/list', { products });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy danh sách sản phẩm: " + error.message);
  }
});

// Xem chi tiết sản phẩm
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Sản phẩm không tồn tại");
    res.render('products/detail', { product });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy sản phẩm: " + error.message);
  }
});

// API thêm sản phẩm 
router.post('/add', async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    if (!name || !price || !description || !image) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin sản phẩm" });
    }
    const newProduct = new Product({ name, price, description, image });
    await newProduct.save();
    
    res.status(201).json(newProduct); 
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm sản phẩm: " + error.message });
  }
});

// API cập nhật sản phẩm
router.put('/edit/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm: " + error.message });
  }
});

// API xóa sản phẩm
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    res.json({ message: "Xóa sản phẩm thành công", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa sản phẩm: " + error.message });
  }
});

module.exports = router;
