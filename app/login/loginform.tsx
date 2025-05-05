'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data._id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('fullname', data.fullname);
            router.push('/');
        } else {
            setError(data.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-12 w-full max-w-lg bg-white/70 backdrop-blur-md">
            <Image
                src="/images/logo.png"
                alt="BK Logo"
                width={80}
                height={80}
                className="mx-auto mb-6"
            />
            <h2 className="text-xl font-semibold mb-4 text-blue-800 text-center">
                Đăng nhập hệ thống
            </h2>

            {/* Đăng nhập tài khoản thường (admin, techie, user) */}
            <form onSubmit={handleLogin} className="mb-6">
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    className="w-full mb-4 p-2 border rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full mb-4 p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 cursor-pointer"
                >
                    Đăng nhập
                </button>
                {error && <div className="text-red-600 mt-2">{error}</div>}
            </form>

            <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-2 text-gray-500 text-sm">hoặc</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Đăng nhập sinh viên HCMUT */}
            <button
                onClick={() =>
                    window.location.href =
                    "https://sso.hcmut.edu.vn/cas/login?service=https%3A%2F%2Flms.hcmut.edu.vn%2Flogin%2Findex.php%3FauthCAS%3DCAS"
                }
                className="w-full border border-[#0083b0] text-sky-700 px-4 py-2 rounded hover:bg-sky-100 transition-colors duration-200 flex items-center justify-center gap-2"
            >
                <img src="/images/member.jpg" alt="member Icon" className="w-8 h-8" />
                Đăng nhập với tư cách sinh viên HCMUT
            </button>
        </div>
    );
}
