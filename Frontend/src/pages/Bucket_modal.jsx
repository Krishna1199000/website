import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { bucketAtom } from '../stores/Useratoms';
import { FaTimes } from 'react-icons/fa';
import { buyProducts } from '../services/operations/UserAuthApi';

const BucketModal = ({ isOpen, closeModal }) => {
    const bucketItems = useRecoilValue(bucketAtom); // Recoil state for bucket

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h3>Your Bucket</h3>
                    <FaTimes size={20} onClick={closeModal} />
                </ModalHeader>
                <ModalBody>
                    {bucketItems.length === 0 ? (
                        <p>Your bucket is empty.</p>
                    ) : (
                        bucketItems.map((item, index) => (
                            <BucketItem key={index}>
                                <img src={item.imageUrl} alt={item.name} />
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>₹{item.price}</p>
                                </div>
                            </BucketItem>
                        ))
                    )}
                </ModalBody>
                <ModalFooter>
                    <button onClick={buyProducts}>Buy Now</button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

// Styled components
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: #fff;
    width: 400px;
    padding: 20px;
    border-radius: 8px;
    position: relative;
    animation: slideIn 0.3s ease-out;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ModalBody = styled.div`
    margin-top: 20px;
`;

const BucketItem = styled.div`
    display: flex;
    margin-bottom: 15px;

    img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        margin-right: 10px;
    }
`;

const ModalFooter = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
`;
