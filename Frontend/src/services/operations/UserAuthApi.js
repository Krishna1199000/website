import { apiConnector } from "../apiConnector"; 
const BASE_URL = import.meta.env.VITE_BASE_URL_USER;


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
        throw error; 
    }
};


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
        throw error;
    }
};


export const addMoney = async (amount, token) => {
    try {
        const response = await apiConnector(
            "POST",
            `${BASE_URL}/user/add-money`,
            { amount },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data; 
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log("Add money error...", error.message);
        throw error; 
    }
};




export const fetchUserPurchases = async (token) => {
    try {
        const response = await apiConnector(
            "GET",
            `${BASE_URL}/user/purchases`,
            null, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error fetching purchases...", error.message);
        throw error; 
    }
};

export const updateUserPassword = async (currentPassword, newPassword, token) => {
    try {
        const response = await apiConnector(
            "PUT",
            `${BASE_URL}/user/updateCredentials`,
            { currentPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data.message; 
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log("Update password error...", error.message);
        throw error; 
    }
};


export const fetchProducts = async () => {
    try {
        const response = await apiConnector("GET", `${BASE_URL}/user/products`);
        if (response.status === 200) {
            return response.data; 
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error fetching products...", error.message);
        throw error; 
    }
};


export const buyProduct = async (productId, token) => {
    try {
        const response = await apiConnector(
            "POST",
            `${BASE_URL}/user/purchase`, 
            { productId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data; 
        } else {
            throw new Error(response.data.message || 'Failed to purchase product.');
        }
    } catch (error) {
        if (error.response) {
           
            console.error("Error purchasing product:", error.response.data);
            throw new Error(error.response.data.msg || error.response.data.message || 'Purchase failed.');
        } else if (error.request) {
           
            console.error("No response received:", error.request);
            throw new Error('No response from server.');
        } else {
            
            console.error("Error:", error.message);
            throw new Error('An unexpected error occurred.');
        }
    }
};
export const searchProducts = async (query, token) => {
    try {
        const response = await apiConnector("POST", `${BASE_URL}/user/search`, { query }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
            return response.data; 
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error searching products...", error.response?.data || error.message);
        throw error;
    }
};


export const getBalance = async(token) => {
    try{
        const response = await apiConnector(
            "GET",
            `${BASE_URL}/user/balance`,
            null,
            {headers: {Authorization: `Bearer ${token}`}}
        );

        if(response.status===200){
            return response.data.balance;
        } else{
            throw new Error(response.data.message);
        }
    } catch (error){
        console.error("Error fetching balance...", error.message);
        throw error;
    }
}

export const cancelOrderApi = async (token, data) => {
    try {
        const response = await apiConnector('POST', `${BASE_URL}/user/cancel-order`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    } catch (error) {
        console.log('Cancel order error:', error);
        throw error;
    }
};

export const addProductToBucket = async (productId, token) => {
    try {
        const response = await apiConnector(
            "POST",
            `${BASE_URL}/user/add-to-bucket`,
            { productId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data; 
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error adding product to bucket...", error.message);
        throw error;
    }
};


export const buyProducts = async (token) => {
    try {
        const response = await apiConnector(
            "POST",
            `${BASE_URL}/user/buy`,
            null, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        if (error.response) {
            console.error("Error purchasing products:", error.response.data);
            throw new Error(error.response.data.message || 'Purchase failed.');
        } else if (error.request) {
            console.error("No response received:", error.request);
            throw new Error('No response from server.');
        } else {
            console.error("Error:", error.message);
            throw new Error('An unexpected error occurred.');
        }
    }
};
export const viewBucket = async (token) => {
    try {
        const response = await apiConnector(
            "GET",
            `${BASE_URL}/user/bucket`,
            null,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error fetching bucket...", error.message);
        throw error;
    }
};
export const buyAllProducts = async (token) => {
    try {
        const response = await apiConnector(
            "POST",
            `${BASE_URL}/user/buy-all`,
            null,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error buying products...", error.message);
        throw error;
    }
};
export const getUserReceipt = async (token) => {
    try {
        const response = await apiConnector(
            "GET",
            `${BASE_URL}/user/receipt`,
            null,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error fetching receipt...", error.message);
        throw error;
    }
};

export const modifyProductInBucket = async (productId,action, token) => {
    try{
        const response = await apiConnector(
            "POST",
            `${BASE_URL}/user/modify-bucket`,
            {productId,action},
            {headers: {Authorization: `Bearer ${token}`}}
        );

        if(response.status === 200) {
            return response.data;
        } else{
            throw new Error(response.data.message);
        }
    }catch (error) {
        console.error("Error modifying product in bucket...", error.message)
        throw error;
    }
}