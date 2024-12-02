import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/index.css';
import axios from 'axios';
import TaskEditor from './TaskEditor';

function TaskPage({ themes_to_pass }) {
    const { id, lesson_id, task_id } = useParams();
    const [courseData, setCourseData] = useState({});
    const [tasks, setTasksData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchLessonData = async () => {
            try {
                const coursesResponse = await axios.post('/lms/check_course', { 'id': id }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourseData(coursesResponse.data);

                const tasksResponse = await axios.get(`/lms/get_tasks/${lesson_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasksData(tasksResponse.data);
            } catch (error) {
                console.error(error);
                setError('Возможно, курса не существует или вы на него не записаны');
            } finally {
                setLoading(false);
            }
        };

        fetchLessonData();
    }, [id, lesson_id, token]);
    
    return (
        <>
            {error ? (
                <p>{error}</p>
            ) : (
                <TaskEditor course_name={courseData.course_name} loading={loading} tasks={tasks} task_id={task_id} />
            )}
        </>
    );
}

export default TaskPage;
