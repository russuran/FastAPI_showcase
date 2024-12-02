import React, { useEffect, useState } from 'react';
import '../../styles/index.css';
import '../../styles/utils.css';
import { Link } from 'react-router-dom';
import Loader from '../utils/Loader';
import axios from 'axios';

function Diplomas() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [diplomas, setDiplomas] = useState([]);
    useEffect(() => {
        const fetchDiplomas = async () => {
            const token = localStorage.getItem('token');
            try {
                const diplomasResponse = await axios.post('/lms/list_of_diplomas', {}, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                setDiplomas(diplomasResponse.data);
            }
            catch (error) {
                setError(error);
                console.log(error); //TODO: REMOVE IT
            }
            finally {
                setLoading(false);
            }
        };
        fetchDiplomas();
    }, []);
    
    return (
        <div className='courses-container'>
            <p style={{ fontSize: '34px', marginBottom: '50px', marginTop: '50px' }}>Мои дипломы</p>
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
                                    <Loader height='24px' marginTop='10px' width='125%'></Loader>
                                    <Loader marginTop='10px' height='24px'></Loader>
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <Loader marginTop='10px' height='24px' width='45px'></Loader>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'end', textAlign: 'end', marginTop: '20px', marginRight: '10px', height: '100%' }}>
                                <Loader marginTop='10px' height='24px' width='80px'></Loader>
                            </div>
                        </div>
                    </div>
                    <div className='item'>
                    <div className="item-top">
                        <Loader width="100%" height="100%" bRadius="16px 16px 0px 0px"></Loader>
                    </div>
                    <div className="item-bottom">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <div style={{ marginLeft: '10px' }}>
                                <p className='progress'><Loader height='24px' width='125%'></Loader></p>
                                <p className='progress'><Loader height='24px'></Loader></p>
                            </div>
                            <div style={{ marginRight: '10px' }}>
                                <p className='progress' style={{ textAlign: 'end' }}><Loader height='24px' width='45px'></Loader></p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'end', textAlign: 'end', marginTop: '20px', marginRight: '10px', height: '100%' }}>
                            <p className='progress mt-20' to="/" style={{ padding: 5 }}>
                            <Loader height='24px' width='80px'></Loader>
                            </p>
                        </div>
                    </div>
                    </div>
                    <div className='item'>
                    <div className="item-top">
                        <Loader width="100%" height="100%" bRadius="16px 16px 0px 0px"></Loader>
                    </div>
                    <div className="item-bottom">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <div style={{ marginLeft: '10px' }}>
                                <p className='progress'><Loader height='24px' width='125%'></Loader></p>
                                <p className='progress'><Loader height='24px'></Loader></p>
                            </div>
                            <div style={{ marginRight: '10px' }}>
                                <p className='progress' style={{ textAlign: 'end' }}><Loader height='24px' width='45px'></Loader></p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'end', textAlign: 'end', marginTop: '20px', marginRight: '10px', height: '100%' }}>
                            <p className='progress mt-20' to="/" style={{ padding: 5 }}>
                            <Loader height='24px' width='80px'></Loader>
                            </p>
                        </div>
                    </div>
                    </div>
                    </>
                ) : diplomas.length > 0 ? (
                    diplomas.map(diploma => ( 
                        <div key={diploma.id} className='item'>
                            <div className="item-top">
                                <img src={diploma.image || "pyth-png.png"} alt={diploma.title} />
                            </div>
                            <div className="item-bottom">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <div style={{ marginLeft: '10px' }}>
                                        <p className='progress'>{diploma.title}</p>
                                        <p className='progress'>Итоговый результат: {diploma.mark}</p>
                                    </div>
                                    <div style={{ marginRight: '10px' }}>
                                        <p className='progress' style={{ textAlign: 'end' }}>{diploma.year}г.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'end', textAlign: 'end', marginTop: '20px', marginRight: '10px', height: '100%' }}>
                                    <Link className='progress mt-20 bordered' to="/" style={{ padding: 5 }}>
                                        Скачать
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                    
                ) : (
                    <p>Пока что дипломов нет...</p> 
                )}
            </div>
        </div>
    );
}

export default Diplomas;
