import React, { useState } from 'react';
import UserNavbar from '../components/UserNavbar';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import { toast } from 'react-toastify';
import { updateUserPassword } from '../services/operations/UserAuthApi'; // Import the function

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
    background: #17a2b8;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background: #138496;
    }
`;

const UpdateUserPassword = () => {
    const token = useRecoilValue(UsertokenAtom);
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long.');
            return;
        }
        try {
            await updateUserPassword(form.currentPassword, form.newPassword, token); // Use the new service function
            toast.success('Password updated successfully!');
            setForm({ currentPassword: '', newPassword: '' });
        } catch (error) {
            console.error(error);
            toast.error('Failed to update password.');
        }
    };

    return (
        <>
            <UserNavbar />
            <Container>
                <h2>Update Password</h2>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        value={form.currentPassword}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit">Update Password</Button>
                </Form>
            </Container>
        </>
    );
};

export default UpdateUserPassword;
