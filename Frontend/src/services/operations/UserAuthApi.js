import { apiConnector } from "../apiConnector"; // Ensure correct path
const BASE_URL = import.meta.env.VITE_BASE_URL_USER;

// User Signup Function
export const Usersignup = async (firstname, lastname, email, password) => {
    try {
        const response = await apiConnector("POST", `${BASE_URL}/user/UserSignup`, {
            firstname,
            lastname,
            username: email,
            password,
        });

        if (!response.status) {
            throw new Error(response.data.message);
        } else {
            return response.data.message;
        }
    } catch (error) {
        console.log("UserSignup error...", error.message);
        throw error; // Re-throw for component handling
    }
};

// User Signin Function
export const Usersignin = async (email, password) => {
    try {
        const response = await apiConnector("POST", `${BASE_URL}/user/UserSignin`, {
            username: email,
            password,
        });

        if (response.status === 200) {
            localStorage.setItem("token", response.data.token); // Store as plain string
            return response.data.token;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log("Login error...", error.message);
        throw error; // Re-throw for component handling
    }
};

// Add Money Function
export const addMoney = async (amount, token) => {
    try {
        const response = await apiConnector(
            "POST",
            `${BASE_URL}/user/add-money`,
            { amount },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data; // Return response data
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log("Add money error...", error.message);
        throw error; // Re-throw for component handling
    }
};

// Add Product Function
export const addProduct = async (productData, token) => {
    try {
        const response = await apiConnector(
            "POST",
            `${BASE_URL}/user/add-product`,
            productData,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data; // Return response data
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log("Add product error...", error.message);
        throw error; // Re-throw for component handling
    }
};

// Fetch User Purchases Function
export const fetchUserPurchases = async (token) => {
    try {
        const response = await apiConnector(
            "GET",
            `${BASE_URL}/user/purchases`,
            null, // No body for GET request
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data; // Return purchase data
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error fetching purchases...", error.message);
        throw error; // Re-throw for component handling
    }
};

// Update User Password Function
export const updateUserPassword = async (currentPassword, newPassword, token) => {
    try {
        const response = await apiConnector(
            "PUT",
            `${BASE_URL}/user/updateCredentials`,
            { currentPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data.message; // Return success message
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log("Update password error...", error.message);
        throw error; // Re-throw for component handling
    }
};

// Fetch Products Function
export const fetchProducts = async () => {
    try {
        const response = await apiConnector("GET", `${BASE_URL}/user/products`);
        if (response.status === 200) {
            return response.data; // Return products data
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error fetching products...", error.message);
        throw error; // Re-throw for component handling
    }
};

// Buy Product Function
export const buyProduct = async (productId, token) => {
    try {
        const response = await apiConnector(
            "POST",
            `${BASE_URL}/user/purchase`,
            { productId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data.message; // Return success message
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error purchasing product...", error.message);
        throw error; // Re-throw for component handling
    }
};

// Search Products Function
export const searchProducts = async (query) => {
    try {
        const response = await apiConnector("GET", `${BASE_URL}/user/searchProducts`, null, {
            params: { query }
        });

        if (response.status === 200) {
            return response.data; // Return search results
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error searching products...", error.message);
        throw error; // Re-throw for component handling
    }
};
