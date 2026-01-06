import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  primary: '#2563eb', // Xanh nước biển Dashboard
  textMain: '#1e293b', // Màu chữ xanh đen đậm cực sang
  textLight: '#64748b', // Màu xám xanh cho placeholder
  bg: '#ffffff',
  inputBg: '#f8fafc'
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const endpoint = isLoginMode ? '/auth/signin' : '/auth/signup';
    try {
      const response = await axios.post(`http://localhost:3000${endpoint}`, { email, password });
      if (isLoginMode) {
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('userEmail', email);
        navigate('/tasks');
      } else {
        alert('Thành công! Hãy đăng nhập.');
        setIsLoginMode(true);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert('Thất bại! Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div style={wrapperStyle}>
      {/* Nhúng Style để xử lý Placeholder mượt mà */}
      <style>
        {`
          input::placeholder {
            color: ${COLORS.textLight};
            opacity: 0.7;
          }
          input:focus {
            border-color: ${COLORS.primary} !important;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
          }
        `}
      </style>

      {/* BÊN TRÁI: HÌNH ẢNH THƯƠNG HIỆU */}
      <div style={leftSideStyle}>
        <div style={overlayTextStyle}>
          <h1 style={{ fontSize: '70px', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>TASK MANAGER</h1>
          <h1 style={{ fontSize: '60px', fontWeight: '900', letterSpacing: '-2px', margin: 0, color: COLORS.primary }}>PRO</h1>
          <div style={taglineStyle}>Bạn thật sự tin vào việc bạn có thể quản lý thời gian sao?</div>
        </div>
        <img 
          src="https://static.vecteezy.com/system/resources/thumbnails/074/173/138/small/the-majority-are-against-it-in-the-poll-political-analysis-market-research-opinion-surveys-referendums-social-studies-photo.jpg" 
          alt="Brand image" 
          style={imageStyle} 
        />
      </div>

      {/* BÊN PHẢI: FORM ĐĂNG NHẬP */}
      <div style={rightSideStyle}>
        <div style={formWrapperStyle}>
          {/* Logo hình tròn như bản vẽ tay */}
          <div style={logoCircleStyle}>
            <div style={{ width: '25px', height: '25px', backgroundColor: COLORS.primary, borderRadius: '6px', transform: 'rotate(45deg)' }}></div>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: '800', color: COLORS.textMain, marginBottom: '8px' }}>
            {isLoginMode ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
          </h2>
          <p style={{ color: COLORS.textLight, marginBottom: '40px', fontSize: '14px' }}>Vui lòng nhập thông tin của bạn</p>

          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={labelStyle}>Tài khoản email</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={inputStyle} 
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '30px' }}>
            <label style={labelStyle}>Mật khẩu</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={inputStyle} 
            />
          </div>

          <button onClick={handleSubmit} style={loginButtonStyle}>
            {isLoginMode ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ HỆ THỐNG'}
          </button>

          <p onClick={() => setIsLoginMode(!isLoginMode)} style={toggleTextStyle}>
            {isLoginMode ? 'Chưa có tài khoản? Đăng ký tài khoản' : 'Đã có tài khoản? Đăng nhập ngay'}
          </p>
        </div>
      </div>
    </div>
  );
}

// --- HỆ THỐNG STYLE HIỆN ĐẠI ---

const wrapperStyle = {
  display: 'flex',
  width: '100vw',
  height: '100vh',
  position: 'fixed', // Ghim chặt vào khung trình duyệt
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  backgroundColor: '#ffffff',
  zIndex: 9999 // Đảm bảo luôn nằm trên cùng
};
const leftSideStyle = {
  flex: '1.2', 
  height: '100%',
  position: 'relative',
  overflow: 'hidden', // Cắt bỏ phần thừa của ảnh
  backgroundColor: '#000', // Nền đen hỗ trợ nếu ảnh chưa load xong
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover', // Đây là chìa khóa để ảnh luôn lấp đầy 50% màn hình
};


const overlayTextStyle = {
  position: 'absolute',
  zIndex: 10,
  top: '200px',
  left: '100px',
  color: 'white',
  textAlign: 'left',
  textShadow: '0 0px 20px rgba(0, 0, 0, 0.5)' 
};
const taglineStyle = {
  marginTop: '15px',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  opacity: '0.8'
};

const rightSideStyle = {
  flex: 1, // Chia đúng 50% màn hình bên phải
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px',
  backgroundColor: '#ffffff',
};

const formWrapperStyle = {
  width: '100%',
  maxWidth: '420px',
  textAlign: 'center'
};

const logoCircleStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  border: `2px solid ${COLORS.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 25px',
  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.15)'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '13px',
  fontWeight: '600',
  color: COLORS.textMain
};

const inputStyle = {
  width: '100%',
  padding: '14px 20px',
  borderRadius: '12px', // Bo tròn vừa phải theo phong cách hiện đại
  border: `1.5px solid #e2e8f0`,
  fontSize: '15px',
  color: COLORS.textMain, // Chữ bạn gõ vào sẽ có màu xanh đen đậm cực đẹp
  backgroundColor: COLORS.inputBg,
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box'
};

const loginButtonStyle = {
  width: '100%',
  padding: '16px',
  backgroundColor: COLORS.primary,
  color: '#ffffff',
  border: 'none',
  borderRadius: '100px', // Nút bo tròn Pill như bạn yêu cầu
  fontWeight: '700',
  fontSize: '15px',
  cursor: 'pointer',
  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
  transition: 'transform 0.2s ease'
};

const toggleTextStyle = {
  marginTop: '25px',
  fontSize: '14px',
  color: COLORS.primary,
  cursor: 'pointer',
  fontWeight: '600',
  textDecoration: 'none'
};