const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const Product = require('./models/Product');
const bodyParser = require('body-parser');

const app = express();
(async () => {
  try {
    await mongoose.connect('mongodb+srv://trankhai132905:123@lab5.a6bsm.mongodb.net/Th5', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB đã kết nối!");
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error);
  }
})();


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(express.static('public'))

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use((req, res, next) => {
  res.locals.cart = req.session.cart || []; 
  next();
});

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);


const http = require('http');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;