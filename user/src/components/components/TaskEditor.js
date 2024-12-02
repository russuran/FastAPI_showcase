import '../../styles/index.css';
import '../../styles/taskeditor.css';
import '../../styles/utils.css';
import { useState } from 'react';
import PythonInterpreter from '../utils/PythonInterpreter';

function TaskEditor({ course_name, loading, tasks, task_id }) {
    const [taskId, setTaskId] = useState(task_id);
    const [code, setCode] = useState('');

    const selectTask = (id) => () => {
        setTaskId(id);
        setCode('');
    };

    return (
        <div className='courses-container'>
            <div className='task-editor'> 
                <div className='task-editor-left bordered-editor'>
                    {tasks.length > 0 ? tasks.map((task, index) => (
                        <div key={task.id} className='editor-tasks-item bordered-editor' onClick={selectTask(index)}>
                            <img id={`${task.id}`} src={`http://localhost:8000/${task.passed ? 'checkmark.svg' : 'no_check.svg'}`} alt="checkmark" />
                            <p>{task.name}</p>
                        </div>
                    )) : 'Не удалось загрузить задачи'}
                </div>
                <div className='task-editor-right bordered-editor'>
                    <div className='editor-tasks-editing'>
                        {tasks.length > 0 && tasks.length > taskId && taskId >= 0 ? 
                            <>
                                <h1>{tasks[taskId].name}</h1>
                                <p>{tasks[taskId].description}</p>
                                <PythonInterpreter task={tasks[taskId]} code={code} setCode={setCode} />
                            </>
                            :
                            <h1>Такой задачи нет...</h1>
                        }
                        {taskId < 0 ? <p>Баловаться вредно :O</p> : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskEditor;
