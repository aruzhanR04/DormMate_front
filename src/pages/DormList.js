import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DormList = () => {
    const [dorms, setDorms] = useState([]);

    useEffect(() => {
        axios.get('/api/v1/dormlist')
            .then(response => setDorms(response.data))
            .catch(error => console.error('Error fetching dorms:', error));
    }, []);

    return (
        <div>
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
