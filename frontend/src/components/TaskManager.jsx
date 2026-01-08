import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  primary: '#2563eb',
  bg: '#f8fafc',
  sidebar: '#ffffff',
  textMain: '#1e293b',
  textLight: '#64748b',
  success: '#22c55e',
  danger: '#ef4444'
};

export default function TaskManager() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const email = localStorage.getItem('userEmail');
  const token = localStorage.getItem('accessToken');

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tasks?page=${page}&limit=5&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.items || []);
      setTotalPages(response.data.lastPage || 1);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [token, page, search]);

  // --- HÀM UPLOAD FILE (BÀI 7) ---
  const handleUploadProof = async (taskId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId); // Gửi kèm taskId để Backend biết ảnh của task nào

    try {
      await axios.post(`${apiUrl}/upload/file`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Tải minh chứng thành công!");
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Chỉ được upload khi đã hoàn thành!");
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      // Đảm bảo gửi key là 'task' khớp với DTO và Entity
      await axios.post(`${apiUrl}/tasks`,
        { task: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask('');
      setPage(1);
      setSearch('');
      fetchTasks();
    } catch (error) { console.error("Lỗi thêm task:", error); }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await axios.patch(`${apiUrl}/tasks/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Cập nhật lại task cụ thể trong danh sách
      setTasks(tasks.map(t => t.id === id ? response.data : t));
    } catch (error) { console.error(error); }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Xóa công việc này?")) return;
    try {
      await axios.delete(`${apiUrl}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={wrapperStyle}>
      <div style={sidebarStyle}>
        <div style={logoArea}>
          <div style={logoIcon}>TM</div>
          <span style={logoText}>Task Manager</span>
        </div>
        <div style={menuItemActive}>📋 Danh sách Task</div>
        <div style={userProfile}>
          <div style={avatar}>{email?.charAt(0).toUpperCase()}</div>
          <div style={{ textAlign: 'left', overflow: 'hidden' }}>
            <div style={userName}>{email}</div>
            <div style={userRole}>Người dùng hệ thống</div>
          </div>
        </div>
        <button onClick={handleLogout} style={logoutBtn}>Đăng xuất</button>
      </div>

      <div style={mainContent}>
        <div style={header}>
          <h1 style={title}>Quản lý công việc</h1>
          <p style={subtitle}>Tổ chức và theo dõi các mục tiêu hàng ngày của bạn.</p>
        </div>

        <div style={{ ...inputCard, marginBottom: '10px' }}>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="🔍 Tìm kiếm theo tên công việc..."
            style={{ ...inputStyle, backgroundColor: '#fff' }}
          />
        </div>

        <div style={inputCard}>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Hôm nay bạn cần làm gì?..."
            style={inputStyle}
          />
          <button onClick={handleAddTask} style={addBtn}>+ Tạo mới</button>
        </div>

        <div style={listContainer}>
          {tasks.length > 0 ? (
            tasks.map(t => (
              <div key={t.id} style={{ ...taskCard, flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                    <div onClick={() => handleToggleTask(t.id)} style={t.status ? checkboxActive : checkbox}>
                      {t.status && '✓'}
                    </div>
                    <span style={t.status ? taskTextDone : taskText}>{t.task}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* NÚT UPLOAD ẢNH (BÀI 7) */}
                    {t.status && (
                      <label style={uploadIconBtn}>
                        📸
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleUploadProof(t.id, e.target.files[0])}
                        />
                      </label>
                    )}
                    <span style={t.status ? badgeSuccess : badgeWaiting}>
                      {t.status ? 'Hoàn thành' : 'Chờ xử lý'}
                    </span>
                    <button onClick={() => handleDeleteTask(t.id)} style={deleteBtn}>🗑️</button>
                  </div>
                </div>

                {/* HIỂN THỊ ẢNH MINH CHỨNG NẾU CÓ (BÀI 7) */}
                {t.imageProof && (
                  <div style={proofContainer}>
                    <img
                      src={`${apiUrl}/files/${t.imageProof}`}
                      alt="Minh chứng"
                      style={proofImage}
                    />
                    <span style={{ fontSize: '11px', color: COLORS.textLight }}>Minh chứng ảnh</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={emptyState}>Danh sách trống hoặc không tìm thấy kết quả.</div>
          )}
        </div>

        {/* PHÂN TRANG */}
        <div style={paginationContainer}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            style={page === 1 ? pageBtnDisabled : pageBtn}
          >
            ← Trước
          </button>
          <span style={{ fontWeight: '600', color: COLORS.textMain }}>Trang {page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            style={page >= totalPages ? pageBtnDisabled : pageBtn}
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  );
}

// --- STYLE BỔ SUNG ---
const uploadIconBtn = { cursor: 'pointer', fontSize: '18px', padding: '5px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const proofContainer = { display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '37px' };
const proofImage = { width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' };

// --- CÁC STYLE CŨ GIỮ NGUYÊN ---
const paginationContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px' };
const pageBtn = { padding: '8px 20px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', color: COLORS.textMain };
const pageBtnDisabled = { ...pageBtn, opacity: 0.5, cursor: 'not-allowed' };
const wrapperStyle = { display: 'flex', width: '100vw', height: '100vh', backgroundColor: COLORS.bg, color: COLORS.textMain, fontFamily: "'Inter', sans-serif", overflow: 'hidden' };
const sidebarStyle = { width: '280px', backgroundColor: COLORS.sidebar, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '30px 20px', flexShrink: 0 };
const logoArea = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 10px' };
const logoIcon = { width: '35px', height: '35px', backgroundColor: COLORS.primary, borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' };
const logoText = { fontWeight: '800', fontSize: '20px', letterSpacing: '-0.5px' };
const menuItemActive = { padding: '12px 15px', backgroundColor: '#eff6ff', color: COLORS.primary, borderRadius: '10px', fontWeight: '600', marginBottom: '8px', cursor: 'pointer' };
const mainContent = { flex: 1, padding: '40px 60px', overflowY: 'auto' };
const header = { textAlign: 'left', marginBottom: '30px' };
const title = { fontSize: '28px', fontWeight: '800', margin: 0 };
const subtitle = { color: COLORS.textLight, marginTop: '5px' };
const inputCard = { display: 'flex', gap: '15px', marginBottom: '30px' };
const inputStyle = { flex: 1, padding: '15px 25px', borderRadius: '50px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const addBtn = { padding: '0 30px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s' };
const listContainer = { display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' };
const taskCard = { backgroundColor: 'white', padding: '18px 25px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', transition: 'transform 0.1s' };
const checkbox = { width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' };
const checkboxActive = { ...checkbox, backgroundColor: COLORS.success, borderColor: COLORS.success, color: 'white' };
const taskText = { fontSize: '16px', fontWeight: '500' };
const taskTextDone = { ...taskText, color: COLORS.textLight, textDecoration: 'line-through' };
const badgeWaiting = { padding: '4px 12px', borderRadius: '20px', backgroundColor: '#fef3c7', color: '#b45309', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' };
const badgeSuccess = { padding: '4px 12px', borderRadius: '20px', backgroundColor: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' };
const deleteBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.5, transition: 'opacity 0.2s' };
const userProfile = { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 10px', borderTop: '1px solid #f1f5f9' };
const avatar = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: COLORS.primary, flexShrink: 0 };
const userName = { fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const userRole = { fontSize: '12px', color: COLORS.textLight };
const logoutBtn = { width: '100%', padding: '10px', backgroundColor: '#fff', color: COLORS.danger, border: `1px solid ${COLORS.danger}`, borderRadius: '50px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', fontSize: '13px' };
const emptyState = { padding: '60px', textAlign: 'center', color: COLORS.textLight, backgroundColor: '#f1f5f9', borderRadius: '24px', border: '2px dashed #e2e8f0' };