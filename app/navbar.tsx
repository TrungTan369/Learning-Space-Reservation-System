'use client'
import Image from "next/image";
import { Bell, MessageCircle } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        const checkRole = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('/api/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.role === 'admin') {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error('Lỗi khi xác thực role:', err);
            }
        };

        checkRole();
    }, []);


    return (
        <nav className="sticky top-0 left-0 w-full bg-transparent backdrop-blur-md shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">

                <div className="flex items-center space-x-6">
                    <Image src="/images/logo.png" alt="BK Logo" width={32} height={32} />
                    <a
                        href="/"
                        className={`hover:underline  ${pathname === '/' ? 'font-semibold text-blue-600' : ''
                            }`}
                    >
                        Trang chủ
                    </a>
                    <a href="/calendar"
                        className={`hover:underline ${pathname === '/calendar' ? 'font-semibold text-blue-600' : ''
                            }`}>
                        Lịch của tôi
                    </a>
                    <a href="/rooms"
                        className={`hover:underline ${pathname === '/rooms' ? 'font-semibold text-blue-600' : ''
                            }`}>
                        Xem phòng
                    </a>
                    <a href="/forum"
                        className={`hover:underline ${pathname === '/forum' ? 'font-semibold text-blue-600' : ''
                            }`}>
                        Thông báo chung
                    </a>
                    {isAdmin && (
                        <a href="/manager" className={`hover:underline ${pathname === '/manager' ? 'font-semibold text-blue-600' : ''}`}>
                            Quản lí
                        </a>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <Bell className="hover:text-gray-200 cursor-pointer" />
                    <MessageCircle className="hover:text-gray-200 cursor-pointer" />
                    <div className="flex items-center space-x-1">
                        <a href="/my" title="My Profile">
                            <Image
                                src="/images/avatar.jpg"
                                alt="User Avatar"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
