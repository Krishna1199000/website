

import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useSetRecoilState , useRecoilValue} from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import styled from 'styled-components';
import { bucketAtom } from '../stores/Useratoms';



const Nav = styled.nav`
    background: #333;
    height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
    position: relative;
`;

const NavLogo = styled(Link)`
    color: #fff;
    font-size: 1.5rem;
    text-decoration: none;
`;

const Hamburger = styled(FaBars)`
    color: #fff;
    cursor: pointer;
    display: none;

    @media (max-width: 768px) {
        display: block;
    }
`;


const Menu = styled.ul`
    list-style: none;
    display: flex;
    gap: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        background: #333;
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;
        padding: 20px 0;
        display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    }
`;

const MenuItem = styled.li`
    a, button {
        color: #fff;
        text-decoration: none;
        font-size: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 10px 20px;
        width: 100%;
        text-align: left;

        &:hover {
            background: #575757;
        }
    }
`;

const UserNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const setToken = useSetRecoilState(UsertokenAtom);
    const bucketItems = useRecoilValue(bucketAtom);
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
        navigate('/user-signin');
    };

    return (
        <Nav>
            <NavLogo to="/user/dashboard">jay Hinglaj Tailor</NavLogo>
            <Hamburger size={24} onClick={() => setIsOpen(!isOpen)} />
            
            <Menu $isOpen={isOpen}>
                <MenuItem>
                    <Link to="/user/dashboard">Home</Link>
                </MenuItem>
                <MenuItem>
                    <Link to="/user/dashboard">Products</Link>
                </MenuItem>
                <MenuItem>
                    <Link to="/user/add-money">Add Money</Link>
                </MenuItem>
                <MenuItem>
                    <Link to="/user/updateCredentials">Update Password</Link>
                </MenuItem>
                <MenuItem>
                    <Link to="/user/bucket">
                        <FaShoppingCart size={20} />
                        <span>({bucketItems.length})</span> {/* Shows item count */}
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link to="/user/purchases">My Purchases</Link>
                </MenuItem>
                <MenuItem>
                    <button onClick={handleLogout}>Logout</button>
                </MenuItem>
            </Menu>
        </Nav>
    );
};

export default UserNavbar;