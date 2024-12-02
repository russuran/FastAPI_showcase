import React, { useEffect, useState } from 'react';
import '../../styles/index.css';
import Loader from '../utils/Loader';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Header() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({});
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchUser = async () => {
            try {
                const userResponse = await axios.post('/lms/get_user', {}, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                setUser(userResponse.data);
            }
            catch (error) {
                setError(error);
                console.log(error); //TODO: REMOVE IT
            }
            finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);
    
    let buttons = (
        <div>
            <Link onClick={() => localStorage.clear()} to="/login" className='logout-href'>Выход</Link>
            <Link to="/" className='logout-href'>Курсы</Link>
            <Link to="/profile" className='logout-href'>Профиль</Link>
        </div>
    );

    return (
        <div className='div-nav'>
            {buttons}
            <div className='r-side-nav'>
                {loading ? (
                    <>
                    <Loader width='122px' height='24px' marginLeft='20px' marginRight='20px'></Loader>
                    <Loader width='50px' height='50px' marginRight='20px' bRadius="32px"></Loader></>
                    
                ) : (
                    
                    
                    <>
                    <p style={{ fontSize: '20px' }}>{user.full_name}</p>
                    <img
                        src={`/images/avatars/${user.img}`}
                        alt="Сюрприз!"
                        style={{ borderRadius: '50%', height: '50px', width: '50px', marginRight: '20px', marginLeft: '20px' }} />
                    
                    </>

                ) }
                
            </div>    
        </div>
    );
  }

export default Header;