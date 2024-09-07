import './styles.scss';
import React from 'react';

import ProductCard from 'components/Products/ProductCard';
import ProductFinder from 'components/Products/ProductFinder';
import useProducts from 'hooks/useProducts';

function Products() {
  const {
    searchText,
    setSearchText,
    loading,
    error,
    products,
    handleSearch
  } = useProducts();

  return (
    <>
      <ProductFinder 
        handleSearch={handleSearch} 
        setSearchText={setSearchText} 
        searchText={searchText} 
        loading={loading} 
        error={error} 
      />

      <div className="generalContainerProducts">
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.length > 0 ? (
            <div>
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <p>No se encontraron productos.</p>
          )
        )}
      </div>
    </>
  );
}

export default Products;
