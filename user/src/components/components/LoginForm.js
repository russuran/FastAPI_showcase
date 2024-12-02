import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';

function Login() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [robotImage, setRobotImage] = useState('robot_sad.svg');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const textElement = e.currentTarget.getBoundingClientRect();
    const offsetX = clientX - textElement.left;
    const offsetY = clientY - textElement.top;

    setPosition({
      x: offsetX / 20,
      y: offsetY / 20,
    });
  };

  const handleMouseEnter = () => {
    setRobotImage('robot.svg');
  };

  const handleMouseLeave = () => {
    setRobotImage('robot_sad.svg');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('/lms/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('token', data.access_token); 
        console.log(localStorage.getItem('token'));
        navigate('/');
      } else {
        setErrorMessage(data.error || 'Неверный логин или пароль');
        setRobotImage('robot_oh.svg');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      setErrorMessage('Ошибка сети. Попробуйте еще раз позже.');
      setRobotImage('robot_oh.svg');
    }
  };

  return (
    <div className='form-container'>
      <AnimatedBackground />
      <div className='form-wrapper'>
        <p
          style={{
            fontSize: 70,
            marginBottom: 10,
            marginTop: 40,
            fontFamily: 'Broken Console',
            color: '#44776E',
            transform: `translate(${-position.x}px, ${-position.y}px)`,
            transition: 'transform 0.1s ease',
            display: 'inline-block',
            cursor: 'default'
          }}
          onMouseMove={handleMouseMove}
        >
          16BIT
        </p>
        <form className='form-flex' onSubmit={handleSubmit}>
          <label className='flex-label'>
            Логин
            <input
              type="text"
              name="username"
              className='mb-10 mt-10 login-form-input'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label className='flex-label'>
            Пароль
            <input
              type="password"
              name="password"
              className='mb-10 mt-10 login-form-input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <div className='lr-flex'>
            <div className='left'>
              <img
                src={robotImage}
                style={{ width: 135, marginLeft: 10, marginTop: 10 }}
                alt="Robot"
              />
            </div>
            <div className='right'>
              <input
                type="submit"
                value="Вход"
                className='mb-4 mt-10 login-form-btn'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
              {errorMessage && <p id='errors' style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;