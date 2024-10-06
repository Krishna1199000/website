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