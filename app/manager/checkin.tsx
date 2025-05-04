'use client';
import { useState } from 'react';

export default function CheckinPage() {
    const [roomName, setRoomName] = useState('');
    const [bookingInfo, setBookingInfo] = useState<any>(null);
    const [qrData, setQrData] = useState('');

    const handleSearch = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Bạn chưa đăng nhập');

        const res = await fetch('/api/checkin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ roomName }),
        });

        const data = await res.json();

        if (res.ok) {
            setBookingInfo(data.booking);
            setQrData('');
        } else {
            alert(data.message || 'Không tìm thấy lịch đặt');
            setBookingInfo(null);
        }
    };

    const handleCheckin = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Bạn chưa đăng nhập');

        const res = await fetch('/api/checkin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ roomName, mode: 'checkin' }),
        });

        const data = await res.json();

        if (res.ok && data.qrPayload) {
            setQrData(data.qrPayload);
        } else {
            alert(data.message || 'Không thể checkin lúc này');
        }
    };

    return (
        <div className="p-6">
            <div className="flex w-100 bg-gray-50 my-6 gap-6 p-6 rounded-xl shadow-sm border">
                <div className="flex flex-col gap-4 w-[300px]">
                    <input
                        type="text"
                        placeholder="Nhập tên phòng"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Kiểm tra
                    </button>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    {bookingInfo && (
                        <div className="bg-white border rounded-xl p-4 shadow-sm">
                            <h2 className="text-xl font-bold mb-2">Thông tin đặt phòng</h2>
                            <p><strong>Phòng:</strong> {bookingInfo.roomName}</p>
                            <p><strong>Người đặt:</strong> {bookingInfo.fullname}</p>
                            <p><strong>Thời gian:</strong> {bookingInfo.date}, {bookingInfo.startTime} - {bookingInfo.endTime}</p>

                            <button
                                onClick={handleCheckin}
                                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            >
                                Checkin
                            </button>
                        </div>
                    )}

                    {qrData && (
                        <div className="mt-4">
                            <h2 className="font-semibold mb-2">Quét mã QR:</h2>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`}
                                alt="QR Code"
                                className="border rounded p-2 bg-white"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
