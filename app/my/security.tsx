'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Key, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

export default function Security() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [lastLogin, setLastLogin] = useState('Chưa có thông tin');

    useEffect(() => {
        // Simulated last login time - in a real app, fetch this from API
        setLastLogin('04/05/2025 15:30:22');
        
        // Reset message after 5 seconds
        if (message.text) {
            const timer = setTimeout(() => setMessage({ text: '', type: '' }), 5000);
            return () => clearTimeout(timer);
        }
    }, [message.text]);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset message
        setMessage({ text: '', type: '' });
        
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ text: 'Vui lòng điền đầy đủ thông tin', type: 'error' });
            return;
        }
        
        
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            
            if (!token || !username) {
                setMessage({ text: 'Bạn cần đăng nhập lại', type: 'error' });
                setTimeout(() => router.push('/login'), 2000);
                return;
            }
            
            // Make an actual API call instead of simulating
            const res = await fetch('/api/me/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username,
                    currentPassword,
                    newPassword
                })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setMessage({ text: 'Đổi mật khẩu thành công', type: 'success' });
                // Clear form
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // Show the specific error from the API
                setMessage({ text: data.message || 'Đổi mật khẩu thất bại', type: 'error' });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage({ text: 'Đã xảy ra lỗi, vui lòng thử lại sau', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                    <div className="flex items-center">
                        <div className="bg-white/10 p-3 rounded-full mr-4">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Bảo mật tài khoản</h2>
                            <p className="text-blue-100">Quản lý thông tin bảo mật và mật khẩu</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    {/* Security Overview */}
                    <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <Info className="h-5 w-5 mr-2 text-blue-600" />
                            Tổng quan bảo mật
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                    <Key className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Đăng nhập gần nhất</p>
                                    <p className="text-gray-800">{lastLogin}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                    <CheckCircle className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Trạng thái tài khoản</p>
                                    <p className="text-green-600 font-medium">Hoạt động - Đã xác minh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Change Password Form */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Key className="h-5 w-5 mr-2 text-blue-600" />
                            Đổi mật khẩu
                        </h3>
                        
                        <form onSubmit={handleChangePassword} className="space-y-5">
                            {/* Current password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="current-password">
                                    Mật khẩu hiện tại
                                </label>
                                <div className="relative">
                                    <input
                                        id="current-password"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full p-2.5 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button 
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            
                            {/* New password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="new-password">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-2.5 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button 
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                
                                
                            </div>
                            
                            {/* Confirm password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm-password">
                                    Xác nhận mật khẩu mới
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full p-2.5 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button 
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                
                                {/* Password match indicator */}
                                {confirmPassword && (
                                    <div className="mt-1.5 flex items-center text-sm">
                                        {newPassword === confirmPassword ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" /> 
                                                <span className="text-green-600">Mật khẩu khớp</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="h-4 w-4 text-red-500 mr-1.5" /> 
                                                <span className="text-red-600">Mật khẩu không khớp</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {/* Status message */}
                            {message.text && (
                                <div className={`p-3 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'} flex items-start`}>
                                    {message.type === 'error' ? (
                                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                                    ) : (
                                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                    )}
                                    <span>{message.text}</span>
                                </div>
                            )}
                            
                            {/* Action buttons */}
                            <div className="flex justify-end pt-2">
                                <button
                                    type="button"
                                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium py-2 px-4 rounded-md mr-3 disabled:opacity-50"
                                    onClick={() => {
                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                        setMessage({ text: '', type: '' });
                                    }}
                                    disabled={isLoading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:opacity-50 flex items-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        'Cập nhật mật khẩu'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
