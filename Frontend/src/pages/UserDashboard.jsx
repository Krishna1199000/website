import React, { useEffect, useState } from 'react';
import UserNavbar from '../components/UserNavbar';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import { toast } from 'react-toastify';
import { fetchProducts, buyProduct, searchProducts } from '../services/operations/UserAuthApi';

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

const UserDashboard = () => {
    const token = useRecoilValue(UsertokenAtom);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        handleFetchProducts();
    }, []);

    
    const handleFetchProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            toast.error('Failed to fetch products.');
        }
    };

    const handleBuy = async (productId) => {
        try {
            await buyProduct(productId, token);
            toast.success('Product purchased successfully!');
        } catch (error) {
            console.error("Purchase error:", error.response ? error.response.data : error.message);
            toast.error('Failed to purchase product.');
        }
    };


    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const data = await searchProducts(searchQuery, token); // Pass token
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
                            <BuyButton 
                                onClick={() => handleBuy(product._id)} 
                                disabled={product.stock < 1} 
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