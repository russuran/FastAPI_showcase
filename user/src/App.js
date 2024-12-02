import React from 'react';
import './styles/index.css';
import './styles/utils.css';
import './styles/animations.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Login from './components/components/LoginForm';
import Home from './components/components/Home';
import HomePage from './components/components/HomePage';
import CoursePage from './components/components/CoursePage';
import ProtectedRoute from './components/components/ProtectedRoute';
import NoMatch from './components/components/noMatch';
import TaskPage from './components/components/TaskPage';
import ProfilePage from './components/components/ProfilePage';


export default function App() {
  return (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute component={Home} />}>
                <Route index element={<ProtectedRoute component={HomePage} />} />
                <Route path="/course/:id" element={<ProtectedRoute component={CoursePage} />} />
                <Route path="/course/:id/lesson/:lesson_id/task/:task_id" element={<ProtectedRoute component={TaskPage} />} />
                <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />       
            </Route>
            <Route path="*" element={<NoMatch />} />
        </Routes>
    </Router>
  );
}
