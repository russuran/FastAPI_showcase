import React, { useEffect, useState } from 'react';
import UserHeatmap from './Heatmap.js';
import StatsChart from './Stats.js';
import '../../styles/heatmap.css';
import axios from 'axios';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const [heatmap, setHeatmap] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.post('/lms/get_user', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userHeatmap = await axios.post('/lms/get_user_heatmap', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHeatmap(userHeatmap.data);

      } catch (error) {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  
  const newData = [
    { time: '0s', memory: 30 },
    { time: '1s', memory: 50 },
    { time: '2s', memory: 70 },
    { time: '3s', memory: 90 },
    { time: '4s', memory: 200 },
    { time: '0s', memory: 30 },
    { time: '1s', memory: 10 },
    { time: '2s', memory: 70 },
    { time: '3s', memory: 40 },
    { time: '4s', memory: 22 },
    { time: '0s', memory: 30 },
    { time: '1s', memory: 50 },
    { time: '2s', memory: 2 },
    { time: '3s', memory: 90 },
    { time: '4s', memory: 120 },
    { time: '0s', memory: 30 },
    { time: '1s', memory: 50 },
    { time: '2s', memory: 70 },
    { time: '3s', memory: 90 },
    { time: '4s', memory: 100 },
  ];

  return (
    <div className='courses-container'>
      <div className='profile-container'>
        <div className='profile-left'>
          <p style={{ fontSize: '26px', marginBottom: '10px', marginTop: '10px' }}>Прогресс за последние 30 дней</p>
          <UserHeatmap data={heatmap}/>
          <div className='profile-usercard'>
          </div>
        </div>
        <div className='profile-right'>
          <p style={{ fontSize: '26px', marginBottom: '10px', marginTop: '10px' }}>Статистика</p>
          <StatsChart data={newData} />
          <StatsChart data={newData} />
        </div>  
      </div>
      
      
    </div>
  );
}

export default Profile;
