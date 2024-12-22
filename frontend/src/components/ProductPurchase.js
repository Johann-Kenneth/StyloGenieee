import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductPurchase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [productImage, setProductImage] = useState('');
  const [productLink, setProductLink] = useState('');

  // Get image query parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const image = urlParams.get('image');
    
    if (image) {
      setProductImage(image);
      // Assume the image link comes from the URL or an API, here we just pass a demo link for the purchase.
      setProductLink('https://www.example.com/purchase?image=${encodeURIComponent(image)}');
    }
  }, [location.search]);

  const handleRedirect = () => {
    // Redirect user to the external purchase link
    window.location.href = productLink;
  };

  // Handle going back to Upload page
  const handleBackToUpload = () => {
    navigate('/upload');  // Navigate back to the Upload page
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>Product Purchase</h2>
      {productImage && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}>
            <img
              src={`http://localhost:5000/${productImage}`}
              alt="Product"
              style={{ 
                width: '250px',        // Adjust the image width
                height: '200px',       // Maintain the aspect ratio
                borderRadius: '10px',  // Add rounded corners for better aesthetics
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Add subtle shadow for depth
                objectFit: 'cover',    // Ensures the image fits the container without distortion
                transition: 'transform 0.3s ease-in-out', // Smooth transition on hover
              }}
              className="zoom-img"
            />
          </div>

          <p style={{ fontSize: '18px', color: '#555' }}>Click below to proceed with the purchase.</p>
          
          <button 
            onClick={handleRedirect}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            Proceed to Purchase
          </button>
        </>
      )}

      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={handleBackToUpload}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Back to Upload
        </button>
      </div>
    </div>
  );
};

export default ProductPurchase;