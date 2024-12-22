import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Upload = ({ handleLogout }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [token] = useState(localStorage.getItem('token') || '');
  const [recommendations, setRecommendations] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [skinTone, setSkinTone] = useState(null);

  const navigate = useNavigate();

  const handleNavigateToStylist = () => {
    navigate('/stylist/upload');
  };
  
  useEffect(() => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const savedImage = localStorage.getItem('uploadedImage');
    if (savedImage) {
      setUploadedImage(savedImage);
    }
    if (!token) {
      setMessage("No token found, please login again.");
      return;
    }

    const fetchImage = async () => {
      try {
        const response = await axios.get('http://localhost:8080/upload/image', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.imageData) {
          setUploadedImage(`data:image/jpeg;base64,${response.data.imageData}`);
        }
      } catch (error) {
        console.error('Failed to retrieve image');
      }
    };

    fetchImage();
  }, [token]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/recommender', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });

      setSkinTone(response.data.skinTone);
      setMessage(response.data.message || '');
      setUploadedImage(URL.createObjectURL(selectedFile));
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      setMessage('Image upload failed');
      console.error('Upload error', error);
    }
  };

  // Define handleDelete function
  const handleDelete = async () => {
    try {
      const response = await axios.delete('http://localhost:8080/upload/image', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || 'Image deleted successfully');
      setUploadedImage(null);
      setRecommendations([]); // Clear recommendations on delete
    } catch (error) {
      setMessage('Failed to delete image');
      console.error('Delete error', error);
    }
  };


  // Define handleChatSubmit function
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatHistory([...chatHistory, { sender: 'user', text: chatInput }]);
    
    try {
      const response = await axios.post('http://localhost:8080/chatbot/chat', { message: chatInput });
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'bot', text: response.data.reply },
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);
    }

    setChatInput('');
  };

  const goToOutfitSuggestion = () => {
    navigate('/outfit-suggestion');
  };

  const styles = {
    container: {
      backgroundColor: 'rgb(227, 223, 236)',
      background: 'linear-gradient(to bottom,rgb(214, 175, 214), #ffffff)',
      fontFamily: 'Inter, sans-serif',
      color: '#333',
      padding: '20px 10px 60px',
      backgroundImage: 'url(https://cdn.pixabay.com/photo/2019/03/05/05/45/man-4035612_1280.jpg)',
      backgroundRepeat: "no-repeat",
    backgroundSize: "cover", /* Ensures the image covers the entire area */
    backgroundPosition: "center",
     height: "725px",
     fontFamily: "'Lora', 'serif'",
  fontWeight: '400', /* Normal weight */
  fontSize: '16px',
    },
    header: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'black',
      textAlign: 'center',
      margin: '20px 0',
      letterSpacing: '1px',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#68b3b7', // Base color for navbar
      padding: '15px 0',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: '0',
      zIndex: '1000',
      background: 'linear-gradient(rgb(255 255 255 / 40%), rgb(255 255 255 / 39%)', // Gradient background
    },

    navOptions: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center',
    },

    navOption: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'black',
      textDecoration: 'none',
      padding: '10px 20px',
      borderRadius: '25px',
      backgroundColor: 'white',
      transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover
      cursor: 'pointer',
      position: 'relative', // For adding animation effects
    },

    navOptionHover: {
      backgroundColor: '#white',
      transform: 'scale(1.05)', // Slightly increase size on hover
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', // Add shadow effect on hover
    },

    uploadButton: {
      padding: '10px 20px',
      backgroundColor: 'white',
      color: 'black',
      textDecoration: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      display: 'inline-block',
      marginTop: '10px',
    },

    deleteButton: {
      padding: '10px 20px',
      backgroundColor: '#ff5b5b',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      display: 'inline-block',
      marginLeft: '40px',
    },

    navButton: {
      padding: '10px 20px',
      fontSize: '16px',
      fontWeight: '600',
      backgroundColor: '#fff',
      color: '#333',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      marginLeft: '10px',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    },

    mainContent: {
      padding: '20px 40px',
      marginTop: '20px',
    },

    uploadForm: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '30px',
    },
    fileInput: {
      padding: '12px 20px',
      borderRadius: '25px',
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      fontSize: '16px',
      width: '250px',
    },
    uploadedImageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      padding: '15px',
    },
    uploadedImage: {
      width: '100%',
      height: '150px',
      maxWidth: '225px',
      borderRadius: '12px',
      border: '4px solid #f0f0f0',
      marginBottom: '15px',
    },
    recommendationsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      gap: '20px',
      marginTop: '30px',
    },
    recomendationCard: {
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      margin: '10px',
      transition: 'transform 0.2s ease, box-shadow 0.3s ease',
    },
    recommendationImage: {
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
    },
    recommendationText: {
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333',
    },
    chatContainer: {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      width: '300px',
      backgroundColor: '#fff',
      padding: '15px',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      zIndex: '9999',
      maxHeight: '400px',
      overflowY: 'auto',
    },
    chatMessage: {
      padding: '10px',
      margin: '5px 0',
      borderRadius: '12px',
      backgroundColor: '#f1f1f1',
      fontSize: '14px',
    },
    userMessage: {
      backgroundColor: '#68b3b7',
      color: '#fff',
    },
    inputContainer: {
      display: 'flex',
      marginTop: '10px',
    },
    input: {
      flex: '1',
      padding: '10px',
      borderRadius: '25px',
      border: '1px solid #ccc',
      fontSize: '16px',
      backgroundColor: '#fff',
    },
    
    chatButton: {
      padding: '10px 20px',
      backgroundColor: '#68b3b7',
      borderRadius: '25px',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      marginLeft: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.navbar}>
        <nav style={styles.navOptions}>
          <a onClick={handleLogout} style={{...styles.navOption, ...styles.navOptionHover}}>Logout</a>
          <a onClick={handleNavigateToStylist} style={{...styles.navOption, ...styles.navOptionHover}}>Go to Stylist Upload</a>
          <a onClick={goToOutfitSuggestion} style={{...styles.navOption, ...styles.navOptionHover}}>Outfit Suggestions</a>
        </nav>
      </header>
<main style={styles.mainContent}>
  <h2 style={styles.header}>Upload Your Outfit Image</h2>
  <div style={styles.uploadForm}>
    <input type="file" onChange={handleFileChange} accept="image/*" style={styles.fileInput} />
    <a onClick={handleUpload} style={styles.uploadButton}>Upload</a>
  </div>
  {message && <p style={styles.message}>{message}</p>}
  {uploadedImage && (
    <div style={styles.uploadedImageContainer}>
      <img src={uploadedImage} alt="Uploaded" style={styles.uploadedImage} />
      <a onClick={handleDelete} style={styles.deleteButton}>Delete Image</a>
    </div>
  )}
  <div style={styles.recommendationsContainer}>
    <h3>Suggested Outfits</h3>
    {recommendations.length > 0 ? (
      recommendations.map((rec, index) => (
        <a
          key={index}
          href={`/purchase?image=${encodeURIComponent(rec.image)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div style={styles.recommendationCard}>
            <img src={`http://localhost:5000/${rec.image}`} alt={`Recommendation ${index + 1}`} style={styles.recommendationImage} />
            <p style={styles.recommendationText}>View & Purchase</p>
          </div>
        </a>
      ))
    ) : (
      <p>No recommendations available.</p>
    )}
  </div>
</main>

      <div style={styles.chatContainer}>
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{ ...styles.chatMessage, ...(msg.sender === 'user' ? styles.userMessage : {}) }}
          >
            {msg.sender === 'user' ? 'You: ' : 'Bot: '}
            {msg.text}
          </div>
        ))}
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Ask for suggestions..."
            style={styles.input}
          />
          <button onClick={handleChatSubmit} style={styles.chatButton}>Send</button>
        </div>
      </div>
    </div>
  );
}  

export default Upload;
