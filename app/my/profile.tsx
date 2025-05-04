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

    useEffect(() => {
        // Retrieve user data from localStorage
        const fullname = localStorage.getItem('fullname') || '';
        const username = localStorage.getItem('username') || '';
        const email = localStorage.getItem('email') || '';
        const birth = localStorage.getItem('birth') || '';
        const phone = localStorage.getItem('phone') || '';
        const role = localStorage.getItem('userRole') || '';

        setUserData({
            fullname,
            username,
            email,
            birth,
            phone,
            role
        });
    }, []);

    // Properly format birth date with error handling
    const getFormattedBirth = () => {
        if (!userData.birth) return 'Chưa cập nhật';
        
        try {
            // Try to parse the date - handles ISO format and timestamps
            const date = new Date(userData.birth);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                // If not valid, try alternative formats
                if (userData.birth.includes('/')) {
                    // Handle DD/MM/YYYY format
                    const [day, month, year] = userData.birth.split('/');
                    return `${day}/${month}/${year}`;
                }
                // Return original if we can't parse it
                return userData.birth;
            }
            
            // Format as Vietnamese date
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return userData.birth || 'Chưa cập nhật';
        }
    };
    
    // Map role to Vietnamese
    const roleDisplay = {
        'admin': 'Quản trị viên',
        'user': 'Người dùng',
        'techie': 'Kỹ thuật viên'
    }[userData.role.toLowerCase()] || userData.role;

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
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Tên đăng nhập</label>
                        <div className="text-gray-900 font-medium">{userData.username || 'Chưa cập nhật'}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <div className="text-gray-900 font-medium break-words">{userData.email || 'Chưa cập nhật'}</div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Ngày sinh</label>
                        <div className="text-gray-900 font-medium">{getFormattedBirth()}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
                        <div className="text-gray-900 font-medium">{userData.phone || 'Chưa cập nhật'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
