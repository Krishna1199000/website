import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AdmintokenAtom } from '../stores/Adminatoms';
import { updatePasswordApi } from '../services/operations/AdminAuthApi';

const UpdatePassword = () => {
    const token = useRecoilValue(AdmintokenAtom);
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Token before API call:', token); // Debugging
    
        try {
            const response = await updatePasswordApi(form, token);
            setSuccess(response.message);
            setError(null);
            setForm({
                oldPassword: '',
                newPassword: '',
            });
        } catch (err) {
            setError(err.message || 'Failed to update password');
            setSuccess(null);
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Update Password</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        name="oldPassword"
                        placeholder="Old Password"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={form.oldPassword}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={form.newPassword}
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;