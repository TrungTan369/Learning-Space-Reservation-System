'use client';
import { useState } from 'react';

export default function CheckinPage() {
    const [roomName, setRoomName] = useState('');
    const [bookingInfo, setBookingInfo] = useState<any>(null);
    const [qrData, setQrData] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkinLoading, setCheckinLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        setMessage('');
        setQrData('');
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return alert('Bạn chưa đăng nhập');
        }

        const res = await fetch('/api/manager/checkin', {
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
        } else {
            setBookingInfo(null);
            setMessage(data.message || 'Không tìm thấy lịch đặt');
        }
        setLoading(false);
    };

    const handleCheckin = async () => {
        setCheckinLoading(true);
        setMessage('');
        const token = localStorage.getItem('token');
        if (!token) {
            setCheckinLoading(false);
            return alert('Bạn chưa đăng nhập');
        }

        const res = await fetch('/api/manager/checkin', {
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
            setMessage('✅ Checkin thành công! Quét mã QR để xác nhận.');
        } else {
            setMessage(data.message || 'Không thể checkin lúc này');
        }
        setCheckinLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 border border-blue-100">
                {/* Ô kiểm tra phòng đẹp hơn */}
                <div className="flex flex-col gap-4 w-full md:w-[340px] bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-2xl shadow p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-600 text-2xl">🏫</span>
                        <h2 className="text-xl font-bold text-blue-700">Kiểm tra lịch đặt phòng</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">
                        Nhập tên phòng (ví dụ: <span className="font-semibold text-blue-700">B1.801</span>) để kiểm tra lịch đặt và checkin.
                    </p>
                    <input
                        type="text"
                        placeholder="Nhập tên phòng..."
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-lg p-3 text-lg transition"
                        disabled={loading || checkinLoading}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60"
                        disabled={loading || !roomName}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                Đang kiểm tra...
                            </span>
                        ) : (
                            <>
                                <span className="mr-2">🔍</span>
                                Kiểm tra lịch đặt
                            </>
                        )}
                    </button>
                    {message && (
                        <div className={`text-base mt-2 ${bookingInfo ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </div>
                    )}
                </div>

                {/* Kết quả */}
                <div className="flex-1 flex flex-col gap-6">
                    {bookingInfo && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm mb-4">
                            <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                <span role="img" aria-label="info">📋</span> Thông tin đặt phòng
                            </h3>
                            <div className="space-y-2 text-gray-700 text-base">
                                <div><strong>Phòng:</strong> {bookingInfo.roomName}</div>
                                <div><strong>Người đặt:</strong> {bookingInfo.fullname}</div>
                                <div><strong>Thời gian:</strong> {bookingInfo.date}, {bookingInfo.startTime} - {bookingInfo.endTime}</div>
                            </div>
                            <button
                                onClick={handleCheckin}
                                className="mt-5 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
                                disabled={checkinLoading}
                            >
                                {checkinLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                        Đang checkin...
                                    </span>
                                ) : (
                                    'Checkin'
                                )}
                            </button>
                        </div>
                    )}

                    {/* QR Code */}
                    {qrData && (
                        <div className="bg-white border border-green-200 rounded-xl p-6 shadow flex flex-col items-center">
                            <h4 className="text-lg font-semibold text-green-700 mb-3">Quét mã QR xác nhận</h4>
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
