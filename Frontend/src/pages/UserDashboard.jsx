import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useRecoilValue } from 'recoil';
import { UsertokenAtom } from '../stores/Useratoms';
import { toast } from 'react-toastify';
import { fetchProducts, searchProducts } from '../services/operations/UserAuthApi';
import UserNavbar from '../components/UserNavbar';

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

const UserDashboard = () => {
  const token = useRecoilValue(UsertokenAtom);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    handleFetchProducts();
  }, [token]);

  const handleFetchProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products.');
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

  const handleBuy = (product) => {
    toast.success(`Product "${product.name}" has been purchased!`);
    
  };

  return (
    <>
      <UserNavbar />
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
              <p>Stock: {product.stock}</p>
              <BuyButton
                onClick={() => handleBuy(product)}
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
