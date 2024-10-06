import {apiConnector} from "../apiConnector"
const BASE_URL = import.meta.env.VITE_BASE_URL_USER;

export const Usersignup = async (firstname,lastname,email,password)=>{
    try{
        const response = await apiConnector("POST",`${BASE_URL}/user/UserSignup`,{
            firstname: firstname,
            lastname: lastname,
            username: email,
            password: password,
        });

        if(!response.status){
            throw new Error(response.data.message);

        } else {
            return response.data.message;
        }
    } catch(error){
            console.log("UserSignup error...", error.message);
    }
}

export const Usersignin = async (email,password) => {
    try{
        const response = await apiConnector("POST", `${BASE_URL}/user/UserSignin`,{
            username: email,
            password
        });

        if(response.status == 200){
            localStorage.setItem("token",JSON.stringify(response.data.token));
            return response.data.token;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error){
        console.log("Login error...", error.message);
        console.log("Error in login");
    }
};