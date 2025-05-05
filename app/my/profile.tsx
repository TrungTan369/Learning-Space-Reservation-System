'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Profile() {
    const [userData, setUserData] = useState({
        fullname: '',
        username: '',
        email: '',
        birth: '',
        phone: '',
        role: ''
    });
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({ email: '', birth: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    // Initial data loading with API fallback
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                
                if (!token || !userId) return;
                
                // Always load from API
                const res = await fetch('/api/profile/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setUserData(data);
                    setForm({
                        email: data.email || '',
                        birth: data.birth || '',
                        phone: data.phone || ''
                    });
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        };
        
        loadUserData();
    }, []);

    // Format birth date
    const getFormattedBirth = () => {
        if (!userData.birth) return 'Chưa cập nhật';
        try {
            const date = new Date(userData.birth);
            if (isNaN(date.getTime())) {
                if (userData.birth.includes('/')) {
                    const [day, month, year] = userData.birth.split('/');
                    return `${day}/${month}/${year}`;
                }
                return userData.birth;
            }
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return userData.birth || 'Chưa cập nhật';
        }
    };

    // Map role to Vietnamese
    const roleDisplay = {
        'admin': 'Quản trị viên',
        'user': 'Người dùng',
        'techie': 'Kỹ thuật viên'
    }[userData.role.toLowerCase()] || userData.role;

    // Better condition for auto-edit mode
    useEffect(() => {
        // Only auto-enable edit if this is the first login AND fields are missing
        const isFirstLogin = localStorage.getItem('firstLogin') === 'true';
        if (isFirstLogin && (!userData.email || !userData.birth || !userData.phone)) {
            setEdit(true);
            // Mark that we've shown the edit form once
            localStorage.setItem('firstLogin', 'false');
        }
    }, [userData]);

    // Modified save function - don't use localStorage for profile data
    const handleSave = async () => {
        setLoading(true);
        setMsg('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                setUserData(prev => ({
                    ...prev,
                    email: form.email,
                    birth: form.birth,
                    phone: form.phone
                }));
                setEdit(false);
                setMsg('Cập nhật thành công!');
            } else {
                setMsg(data.message || 'Cập nhật thất bại');
            }
        } catch {
            setMsg('Có lỗi xảy ra!');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-8 border-b pb-6">
                <div className="bg-blue-100 p-4 rounded-full mr-6">
                    <Image
                        src="/images/avatar.jpg"
                        alt="User Avatar"
                        width={80}
                        height={80}
                        className="rounded-full"
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{userData.fullname || 'Chưa cập nhật'}</h2>
                    <p className="text-blue-600 font-medium">{roleDisplay}</p>
                </div>
            </div>
            {msg && (
                <div className={`mb-4 px-4 py-2 rounded ${msg.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {msg}
                </div>
            )}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Tên đăng nhập</label>
                        <div className="text-gray-900 font-medium">{userData.username || 'Chưa cập nhật'}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        {edit ? (
                            <input
                                type="email"
                                className="border rounded px-2 py-1 w-full"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="Nhập email"
                            />
                        ) : (
                            <div className="text-gray-900 font-medium break-words">{userData.email || 'Chưa cập nhật'}</div>
                        )}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Ngày sinh</label>
                        {edit ? (
                            <input
                                type="date"
                                className="border rounded px-2 py-1 w-full"
                                value={form.birth}
                                onChange={e => setForm(f => ({ ...f, birth: e.target.value }))}
                                placeholder="Chọn ngày sinh"
                            />
                        ) : (
                            <div className="text-gray-900 font-medium">{getFormattedBirth()}</div>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
                        {edit ? (
                            <input
                                type="tel"
                                className="border rounded px-2 py-1 w-full"
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="Nhập số điện thoại"
                            />
                        ) : (
                            <div className="text-gray-900 font-medium">{userData.phone || 'Chưa cập nhật'}</div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-8 flex gap-4">
                {edit ? (
                    <>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                        <button
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                            onClick={() => {
                                setEdit(false);
                                setForm({
                                    email: userData.email,
                                    birth: userData.birth,
                                    phone: userData.phone
                                });
                                setMsg('');
                            }}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                    </>
                ) : (
                    <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                        onClick={() => setEdit(true)}
                    >
                        Sửa thông tin
                    </button>
                )}
            </div>
        </div>
    );
}
