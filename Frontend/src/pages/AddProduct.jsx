import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProductApi } from '../services/operations/AdminAuthApi';
import { useRecoilValue } from 'recoil';
import { AdmintokenAtom } from '../stores/Adminatoms';
import { apiConnector } from '../services/apiConnector';

const AddProduct = () => {
    const navigate = useNavigate();
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
            const response = await addProductApi(productData, token);
            setSuccess(response.message);
            setForm({
                name: '',
                description: '',
                price: '',
                stock: '',
                image: null,
            });

            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
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
                        placeholder="Price (in Rupees)"
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
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;