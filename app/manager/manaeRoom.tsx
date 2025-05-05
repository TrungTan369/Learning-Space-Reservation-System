'use client'
import { useEffect, useState } from "react";

type RoomStat = {
    roomName: string;
    totalBookings: number;
    totalCheckins: number;
    checkinRate: number; // %
    noCheckinRate: number; // %
};

export default function ManageRoom() {
    const [stats, setStats] = useState<RoomStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const res = await fetch("/api/manager/roomstats");
            const data = await res.json();
            setStats(data.stats || []);
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Thống kê đặt phòng</h1>
            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Phòng</th>
                            <th className="p-2 border">Số lượt đặt</th>
                            <th className="p-2 border">Số lượt checkin</th>
                            <th className="p-2 border">Tỉ lệ checkin (%)</th>
                            <th className="p-2 border">Tỉ lệ không checkin (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((r) => (
                            <tr key={r.roomName}>
                                <td className="p-2 border">{r.roomName}</td>
                                <td className="p-2 border">{r.totalBookings}</td>
                                <td className="p-2 border">{r.totalCheckins}</td>
                                <td className="p-2 border">{r.checkinRate.toFixed(1)}</td>
                                <td className="p-2 border">{r.noCheckinRate.toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
