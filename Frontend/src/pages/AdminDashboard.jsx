import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { AdmintokenAtom } from '../stores/Adminatoms';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [token, setToken] = useRecoilState(AdmintokenAtom);

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
        navigate('/admin-signin');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div
                    onClick={() => navigate('/admin/add-product')}
                    className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 transition"
                >
                    <h2 className="text-xl font-semibold mb-2">Add Product</h2>
                    <p>Add new products to the inventory.</p>
                </div>
                <div
                    onClick={() => navigate('/admin/update-product')}
                    className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 transition"
                >
                    <h2 className="text-xl font-semibold mb-2">Update Product</h2>
                    <p>Edit existing products.</p>
                </div>
                <div
                    onClick={() => navigate('/admin/update-password')}
                    className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 transition"
                >
                    <h2 className="text-xl font-semibold mb-2">Update Password</h2>
                    <p>Change your admin password.</p>
                </div>
                <div
                    onClick={() => navigate('/admin/products')}
                    className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 transition"
                >
                    <h2 className="text-xl font-semibold mb-2">View Products</h2>
                    <p>View and manage all products.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;