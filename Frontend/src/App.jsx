import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import AdminSignup from './pages/AdminSignup';
import AdminSignin from './pages/AdminSignin';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import UpdateProduct from './pages/UpdateProduct';
import UpdatePassword from './pages/UpdatePassword';
import { AdmintokenAtom } from './stores/Adminatoms';

const PrivateRoute = ({ children }) => {
    const token = useRecoilValue(AdmintokenAtom);
    return token ? children : <Navigate to="/admin-signin" />;
};

function App() {
    return (
        <RecoilRoot>
            <Router>
                <Routes>
                    <Route path="/admin-signup" element={<AdminSignup />} />
                    <Route path="/admin-signin" element={<AdminSignin />} />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <PrivateRoute>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/add-product"
                        element={
                            <PrivateRoute>
                                <AddProduct />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/update-product/:productId"
                        element={
                            <PrivateRoute>
                                <UpdateProduct />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/update-password"
                        element={
                            <PrivateRoute>
                                <UpdatePassword />
                            </PrivateRoute>
                        }
                    />
                    {/* Redirect root to dashboard if logged in */}
                    <Route
                        path="/"
                        element={<Navigate to="/admin/dashboard" replace />}
                    />
                    {/* Handle undefined routes */}
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </Router>
        </RecoilRoot>
    );
}

export default App;
