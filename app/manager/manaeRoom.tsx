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
    const [monthBookings, setMonthBookings] = useState(0);
    const [monthCheckins, setMonthCheckins] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const res = await fetch("/api/manager/manageRoom");
            const data = await res.json();
            setStats(data.stats || []);
            setMonthBookings(data.monthBookings || 0);
            setMonthCheckins(data.monthCheckins || 0);
            setLoading(false);
        };
        fetchStats();
    }, []);

    // Tính tỉ lệ checkin toàn hệ thống tháng này
    const monthCheckinRate = monthBookings > 0 ? (monthCheckins / monthBookings) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Thống kê đặt phòng</h1>
            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <>
                    <div className="mb-6 flex flex-wrap gap-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex-1 min-w-[220px]">
                            <div className="text-gray-500 text-sm">Tổng lượt đặt phòng tháng này</div>
                            <div className="text-2xl font-bold text-blue-700">{monthBookings}</div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex-1 min-w-[220px]">
                            <div className="text-gray-500 text-sm">Tỉ lệ checkin tháng này</div>
                            <div className="text-2xl font-bold text-green-700">{monthCheckinRate.toFixed(1)}%</div>
                        </div>
                    </div>
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
                </>
            )}
        </div>
    );
}
