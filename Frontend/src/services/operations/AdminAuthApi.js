import { apiConnector } from "../apiConnector";
const BASE_URL = import.meta.env.VITE_BASE_URL_ADMIN;

export const Adminsignup = async (firstname,lastname,email,password) => {
    try{
        const response = await apiConnector("POST", `${BASE_URL}/admin/AdminSignup`,{
            firstname: firstname,
            lastname: lastname,
            Adminname: email,
            password: password
        });

        if(!response.status) {
            throw new Error(response.data.message);

        } else {
            return response.data.message;
        }
    } catch (error) {
        console.log("Signup error...", error.message);
    }
}

export const Adminsignin = async (email,password) => {
    try{
        const response = await apiConnector("POST",`${BASE_URL}/admin/AdminSignin`,{
            Adminname: email,
            password,
        });

        if(response.status === 200) {
            localStorage.setItem("token",JSON.stringify(response.data.token));
            return response.data.token;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log("Login error...", error.message);
        console.log("Error in login")
    }
};

export const addProductApi = async (productData, token)=> {
    try{
        const response = await apiConnector("POST",`${BASE_URL}/admin/products`,productData,{
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
        return response.data;
    } catch (error) {
        console.error("Add Product Error:", error.message);
        throw error;
    }
}

export const getProductApi = async (productId, token) => {
    try{
        const response = await apiConnector(
            "GET",
            `${BASE_URL}/admin/products/${productId}`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        )
        return response.data;
    } catch (error) {
        console.error("Get Product Error:", error.message)
        throw error;
    }
};

export const updateProductApi = async (productId,productData, token) => {
    try {
        const response = await apiConnector(
            "PUT",
            `${BASE_URL}/admin/products/${productId}`,
            productData,
            {
                headers: {
                    'Authorization' : `Bearer ${token}`,
                }
            }
        )
        return response.data;
    } catch(error) {
        console.error("Update Product Error:", error.message);
        throw error;
    }
}

export const updatePasswordApi = async (passwordData, token) => {
    try {
        const response = await apiConnector(
            "PUT",
            `${BASE_URL}/admin/updateCredentials`,
            passwordData,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Update Password Error:',error.message);
        throw error
    }
}
export const getProductsApi = async (page = 1, limit = 10, sortBy = 'createdAt', order = 'asc', token) => {
    try {
        const response = await apiConnector(
            "GET",
            `${BASE_URL}/admin/products?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Get Products Error:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const getProductByIdApi = async (productId, token) => {
    try {
        const response = await apiConnector(
            "GET",
            `${BASE_URL}/admin/products/${productId}`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Get Product By ID Error:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};