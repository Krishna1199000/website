import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useRecoilValue } from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import { toast } from 'react-toastify';
import { fetchProducts, addToBucket, removeFromBucket, viewBucket, searchProducts, buyAllProducts } from '../services/operations/UserAuthApi';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-in-out;
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
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  margin-top: 10px;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const BuyButton = styled(Button)`
  background: #28a745;
  &:hover { background: #218838; }
`;

const CheckoutButton = styled(Button)`
  background: #007bff;
  margin: 20px auto;
  display: block;
  &:hover { background: #0056b3; }
`;

const UserDashboard = () => {
  const token = useRecoilValue(UsertokenAtom);
  const [products, setProducts] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    handleFetchProducts();
    fetchBucket();
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
      setBucket(data.bucket);
    } catch (error) {
      toast.error('Failed to fetch bucket.');
    }
  };

  const modifyBucket = async (productId, action) => {
    try {
      if (action === 'add') {
        await addToBucket(productId, token); // Correct API for adding
      } else if (action === 'remove') {
        await removeFromBucket(productId, token); // Correct API for removing
      }
      toast.success(`Product ${action === 'add' ? 'added to' : 'removed from'} bucket!`);
      fetchBucket(); // Refresh the bucket after modifying
    } catch (error) {
      toast.error(`Failed to ${action === 'add' ? 'add to' : 'remove from'} bucket.`);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await searchProducts(searchQuery, token);
      setProducts(data);
    } catch (error) {
      toast.error('Search failed.');
    }
  };

  const handleCheckout = async () => {
    try {
      const receipt = await buyAllProducts(token);
      toast.success('Purchase successful! Receipt generated.');
      fetchBucket(); // Refresh bucket after purchase
      console.log("Receipt details:", receipt);
    } catch (error) {
      toast.error('Checkout failed.');
    }
  };

  return (
    <Container>
      <h2>All Products</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', width: '100%', maxWidth: '400px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </form>
      <ProductsGrid>
        {products.map((product) => (
          <ProductCard key={product._id}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <div>
              <BuyButton onClick={() => modifyBucket(product._id, 'add')}>+</BuyButton>
              <BuyButton onClick={() => modifyBucket(product._id, 'remove')}>-</BuyButton>
            </div>
          </ProductCard>
        ))}
      </ProductsGrid>
      <CheckoutButton onClick={handleCheckout}>Checkout All & Generate Receipt</CheckoutButton>
    </Container>
  );
};

export default UserDashboard;
