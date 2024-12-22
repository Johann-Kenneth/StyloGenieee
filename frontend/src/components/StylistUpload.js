import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StylistUpload = () => {
  const [file, setFile] = useState(null);
  const [occasion, setOccasion] = useState('casual');
  const [recommendations, setRecommendations] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [skinTone, setSkinTone] = useState('');
  const [bodyShape, setBodyShape] = useState('');

  const [token] = useState(localStorage.getItem('token') || ''); // Get token from local storage

  useEffect(() => {
    const savedRecommendations = localStorage.getItem('recommendations');
    const savedImage = localStorage.getItem('uploadedImage');

    if (savedRecommendations) {
      setRecommendations(JSON.parse(savedRecommendations));
    }

    if (savedImage) {
      setImagePreview(savedImage);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create a preview of the selected image
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleOccasionChange = (e) => {
    setOccasion(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('occasion', occasion);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Response Data:', response.data);
      const { skin_tone, body_shape, recommendations } = response.data;

      setRecommendations(recommendations || []);
      setSkinTone(skin_tone);
      setBodyShape(body_shape);

      localStorage.setItem('recommendations', JSON.stringify(recommendations));
      localStorage.setItem('uploadedImageFromStylistUpload', imagePreview);

    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recommendations || !file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('recommendation', JSON.stringify(recommendations));
    formData.append('occasion', occasion);

    try {
      const response = await axios.post('http://localhost:8080/upload/save', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      alert('Recommendations and image saved successfully!');
      localStorage.setItem('recommendations', JSON.stringify(recommendations));
    } catch (error) {
      console.error('Error saving recommendation:', error);
      alert('Failed to save recommendations and image.');
    }
  };

  const handleNavigateToUpload = () => {
    navigate('/upload');
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
    setRecommendations(null);
  };

  const handleEditImage = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>AI Personal Stylist</h2>
        <p style={styles.description}>
          Upload an image to receive styling recommendations based on your body shape and skin tone.
        </p>

        {/* File Input */}
        <div style={styles.formGroup}>
          <label htmlFor="fileInput" style={styles.label}>Upload Your Image</label>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
        </div>

        {/* Occasion Select */}
        <div style={styles.formGroup}>
          <label htmlFor="occasion" style={styles.label}>Select Occasion</label>
          <select
            id="occasion"
            value={occasion}
            onChange={handleOccasionChange}
            style={styles.selectInput}
          >
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
          </select>
        </div>

        {/* Upload Button */}
        <div style={styles.formGroup}>
          <button
            onClick={handleUpload}
            style={styles.buttonPrimary}
          >
            Get Recommendations
          </button>
        </div>

        {/* Loading and Error States */}
        {loading && <p style={styles.loading}>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* Recommendations Section */}
        {recommendations && Array.isArray(recommendations) && recommendations.length > 0 && (
          <div style={styles.recommendations}>
            <h3 style={styles.subheading}>Styling Recommendations</h3>
            <p style={styles.details}><strong>Skin Tone:</strong> {skinTone || 'Not available'}</p>
            <p style={styles.details}><strong>Body Shape:</strong> {bodyShape || 'Not available'}</p>
            <ul style={styles.recommendationList}>
              {recommendations.map((item, index) => (
                <li key={index} style={styles.recommendationItem}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Save Button */}
        <div style={styles.formGroup}>
          <button
            onClick={handleSave}
            style={styles.buttonSave}
          >
            Save Recommendations
          </button>
        </div>

        {/* Navigate to Upload Page */}
        <div style={styles.formGroup}>
          <button
            onClick={handleNavigateToUpload}
            style={styles.buttonSecondary}
          >
            Go to Upload
          </button>
        </div>
      </div>

      {/* Image Preview Section */}
      {imagePreview && (
        <div style={styles.imagePreviewContainer}>
          <h3 style={styles.previewHeading}>Uploaded Image</h3>
          <div style={styles.imageActions}>
            <button onClick={handleEditImage} style={styles.actionButtonEdit}>Edit</button>
            <button onClick={handleRemoveImage} style={styles.actionButtonRemove}>Remove</button>
          </div>
          <div style={styles.imagePreviewWrapper}>
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              style={styles.previewImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for the page (inline styles)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F7F7F7', 
    padding: '40px',
    minHeight: '100vh',
    backgroundImage : 'url(https://cdn.pixabay.com/photo/2017/05/13/12/40/fashion-2309519_1280.jpg)',
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover", /* Ensures the image covers the entire area */
    backgroundPosition: "center"

  },
  formContainer: {
    flex: 1,
    maxWidth: '500px',
    backgroundColor: 'rgb(234 236 255 / 30%)',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    margin: '20px',
    textAlign: 'left',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#4A4A4A', 
    fontWeight: '600',
    marginBottom: '15px',
  },
  description: {
    color: '#7A7A7A',
    fontSize: '1.1rem',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '8px',
  },
  fileInput: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #D3D3D3',
    backgroundColor: '#F9F9F9',
    fontSize: '1rem',
    width: '100%',
  },
  selectInput: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #D3D3D3',
    backgroundColor: '#F9F9F9',
    fontSize: '1rem',
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#5B6DFF', 
    color: '#ffffff',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    width: '100%',
    border: 'none',
  },
  buttonSave: {
    backgroundColor: '#5B6DFF',
    color: '#ffffff',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    width: '100%',
    border: 'none',
  },
  buttonSecondary: {
    backgroundColor: '#5B6DFF',
    color: '#ffffff',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    width: '100%',
    border: 'none',
  },
  loading: {
    color: '#5B6DFF',
    fontSize: '1.2rem',
    marginTop: '10px',
  },
  error: {
    color: '#FF0000',
    fontSize: '1.2rem',
    marginTop: '10px',
  },
  recommendations: {
    marginTop: '20px',
    backgroundColor: '#F1F1F1',
    padding: '15px',
    borderRadius: '8px',
  },
  subheading: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '10px',
  },
  recommendationList: {
    listStyleType: 'none',
    padding: '0',
  },
  recommendationItem: {
    fontSize: '1rem',
    marginBottom: '5px',
    color: '#333',
  },
  imagePreviewContainer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  previewHeading: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '15px',
  },
  imagePreviewWrapper: {
    display: 'inline-block',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
  previewImage: {
    marginTop: '20px',
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  imageActions: {
    marginTop: '15px',
  },
  actionButtonEdit: {
    backgroundColor: '#FF8C00',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    margin: '0 10px',
    transition: 'transform 0.3s ease',
  },
  actionButtonRemove: {
    backgroundColor: '#FF6347',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    margin: '0 10px',
    transition: 'transform 0.3s ease',
  },
};

export default StylistUpload;
