import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserHeatmap() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [heatmap, setHeatmap] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
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

        const [hoveredIndex, setHoveredIndex] = useState(null);

        const getColor = (value) => {
            const maxValue = Math.max(...heatmap);
            const minValue = Math.min(...heatmap);
            const range = maxValue - minValue;

            const normalizedValue = (value - minValue) / range;

            const r = 0
            const g = Math.floor(255 - 255 * normalizedValue);
            const b = 0;

            let ret_val = `rgb(${r}, ${g}, ${b}, 95%)`;
            if (value === 0){
                ret_val = `#f5f5f5`;
            }
            
            return ret_val;
        };

        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', border: '2px solid black', borderRadius: '16px', padding: '8px' }}>
                {heatmap.length > 0 && heatmap.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: getColor(item),
                            width: '11%',
                            aspectRatio: '1 / 1',
                            margin: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            position: 'relative',
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {hoveredIndex === index && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: '#fff',
                                padding: '2px 5px',
                                borderRadius: '3px',
                                fontSize: '12px',
                            }}>
                                {item}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
}

export default UserHeatmap;
