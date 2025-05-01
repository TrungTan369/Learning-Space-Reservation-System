'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';



export default function LoginForm() {
    const router = useRouter();
    const [selected, setSelected] = useState<'User' | 'Admin' | 'Techie' | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (type: 'User' | 'Admin' | 'Techie') => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role: type }),
        });

        const data = await res.json();
        if (res.ok) {
            router.push('/');
        } else {
            alert(data.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-12 w-full max-w-lg bg-white/70 backdrop-blur-md rounded-xl shadow-lg">
            <Image
                src="/images/logo.png"
                alt="BK Logo"
                width={80}
                height={80}
                className="mx-auto mb-6"
            />
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
                Log in using your account on:
            </h2>

            <button
                onClick={() => setSelected('User')}
                className="w-full border border-[#0083b0] text-sky-700 px-4 py-2 mb-2 rounded hover:bg-sky-100 transition-colors duration-200 cursor-pointer"
            >
                <img src="/images/member.jpg" alt="member Icon" className="w-8 h-8 absolute object-contain left-10.6" />
                <span className="mr-2"></span>
                Tài khoản HCMUT
            </button>

            <button
                onClick={() => setSelected('Admin')}
                className="w-full border border-[#0083b0] text-sky-700 px-4 py-2 mb-2 rounded hover:bg-sky-100 transition-colors duration-200 items-center cursor-pointer"
            >
                <img src="/images/admin.jpg" alt="Admin Icon" className="w-8 h-8 absolute object-contain left-10.6" />
                Admin
            </button>

            <button
                onClick={() => setSelected('Techie')}
                className="w-full border border-[#0083b0] text-sky-700 px-4 py-2 rounded hover:bg-sky-100 transition-colors duration-200 items-center cursor-pointer"
            >
                <img src="/images/techie.png" alt="Techie Icon" className="w-9 h-9 absolute object-contain left-10.6"></img>
                Techie
            </button >

            <div className="text-sm text-gray-500 mt-6 flex justify-center items-center gap-2">
                <span>English (en)</span>
            </div>

            {selected && (
                <div className="w-full max-w-sm text-left">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                        Đăng nhập với tài khoản {selected === 'User' ? 'HCMUT' : selected}
                    </h3>
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className="w-103 mb-4 p-2 border rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-103 mb-4 p-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-30 mx-35 bg-sky-600 text-white py-2 rounded hover:bg-sky-700 cursor-pointer"
                        onClick={() => handleLogin(selected)}
                    >
                        Đăng nhập
                    </button>
                </div>
            )}
        </div >
    );
}
