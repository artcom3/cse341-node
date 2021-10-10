const Product = require('../models/p08');

const ITEMS_PER_PAGE = 6;

exports.getProducts = (req, res, next) => {
  const page = req.query.page || 1

  const iStart = (page - 1) * ITEMS_PER_PAGE;
  const iEnd   = page * ITEMS_PER_PAGE

  Product.fetchAll((products) => {
    res.render('p08', {
      title: 'Prove Activity 08',
      path: '/p08',
      query: '',
      page: page,
      numPages: Math.ceil(products.length / ITEMS_PER_PAGE),
      products: products.slice(iStart, iEnd),
    });
  });
};

exports.getSearchProducts = (req, res, next) => {
  const query = req.query.query.toLowerCase();

  console.log(query);

  const page = req.query.page || 1

  const iStart = (page - 1) * ITEMS_PER_PAGE;
  const iEnd   = page * ITEMS_PER_PAGE

  Product.search(query, (filteredProducts) => {
    console.log(filteredProducts)
    res.render('p08', {
      title: 'Prove Activity 08',
      path: '/p08',
      query: query,
      page: page,
      numPages: Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
      products: filteredProducts.slice(iStart, iEnd)
    });
  });
};