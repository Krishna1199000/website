import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsertokenAtom } from "../stores/Useratoms";
import { Usersignin } from "../services/operations/UserAuthApi";
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f2f5;
`;

const FormWrapper = styled.div`
    background: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 20px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
`;

const Button = styled.button`
    width: 100%;
    padding: 12px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: #45a049;
    }
`;

const UserSignin = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const setToken = useSetRecoilState(UsertokenAtom);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await Usersignin(form.email, form.password);
        if (token) {
            setToken(token);
            localStorage.setItem("token", token);
            toast.success('Signed in successfully!');
            navigate('/user/dashboard'); // Redirect to user dashboard
        } else {
            toast.error('Invalid credentials. Please try again.');
        }
    };

    return (
        <Container>
            <FormWrapper>
                <Title>User Sign In</Title>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit">Sign In</Button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    Don't have an account?{' '}
                    <span
                        style={{ color: '#4CAF50', cursor: 'pointer' }}
                        onClick={() => navigate('/user-signup')}
                    >
                        Sign Up
                    </span>
                </p>
            </FormWrapper>
        </Container>
    );
};

export default UserSignin;
