import {atom} from "recoil"
export const AdmintokenAtom = atom({
    key: "AdmintokenAtom",
    default: localStorage.getItem("token") || '',
});
export const adminAtom = ({
    key: "adminAtom",
    default: {
        firstname: "",
        lastname: "",
    },
});