import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

const StudentList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios.get('/api/v1/studentlist')
            .then(response => setStudents(response.data))
            .catch(error => console.error('Error fetching students:', error));
    }, []);

    return (
        <div className="style">
            <h2>Student List</h2>
            <ul>
                {students.map(student => (
                    <li key={student.id}>{student.first_name} {student.last_name}</li>
                ))}
            </ul>
        </div>
    );
};

export default StudentList;
