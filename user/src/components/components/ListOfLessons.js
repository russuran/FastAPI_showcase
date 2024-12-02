import '../../styles/index.css';
import '../../styles/utils.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../utils/Loader';
import axios from 'axios';

function ListOfLessons({ id }) {

    const [lessons, setLessons] = useState({});
    const [course_name, setCourseName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const coursesResponse = await axios.post('/lms/check_course', {'id': id}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLessons(coursesResponse.data.themes);
                setCourseName(coursesResponse.data.course_name);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id, token]);

    return (
        <div className='courses-container'>
            <p style={{ fontSize: '34px', marginBottom: '50px', marginTop: '50px' }}>{course_name}</p>
            <div className="list">
                {loading ? (
                    <Loader /> 
                ) : (
                    lessons.length > 0 ? (
                        lessons.map((lesson) => (
                            <Dropdown key={lesson.id} lesson={lesson} course_id={lesson.course_id} />
                        ))
                    ) : (
                        <div className='no-lessons'>Возможно, курса не существует или вы на него не записаны</div>
                    )
                )}
            </div>
        </div>
    );
}

function Dropdown({ lesson }) {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const toggleDropdown = async () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`/lms/get_tasks/${lesson.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className='dropdown'>
            <div className='bordered dropdown-header' onClick={toggleDropdown}>
                <img src={`http://localhost:8000/${lesson.passed ? 'checkmark.svg' : 'no_check.svg'}`} alt="checkmark" />
                <p style={{ fontSize: '30px', textAlign: 'start', margin: '0px' }}>{lesson.name}</p>
                <p style={{ fontSize: '16px', textAlign: 'start', margin: '10px 0px 0px 15px' }}>{lesson.description}</p>
            </div>
            <div className={`dropdown-content ${isOpen ? 'open' : ''}`}>
                {loading && <Loader className='bordered dropdown-header-tasks'/>}
                {error && <div className='error'>{error}</div>}
                {data && (
                    data.map((item, index) => (
                        <Link className='bordered dropdown-header-tasks' 
                              style={{ textDecoration: 'none', color: 'black' }} 
                              key={item.id} 
                              to={`lesson/${lesson.id}/task/${index}`}>
                            
                            <img src={item.passed ? 'http://localhost:8000/checkmark.svg' : 'http://localhost:8000/no_check.svg'} alt="checkmark" />
                            <p style={{ fontSize: '20px', textAlign: 'start', margin: '0px' }}>{item.name}</p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}


export default ListOfLessons;
