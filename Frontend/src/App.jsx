
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import Home from './pages/Home';
import AdminSignup from './pages/AdminSignup';
import AdminSignin from './pages/AdminSignin';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import UpdateProduct from './pages/UpdateProduct';
import UpdatePassword from './pages/UpdatePassword';
import ProductsList from './pages/ProductsList';
import UserSignup from './pages/UserSignup';
import UserSignin from './pages/UserSignin';
import { AdmintokenAtom } from './stores/Adminatoms';


const PrivateRoute = ({ children }) => {
    const token = useRecoilValue(AdmintokenAtom);
    return token ? children : <Navigate to="/admin-signin" />;
};

// Optional: PrivateRoute for user routes
// const UserPrivateRoute = ({ children }) => {
//     const token = useRecoilValue(UsertokenAtom); // Define UsertokenAtom similarly
//     return token ? children : <Navigate to="/user-signin" />;
// };

function App() {
    return (
        <RecoilRoot>
            <Router>
                <Routes>
                    {/* Home Route */}
                    <Route path="/" element={<Home />} />

                    {/* User Routes */}
                    <Route path="/user-signup" element={<UserSignup />} />
                    <Route path="/user-signin" element={<UserSignin />} />
                    {/* Protected User Routes */}
                    {/* <Route
                        path="/user/dashboard"
                        element={
                            <UserPrivateRoute>
                                <UserDashboard />
                            </UserPrivateRoute>
                        }
                    /> */}

                    
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
                    <Route
                        path="/admin/products"
                        element={
                            <PrivateRoute>
                                <ProductsList />
                            </PrivateRoute>
                        }
                    />

                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </RecoilRoot>
    );
}

export default App;
