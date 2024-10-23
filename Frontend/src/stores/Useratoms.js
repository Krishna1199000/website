import {atom} from 'recoil';

export const UsertokenAtom = atom({
    key: "UsertokenAtom",
    default: localStorage.getItem("token"),
})

export const userAtom = atom({
    key: "userAtom",
    default: {
        firstname: "",
        lastname: ""
    },
})


export const bucketAtom = atom({
    key: 'bucketAtom',
    default: [], // This will hold the cart items
});
