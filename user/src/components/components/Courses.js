import React, { useEffect, useState } from 'react';
import '../../styles/index.css';
import '../../styles/utils.css';
import { Link } from 'react-router-dom';
import Loader from '../utils/Loader';
import axios from 'axios';

function Courses() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchCourses = async () => {
            try {
                const coursesResponse = await axios.post('/lms/list_of_courses', {}, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                setCourses(coursesResponse.data);
            }
            catch (error) {
                setError(error);
                console.log(error); //TODO: REMOVE IT
            }
            finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);
    
    return (
        <div className='courses-container'>
            <p style={{ fontSize: '34px', marginBottom: '50px', marginTop: '50px' }}>Мои курсы</p>
            <div className="items">
                {loading ? (
                    <>
                    <div className='item'>
                        <div className="item-top">
                            <Loader width="100%" height="100%" bRadius="16px 16px 0px 0px"></Loader>
                        </div>
                        <div className="item-bottom">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <div style={{ marginLeft: '10px' }}>
                                    <Loader marginTop='10px' height='24px' width='125%'></Loader>
                                    <Loader marginTop='10px' height='24px'></Loader>
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <Loader marginTop='10px' height='24px' width='45px'></Loader>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'end', textAlign: 'end', marginTop: '20px', marginRight: '10px', height: '100%' }}>
                                
                                <Loader height='24px' width='80px'></Loader>
                                
                            </div>
                        </div>
                    </div>
                    </>
                ) : courses.length > 0 ? (
                    courses.map(course => ( 
                        <div key={course.id} className='item'> 
                            <div className="item-top">
                                <img src={course.image || "pyth-png.png"} alt={course.title} />
                            </div>
                            <div className="item-bottom">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <p className='progress'> {course.course_name}</p>
                                    </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <p className='progress'> Пройдено {course.completed} / {course.total}</p>
                                    </div>
                                    </div>
                                    <div style={{ marginRight: '10px' }}>
                                        <p className='progress' style={{ textAlign: 'end' }}>Наставник</p>
                                        <p className='progress' style={{ textAlign: 'end' }}>{course.teacher}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'end', textAlign: 'end' }}>
                                    <Link className='' to={`/course/${course.id}`} style={{ padding: 5 }}>
                                        <p className='progress mt-20 bordered'>перейти</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Пока что курсов нет...</p>
                )}
            </div>
        </div>
    );
}

export default Courses;
