import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProductApi, getProductApi } from '../services/operations/AdminAuthApi';
import { useRecoilValue } from 'recoil';
import { AdmintokenAtom } from '../stores/Adminatoms';


const UpdateProduct = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const token = useRecoilValue(AdmintokenAtom);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: null,
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Fetch existing product details to prefill the form
        const fetchProduct = async () => {
            try {
                const response = await getProductApi(productId, token);
                const fetchedProduct = response.product; // Adjust based on actual API response
                setProduct(fetchedProduct);
                setForm({
                    name: fetchedProduct.name,
                    description: fetchedProduct.description,
                    price: fetchedProduct.price,
                    stock: fetchedProduct.stock,
                    image: null, // Image will be replaced if a new one is uploaded
                });
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, token]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setForm({ ...form, image: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = new FormData();
        productData.append('name', form.name);
        productData.append('description', form.description);
        productData.append('price', form.price);
        productData.append('stock', form.stock);
        if (form.image) {
            productData.append('image', form.image);
        }

        try {
            const response = await updateProductApi(productId, productData, token);
            setSuccess(response.message);
            setError(null);
            // Optionally, navigate to products list or another page
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to update product');
            setSuccess(null);
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Update Product</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={form.name}
                        onChange={handleChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={form.description}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock Quantity"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={form.stock}
                        onChange={handleChange}
                        min="0"
                        step="1"
                    />
                    {product.imageUrl && (
                        <div className="mb-4">
                            <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover rounded-lg" />
                        </div>
                    )}
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="w-full"
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
                    >
                        Update Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;
