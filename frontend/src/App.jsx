import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// IMPORT các Component từ thư mục components
import Login from './components/Login';
import TaskManager from './components/TaskManager'; 

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* 1. Trang Đăng nhập/Đăng ký */}
          <Route path="/login" element={<Login />} />
          
          {/* 2. Trang Quản lý Task */}
          <Route path="/tasks" element={<TaskManager />} />
          
          {/* 3. Tự động điều hướng về /login nếu đường dẫn không tồn tại */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}