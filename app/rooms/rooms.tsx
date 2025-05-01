'use client'

import { useEffect, useState } from "react";
import { FilterState } from "./filter";
import { ParkingMeter } from "lucide-react";

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

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                    Danh sách phòng
                </h1>

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
                                <button className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm">
                                    Đặt phòng
                                </button>
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
        </div>
    );
}