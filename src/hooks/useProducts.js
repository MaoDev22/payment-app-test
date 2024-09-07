import { useState, useEffect } from 'react';
import { filterProducts } from 'services/productsService';

const useProducts = (initialSearchText = '') => {
    const [searchText, setSearchText] = useState(initialSearchText);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await filterProducts(searchText);

            setProducts(response);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [])

    return {
        searchText,
        setSearchText,
        loading,
        error,
        products,
        handleSearch,
    };
};

export default useProducts;
