import {atom} from 'recoil';

export const UsertokenAtom = atom({
    key: "UsertokenAtom",
    default: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")): null,
})

export const userAtom = atom({
    key: "userAtom",
    default: {
        firstname: "",
        lastname: ""
    },
})