import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OutfitSuggestion = () => {
  const [formData, setFormData] = useState({
    gender: "",
    occasion: "",
    climate: "",
    mood: "",
    user_input: ""
  });

  const [suggestion, setSuggestion] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/outfit-suggestion", formData);
      setSuggestion(response.data.outfit_suggestion);
    } catch (error) {
      console.error("Error fetching outfit suggestion:", error);
      setSuggestion("Failed to get a suggestion. Please try again.");
    }
  };

  const clearSuggestion = () => {
    setSuggestion(""); // Clear suggestion when requesting again
  };

  const handleBackClick = () => {
    navigate("/upload"); // Navigate to the upload page
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.heading}>Outfit Suggestion</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange} style={styles.select}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Occasion:</label>
            <input type="text" name="occasion" value={formData.occasion} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Climate:</label>
            <input type="text" name="climate" value={formData.climate} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mood:</label>
            <input type="text" name="mood" value={formData.mood} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Specific Input:</label>
            <textarea name="user_input" value={formData.user_input} onChange={handleChange} style={styles.textarea}></textarea>
          </div>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.button}>Get Recommendation</button>
          </div>
        </form>
      </div>

      {suggestion && (
        <div style={styles.suggestionContainer}>
          <h2 style={styles.suggestionHeading}>Outfit Suggestion:</h2>
          <div style={styles.suggestionText}>
            <div><strong>Gender:</strong> {formData.gender}</div>
            <div><strong>Occasion:</strong> {formData.occasion}</div>
            <div><strong>Climate:</strong> {formData.climate}</div>
            <div><strong>Mood:</strong> {formData.mood}</div>
            <div><strong>Additional Input:</strong> {formData.user_input}</div>
            <div style={styles.suggestionOutput}><strong>Suggested Outfit: </strong>{suggestion}</div>
          </div>
          <button onClick={clearSuggestion} style={styles.clearButton}>Ask for Another Suggestion</button>
        </div>
      )}

      <div style={styles.backButtonContainer}>
        <button onClick={handleBackClick} style={styles.backButton}>Back to Upload</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: "'Arial', sans-serif",
    backgroundColor: 'rgb(248 241 255)',
    overflowY: 'auto',
    backgroundImage : 'url(https://cdn.pixabay.com/photo/2021/09/11/13/07/girl-6615570_1280.jpg)',
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover", /* Ensures the image covers the entire area */
    backgroundPosition: "center"
  },
  formContainer: {
    backgroundColor: 'rgb(234 236 255 / 43%)',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '700px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '2rem',
    color: '#2a2a2a',
    marginBottom: '20px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  label: {
    fontSize: '1.1rem',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#333',
  },
  select: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '100%',
    marginBottom: '10px',
    backgroundColor: '#fafafa',
    transition: '0.3s',
  },
  input: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '96%',
    marginBottom: '10px',
    backgroundColor: '#fafafa',
    transition: '0.3s',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '96%',
    height: '150px',
    marginBottom: '10px',
    backgroundColor: '#fafafa',
    transition: '0.3s',
  },
  buttonContainer: {
    marginTop: '20px',
  },
  button: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '12px 20px',
    fontSize: '1.1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  suggestionContainer: {
    backgroundColor: 'rgb(234 236 255 / 43%)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '700px',
    textAlign: 'left',
    marginTop: '30px',
  },
  suggestionHeading: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  suggestionText: {
    fontSize: '1.1rem',
    color: '#333',
    lineHeight: '1.6',
  },
  suggestionOutput: {
    marginTop: '12px',
    fontWeight: 'bold',
    color: 'black',
  },
  clearButton: {
    backgroundColor: '#FF5722',
    color: 'white',
    padding: '10px 20px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
  },
  backButtonContainer: {
    marginTop: '30px',
  },
  backButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 20px',
    fontSize: '1.1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
  },
};

export default OutfitSuggestion;
