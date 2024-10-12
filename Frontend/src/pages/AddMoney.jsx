import React, { useState } from 'react';
import UserNavbar from '../components/UserNavbar';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import { toast } from 'react-toastify';
import { addMoney } from '../services/operations/userauthapi'; // Ensure correct path and casing

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

const AddMoney = () => {
    const token = useRecoilValue(UsertokenAtom);
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const numericAmount = parseFloat(amount); // Convert to number

        console.log('Submitting amount:', numericAmount); // Log amount before submission
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }
        try {
            const response = await addMoney(numericAmount, token); // Call the addMoney function

            console.log('Response from server:', response); // Log server response
            toast.success('Money added successfully!');
            setAmount(''); // Reset amount input
        } catch (error) {
            console.error('Error occurred during API call:', error); // Log error details
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
