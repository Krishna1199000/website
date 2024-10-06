import {atom} from "recoil"
export const AdmintokenAtom = atom({
    key: "AdmintokenAtom",
    default: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")): null,

})

export const adminAtom = ({
    key: "adminAtom",
    default: {
        firstname: "",
        lastname: "",
    },
});