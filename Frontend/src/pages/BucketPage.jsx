import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import { viewBucket, buyAllProducts } from '../services/operations/UserAuthApi';

const BucketPage = () => {
    const token = useRecoilValue(UsertokenAtom);
    const [bucket, setBucket] = useState([]);

    useEffect(() => {
        const fetchBucket = async () => {
            try {
                const data = await viewBucket(token);
                setBucket(data?.bucket || []); // Use an empty array if data.bucket is undefined or null
            } catch (error) {
                toast.error('Failed to fetch bucket.');
                setBucket([]); // Fallback to an empty array if there's an error
            }
        };

        fetchBucket();
    }, [token]);


    const handleBuyAll = async () => {
        try {
            await buyAllProducts(token);
            toast.success('Purchase successful!');
            setBucket([]); // Clear the bucket on frontend
        } catch (error) {
            toast.error('Failed to complete purchase.');
        }
    };

    return (
        <div>
            <h2>Your Bucket</h2>
            {bucket.length === 0 ? (
                <p>Your bucket is empty</p>
            ) : (
                <ul>
                    {bucket.map((item) => (
                        <li key={item.productId._id}>
                            {item.productId.name} - ₹{item.productId.price} x {item.quantity}
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={handleBuyAll} disabled={bucket.length === 0}>
                Buy All
            </button>
        </div>
    );
};

export default BucketPage;
