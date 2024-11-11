import React, { useState } from 'react';
import axios from 'axios';
import '../styles/styles.css';

const UploadPayment = ({ studentId }) => {
    const [screenshot, setScreenshot] = useState(null);

    const handleFileChange = (event) => {
        setScreenshot(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('payment_screenshot', screenshot);

        axios.post(`/api/v1/upload_payment_screenshot/${studentId}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => alert('Screenshot uploaded'))
        .catch(error => console.error('Error uploading screenshot:', error));
    };

    return (
        <div className="style">
            <h2>Upload Payment Screenshot</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadPayment;
