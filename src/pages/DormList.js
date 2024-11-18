import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

const DormList = () => {
    const [dorms, setDorms] = useState([]);

    useEffect(() => {
        axios.get('/api/v1/dormlist')
            .then(response => setDorms(response.data))
            .catch(error => console.error('Error fetching dorms:', error));
    }, []);

    return (
        <div className="style dorm-list-page">
        <h2>Dormitory List</h2>
        <ul>
            {dorms.map(dorm => (
                <li key={dorm.id}>{dorm.name}</li>
            ))}
        </ul>
        </div>
    );
};

export default DormList;
