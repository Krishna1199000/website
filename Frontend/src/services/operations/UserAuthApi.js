import { apiConnector } from "../apiConnector"; 
const BASE_URL = import.meta.env.VITE_BASE_URL_USER;


export const Usersignup = async (firstname, lastname, email, password) => {
    try {
        const response = await apiConnector("POST", `${BASE_URL}/UserSignup`, {
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
        const response = await apiConnector("POST", `${BASE_URL}/UserSignin`, {
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
            `${BASE_URL}/add-money`,
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
            `${BASE_URL}/purchases`,
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
            `${BASE_URL}/updateCredentials`,
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
        const response = await apiConnector("GET", `${BASE_URL}/products`);
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
            `${BASE_URL}/purchase`, 
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
        const response = await apiConnector("POST", `${BASE_URL}/search`, { query }, {
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
            `${BASE_URL}/balance`,
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
        const response = await apiConnector('POST', `${BASE_URL}/cancel-order`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    } catch (error) {
        console.log('Cancel order error:', error);
        throw error;
    }
};

export const viewBucket = async (token) => {
    try{
        const response = await apiConnector('GET', `${BASE_URL}/bucket`,null,{
            headers: {Authorization: `Bearer ${token}`},
        })
        return response;
    } catch (error) {
        console.log('View bucket error:',error);
        throw error;
    }
};

export const addToBucket = async (token, productId,quantity = 1) => {
    try{
        const response = await apiConnector('POST', `${BASE_URL}/bucket/add`, {productId,quantity},{
            headers: {Authorization: `Bearer ${token}`},
        });
        return response;
    } catch (error){
        console.log("add to bucket error:",error);
        throw error;
    }
};
export const removeFromBucket = async (token,productId) => {
    try{
        const response = await apiConnector('POST',`${BASE_URL}/bucket/remove`,{productId},{
            headers: {Authorization: `Bearer ${token}`},
        })
        return response;
    } catch (error){
        console.log("remove from bucket error:", error);
        throw error;
    }
}

export const buyAllProducts = async (token) => {
    try{
        const response = await apiConnector("POST", `${BASE_URL}/bucket/purchase`,null,{
            headers: {Authorization: `Bearer ${token}`},
        })
        return response;
    } catch (error){
        console.log("buy all products error:", error);
        throw error;
    }
}