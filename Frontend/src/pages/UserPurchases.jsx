import React, { useEffect, useState } from 'react';
import UserNavbar from '../components/UserNavbar';
import { useRecoilValue } from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { cancelOrderApi, fetchUserPurchases } from '../services/operations/UserAuthApi';

const Container = styled.div`
    padding: 20px;
`;

const PurchaseList = styled.ul`
    list-style: none;
    padding: 0;
`;

const PurchaseItem = styled.li`
    background: #fff;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const CancelButton = styled.button`
    background-color: #ff4d4f;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: #ff7875;
    }
`;

const UserPurchases = () => {
    const token = useRecoilValue(UsertokenAtom);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPurchases();
    }, [token]);

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            const data = await fetchUserPurchases(token);
            setPurchases(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch purchases.');
            setLoading(false);
        }
    };

    const cancelOrder = async (transactionId) => {
        try {
            const response = await cancelOrderApi(token, { transactionId });
            toast.success('Order cancelled successfully.');
            fetchPurchases(); 
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to cancel order.');
        }
    };
    
    if (loading) {
        return <div>Loading purchases...</div>;
    }

    return (
        <>
            <UserNavbar />
            <Container>
                <h2>My Purchases</h2>
                {purchases.length === 0 ? (
                    <p>You have not made any purchases yet.</p>
                ) : (
                    <PurchaseList>
                        {purchases.map((purchase) => (
                            <PurchaseItem key={purchase._id}>
                                <h3>{purchase.name}</h3>
                                <p>Price: ₹{purchase.price}</p>
                                <CancelButton onClick={() => cancelOrder(purchase._id)}>
                                    Cancel Order
                                </CancelButton>
                            </PurchaseItem>
                        ))}
                    </PurchaseList>
                )}
            </Container>
        </>
    );
};

export default UserPurchases;