import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import { getUserReceipt } from '../services/operations/UserAuthApi';

const ReceiptPage = () => {
    const token = useRecoilValue(UsertokenAtom);
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const data = await getUserReceipt(token);
                setReceipt(data);
            } catch (error) {
                toast.error('Failed to fetch receipt.');
            }
        };

        fetchReceipt();
    }, [token]);

    if (!receipt) return <p>Loading receipt...</p>;

    return (
        <div>
            <h2>Your Receipt</h2>
            <ul>
                {receipt.purchases.map((item, index) => (
                    <li key={index}>
                        {item.name} - ₹{item.price} x {item.quantity}
                    </li>
                ))}
            </ul>
            <h3>Total: ₹{receipt.total}</h3>
        </div>
    );
};

export default ReceiptPage;
