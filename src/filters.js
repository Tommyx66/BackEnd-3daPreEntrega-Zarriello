function applyFilters(products, query) {
    let filteredProducts = [...products];
  
    if (query.category) {
      filteredProducts = filteredProducts.filter(product => product.category === query.category);
    }
  
    if (query.availability) {
      filteredProducts = filteredProducts.filter(product => product.availability === query.availability);
    }
  
    return filteredProducts;
  }
  
  function sortProducts(products, sortType) {
    let sortedProducts = [...products];
  
    if (sortType === 'asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === 'desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
  
    return sortedProducts;
  }
  
  module.exports = {
    applyFilters,
    sortProducts,
  };
  