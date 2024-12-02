import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python';
import '../../styles/PythonInterpreter.css';

const PythonInterpreter = ({ task, code, setCode }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [sended, setSend] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  console.log(task);

  useEffect(() => {
    setData({});
    setSend(false);
    setError('');
  }, [task]);

  const handleCodeChange = (editor, data, value) => {
    setCode(value);
  };

  const handleClear = () => {
    if (window.confirm('Вы уверены, что хотите очистить код?')) {
      setCode('');
      setError('');
      setData({});
      setSend(false);
    }
  };

  const handleCompile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/lms/execute', 
      { 
        lang: 'python',
        code: code, 
        testfile: task.testfile,
        task_id: task.id
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      setData(response.data);
      setSend(true);

      if (response.data.status === 'passed') {
        const image = document.getElementById(task.id);
        image.classList.add('fade-out');         
        setTimeout(() => {
          image.setAttribute("src", "http://localhost:8000/checkmark.svg");
          image.classList.remove('fade-out');
        }, 500);
      }

    } catch (err) {
      setError(err.response ? err.response.data.detail : 'Ошибка при отправке кода на сервер');
    } finally {
      setLoading(false);
    }
  };
  
  const editor = (
    <CodeMirror
      value={code}
      options={{
        mode: 'python',
        lineNumbers: true,
        theme: 'default',
        autoRefresh: true
      }}
      onBeforeChange={handleCodeChange}
    />
  );

  return (
    <>
      <div className="python-interpreter">
        {editor}
        <div className="interpreter-controls">
          {error && <p className={`error-message ${error ? 'show' : ''}`}>{JSON.stringify(error)}</p>}
          <p className="logout-href" onClick={handleCompile} disabled={loading}>
            {loading ? 'Выполняю...' : 'Запустить код'}
          </p>
          <p className='logout-href' onClick={handleClear}>Очистить</p>
        </div>
      </div>
      <div className={`interpreter-output ${data.err ? 'error' : ''}`}>
        {data.status === 'passed' && sended === true ? (
          <>
            <p>Задание пройдено</p>
            <div>
              {data.description.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </>
        ) : ( 
          sended === true ? (
            <>
              <p>{data.err}</p>
              <div>
                {data.description.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </>
          ) : null
        )}
        {task.passed ? <p>Вы уже решили это задание, но можете отправить другой вариант.</p>: ''}
      </div>
    </>
  );
};

export default PythonInterpreter;
