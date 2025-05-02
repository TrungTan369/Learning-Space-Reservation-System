'use client'

import { useEffect, useState } from "react";
import { FilterState } from "./filter";
import { jwtDecode } from "jwt-decode";

type Room = {
    _id: string;
    name: string;
    coSo: string;
    sucChua: string;
    chatLuong: string;
};

type RoomsPageProps = {
    filters: FilterState;
};

const chatLuongMap: Record<string, string> = {
    "1": "Phòng chất lượng cao",
    "2": "Phòng tiêu chuẩn",
    "3": "Phòng thường",
};


export default function RoomsPage({ filters }: RoomsPageProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 9;
    const [role, setRole] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [newRoom, setNewRoom] = useState<Room>({
        _id: '',
        name: '',
        coSo: '',
        sucChua: '',
        chatLuong: '1',
    });
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setRole(decoded.role);
            } catch (err) {
                console.error('Token lỗi');
            }
        }
    }, []);
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const params = new URLSearchParams();
                if (filters.coSo.length > 0) params.append("coSo", filters.coSo.join(",")); // Join array into a string
                if (filters.chatLuong.length > 0) params.append("chatLuong", filters.chatLuong.join(",")); // Join array into a string
                if (filters.sucChua.length > 0) params.append("sucChua", filters.sucChua.join(",")); // Join array into a string
                params.append("page", page.toString());
                params.append("limit", limit.toString());

                const res = await fetch(`/api/rooms?${params.toString()}`);
                const data = await res.json();
                setRooms(data.rooms || []);
                setTotal(data.total || 0);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách phòng:", err);
            }
        };

        fetchRooms();
    }, [filters, page]);

    const maxPage = Math.ceil(total / limit);

    const handleDeleteRoom = async (roomId: string) => {
        const confirmDelete = confirm('Bạn có chắc chắn muốn xóa phòng này?');
        if (!confirmDelete) return;

        const res = await fetch(`/api/rooms/?id=${roomId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await res.json();
        if (res.ok) {
            alert('Đã xóa phòng');
            location.reload();
        } else {
            alert(data.message || 'Xóa thất bại');
        }
    };
    const handleAddRoom = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newRoom),
        });

        const data = await res.json();
        if (res.ok) {
            alert('Đã thêm phòng');
            setShowAdd(false);
            location.reload();
        } else {
            alert(data.message || 'Thêm phòng thất bại');
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Danh sách phòng</h1>
                    {role === 'admin' && (
                        <button
                            onClick={() => setShowAdd(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                        >
                            ➕ Thêm phòng
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room._id}
                            className="rounded-2xl shadow-lg bg-white overflow-hidden hover:scale-105 transition-transform"
                        >
                            <img
                                src={`/images/room_type_${room.chatLuong}.jpg`}
                                alt={`Room ${room.name}`}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">Phòng {room.name}</h2>
                                <p className="text-gray-600 text-sm mb-3">
                                    Cơ sở {room.coSo} - Sức Chứa {room.sucChua} người <br />
                                    {chatLuongMap[room.chatLuong] || "Không rõ loại"}
                                </p>
                                <div className="flex items-center justify-between gap-2">
                                    <button className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm cursor-pointer">
                                        Đặt phòng
                                    </button>
                                    {role === 'admin' && (
                                        <button
                                            onClick={() => handleDeleteRoom(room._id)}
                                            className="bg-gray-500 text-white px-3 py-2 rounded-full text-sm hover:bg-gray-600 cursor-pointer"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        ← Trước
                    </button>
                    <span className="px-4 py-2 text-gray-700 font-medium">Trang {page} / {maxPage}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, maxPage))}
                        disabled={page === maxPage}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Tiếp →
                    </button>
                </div>
            </div>
            {showAdd && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
                        <button
                            onClick={() => setShowAdd(false)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">➕ Thêm phòng mới</h2>
                        <input
                            placeholder="Tên phòng"
                            value={newRoom.name}
                            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                            className="w-full border rounded p-2 mb-3"
                        />
                        <input
                            placeholder="Cơ sở"
                            value={newRoom.coSo}
                            onChange={(e) => setNewRoom({ ...newRoom, coSo: e.target.value })}
                            className="w-full border rounded p-2 mb-3"
                        />
                        <input
                            placeholder="Sức chứa"
                            value={newRoom.sucChua}
                            onChange={(e) => setNewRoom({ ...newRoom, sucChua: e.target.value })}
                            className="w-full border rounded p-2 mb-3"
                        />

                        <select
                            aria-label="chatluong"
                            value={newRoom.chatLuong}
                            onChange={(e) => setNewRoom({ ...newRoom, chatLuong: e.target.value })}
                            className="w-full border rounded p-2 mb-4"
                        >
                            {Object.entries(chatLuongMap).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddRoom}
                            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                        >
                            Thêm phòng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}