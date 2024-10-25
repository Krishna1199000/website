import React, { useEffect, useState } from 'react';
import UserNavbar from '../components/UserNavbar';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import { toast } from 'react-toastify';
import { fetchProducts, modifyProductInBucket, viewBucket, searchProducts } from '../services/operations/UserAuthApi';

const Container = styled.div`
    padding: 20px;
`;

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
`;

const ProductCard = styled.div`
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const BuyButton = styled.button`
    padding: 10px 15px;
    background: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background: #218838;
    }
`;

const SearchInput = styled.input`
    padding: 10px;
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const QuantityControls = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;

const QuantityButton = styled.button`
    padding: 10px;
    background-color: #f0f0f0;
    border: none;
    cursor: pointer;
    margin: 0 10px;

    &:hover {
        background-color: #ddd;
    }
`;

const QuantityText = styled.span`
    font-size: 1.2rem;
`;

const UserDashboard = () => {
    const token = useRecoilValue(UsertokenAtom);
    const [products, setProducts] = useState([]);
    const [bucket, setBucket] = useState([]); // State for bucket items
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        handleFetchProducts();
        fetchBucket(); // Fetch the current bucket
    }, [token]);

    const handleFetchProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            toast.error('Failed to fetch products.');
        }
    };

    const fetchBucket = async () => {
        try {
            const data = await viewBucket(token);
            setBucket(data.bucket); // Set the bucket items
        } catch (error) {
            toast.error('Failed to fetch bucket.');
        }
    };

    const handleBuy = async (productId) => {
        try {
            await modifyProductInBucket(productId, 'add', token);
            toast.success('Product added to bucket!');
            fetchBucket(); // Refresh the bucket after adding the product
        } catch (error) {
            console.error("Purchase error:", error.response ? error.response.data : error.message);
            toast.error('Failed to add product to bucket.');
        }
    };

    const modifyProductQuantity = async (productId, action) => {
        try {
            const updatedBucket = await modifyProductInBucket(productId, action, token);
            setBucket(updatedBucket.bucket);
        } catch (error) {
            toast.error('Failed to update bucket.');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const data = await searchProducts(searchQuery, token); 
            setProducts(data);
        } catch (error) {
            console.error("Search error:", error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.message || 'Search failed.');
        }
    };

    return (
        <>
            <UserNavbar />
            <Container>
                <h2>All Products</h2>
                <form onSubmit={handleSearch}>
                    <SearchInput
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
                <ProductsGrid>
                    {products.map((product) => (
                        <ProductCard key={product._id}>
                            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                            <h3>{product.name}</h3>
                            <p>₹{product.price}</p>
                            <p>Stock: {product.stock}</p>
                            <QuantityControls>
                                <QuantityButton onClick={() => modifyProductQuantity(product._id, 'remove')} disabled={!bucket.find(p => p.productId === product._id)?.quantity}>-</QuantityButton>
                                <QuantityText>{bucket.find(p => p.productId === product._id)?.quantity || 0}</QuantityText>
                                <QuantityButton onClick={() => modifyProductQuantity(product._id, 'add')} disabled={product.stock < 1}>+</QuantityButton>
                            </QuantityControls>
                            <BuyButton 
                                onClick={() => handleBuy(product._id)} 
                                disabled={product.stock < 1 || bucket.find(p => p.productId === product._id)?.quantity > 0}
                                style={{ 
                                    opacity: product.stock < 1 ? 0.5 : 1, 
                                    cursor: product.stock < 1 ? 'not-allowed' : 'pointer' 
                                }}
                            >
                                {product.stock < 1 ? 'Out of Stock' : 'Buy Now'}
                            </BuyButton>
                        </ProductCard>
                    ))}
                </ProductsGrid>
            </Container>
        </>
    );
};

export default UserDashboard;
