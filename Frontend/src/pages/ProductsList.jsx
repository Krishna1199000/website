import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AdmintokenAtom } from '../stores/Adminatoms';
import { getProductsApi } from '../services/operations/AdminAuthApi';
import { useNavigate } from 'react-router-dom';

const ProductsList = () => {
    const navigate = useNavigate();
    const token = useRecoilValue(AdmintokenAtom);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(search);
            setPage(1);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProductsApi(page, 10, 'createdAt', 'desc', token);
                if (response.success) {
                    setProducts(response.data);
                    setPages(response.pagination.pages);
                } else {
                    setError(response.message || 'Failed to fetch products');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to fetch products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, token, searchTerm]);

    const handleNextPage = () => {
        if (page < pages) setPage(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Products List</h2>

            {/* Search Form */}
            <div className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center">No products found.</div>
            ) : (
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="py-2 px-4">Image</th>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Price</th>
                            <th className="py-2 px-4">Stock</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product._id} className="border-t">
                                <td className="py-2 px-4">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-20 w-20 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="h-20 w-20 bg-gray-200 flex items-center justify-center rounded">No Image</div>
                                    )}
                                </td>
                                <td className="py-2 px-4">{product.name}</td>
                                <td className="py-2 px-4">₹{product.price.toFixed(2)}</td>
                                <td className="py-2 px-4">{product.stock}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => navigate(`/admin/update-product/${product._id}`)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${
                        page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:bg-secondary'
                    }`}
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    Page {page} of {pages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={page === pages}
                    className={`px-4 py-2 rounded-lg ${
                        page === pages ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:bg-secondary'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductsList;
