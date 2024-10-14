import React, { useState, useEffect } from 'react';
import UserNavbar from '../components/UserNavbar';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import { toast } from 'react-toastify';
import { addMoney, getBalance } from '../services/operations/UserAuthApi'; 

const Container = styled.div`
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    padding: 10px;
    background: #ffc107;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background: #e0a800;
    }
`;

const BalanceText = styled.div`
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

const AddMoney = () => {
    const token = useRecoilValue(UsertokenAtom);
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(null); 

    
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const fetchedBalance = await getBalance(token); 
                setBalance(fetchedBalance); 
            } catch (error) {
                console.error('Error fetching balance:', error);
                toast.error('Failed to fetch balance.');
            }
        };

        fetchBalance();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const numericAmount = parseFloat(amount);

        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }

        try {
            await addMoney(numericAmount, token); 

            toast.success('Money added successfully!');
            setAmount('');

            
            const updatedBalance = await getBalance(token);
            setBalance(updatedBalance);

        } catch (error) {
            console.error('Error occurred during API call:', error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Failed to add money: ${error.response.data.message}`);
            } else {
                toast.error('Failed to add money.');
            }
        }
    };

    return (
        <>
            <UserNavbar />
            <Container>
                <h2>Add Money</h2>
                {balance !== null && (
                    <BalanceText>Current Balance: ₹{balance}</BalanceText>
                )}
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <Button type="submit">Add Money</Button>
                </Form>
            </Container>
        </>
    );
};

export default AddMoney;
