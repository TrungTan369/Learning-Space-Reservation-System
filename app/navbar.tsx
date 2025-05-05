'use client'
import Image from "next/image";
import { Bell, MessageCircle } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from "next/navigation";
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);

    // Thông báo
    const [notiOpen, setNotiOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const notiRef = useRef<HTMLDivElement>(null);

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

    // Đóng popup khi click ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
                setNotiOpen(false);
            }
        }
        if (notiOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notiOpen]);

    // Lấy thông báo khi mở popup
    const handleBellClick = async () => {
        setNotiOpen(!notiOpen);
        if (!notiOpen) {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('/api/notification', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setNotifications(data);
                setHasUnread(data.some((n: any) => !n.read));
                // KHÔNG gọi API read-all ở đây!
            } catch { }
        }
    };

    // Khi đóng popup, đánh dấu đã đọc nếu có thông báo chưa đọc
    useEffect(() => {
        if (!notiOpen && notifications.length > 0 && hasUnread) {
            const token = localStorage.getItem('token');
            if (token) {
                fetch('/api/notification', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                }).then(() => setHasUnread(false));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notiOpen]);

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
                    <div className="relative">
                        <Bell
                            className="hover:text-gray-200 cursor-pointer"
                            onClick={handleBellClick}
                        />
                        {hasUnread && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                        {notiOpen && (
                            <div
                                ref={notiRef}
                                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50 max-h-96 overflow-y-auto"
                            >
                                <div className="p-4 border-b font-semibold text-blue-700">Thông báo</div>
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-gray-500 text-center">Không có thông báo nào</div>
                                ) : (
                                    notifications.map((n, idx) => (
                                        <div key={idx} className={`flex items-start gap-2 px-4 py-3 border-b last:border-b-0 ${!n.read ? 'bg-blue-50' : ''}`}>
                                            <span className="text-2xl">{n.icon || "🔔"}</span>
                                            <div>
                                                <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: n.content }} />
                                                <div className="text-xs text-gray-400 mt-1">{new Date(n.createAt).toLocaleString('vi-VN')}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
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