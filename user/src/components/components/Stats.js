import React from 'react';
import '../../styles/heatmap.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const StatsChart = () => {
    const data = [
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
        <div style={{ borderRadius: 16,
            border: '2px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 0px',
            marginBottom: '20px'
           }}>
        <ResponsiveContainer width='95%' height={250}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="memory" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
        </div>
    );
};

export default StatsChart;
