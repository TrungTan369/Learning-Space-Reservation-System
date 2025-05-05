'use client';
import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface BookingWithRoomDetails {
    _id: string;
    roomId: string;
    roomName: string;
    coSo: string;
    chatLuong: string;
    sucChua: string;
    date: string;
    startTime: number;
    endTime: number;
}

const chatLuongMap: Record<string, string> = {
    '1': 'Tiêu chuẩn',
    '2': 'Tốt',
    '3': 'Cao cấp',
};

function CameraPopup({ onClose }: { onClose: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let stream: MediaStream;
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(s => {
                stream = s;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            });
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-4 shadow-lg relative w-[350px] flex flex-col items-center">
                <button
                    className="absolute top-3 right-3 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center text-2xl text-gray-700 hover:text-red-600 hover:bg-white z-10 shadow"
                    onClick={onClose}
                    aria-label="Đóng"
                    style={{ border: 'none' }}
                >
                    ×
                </button>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded"
                    style={{ minHeight: 240 }}
                />
                <div className="text-center text-blue-700 mt-4 font-semibold">
                    Quét QR trên máy admin để checkin
                </div>
            </div>
        </div>
    );
}

function ManageRoomPopup({ onClose, roomName }: { onClose: () => void; roomName: string }) {
    const [lights, setLights] = useState(Array(8).fill(false));
    const [acs, setAcs] = useState([false, false]);
    const [speaker, setSpeaker] = useState(50);

    const toggleLight = (idx: number) => {
        setLights(lights => lights.map((v, i) => i === idx ? !v : v));
    };
    const toggleAc = (idx: number) => {
        setAcs(acs => acs.map((v, i) => i === idx ? !v : v));
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl relative w-[370px] flex flex-col items-center animate-slideup">
                <button
                    className="absolute top-3 right-3 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center text-2xl text-gray-700 hover:text-red-600 hover:bg-white z-10 shadow"
                    onClick={onClose}
                    aria-label="Đóng"
                    style={{ border: 'none' }}
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-6 text-blue-700">Quản Lí {roomName}</h2>
                <div className="flex flex-col gap-6 w-full">
                    <div>
                        <div className="font-semibold mb-2 flex items-center gap-2 text-yellow-600 text-lg">
                            <span>💡</span> 8 Bóng đèn
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {lights.map((on, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => toggleLight(idx)}
                                    className={`rounded-full w-12 h-12 flex items-center justify-center text-2xl border transition
                                        ${on ? 'bg-yellow-300 border-yellow-500 shadow text-yellow-900' : 'bg-gray-100 border-gray-300 text-gray-400'}`}
                                    aria-label={`Bóng đèn ${idx + 1}`}
                                >
                                    💡
                                    <span className="absolute text-xs font-bold right-2 bottom-2">{idx + 1}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="font-semibold mb-2 flex items-center gap-2 text-blue-600 text-lg">
                            <span>❄️</span> 2 Máy lạnh
                        </div>
                        <div className="flex gap-4">
                            {acs.map((on, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => toggleAc(idx)}
                                    className={`rounded-full w-14 h-14 flex flex-col items-center justify-center text-2xl border transition
                                        ${on ? 'bg-blue-300 border-blue-500 shadow text-blue-900' : 'bg-gray-100 border-gray-300 text-gray-400'}`}
                                    aria-label={`Máy lạnh ${idx + 1}`}
                                >
                                    ❄️
                                    <span className="text-xs font-bold mt-1">AC{idx + 1}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="font-semibold mb-2 flex items-center gap-2 text-gray-700 text-lg">
                            <span>🔊</span> Loa (0-100)
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={speaker}
                                onChange={e => setSpeaker(Number(e.target.value))}
                                className="w-40 accent-blue-500"
                            />
                            <span className="font-bold text-blue-700">{speaker}</span>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .animate-slideup {
                    animation: slideup 0.4s cubic-bezier(.4,2,.6,1) both;
                }
                @keyframes slideup {
                    0% { transform: translateY(60px) scale(0.95); opacity: 0; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default function MyRoom() {
    const [bookings, setBookings] = useState<BookingWithRoomDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [showCamera, setShowCamera] = useState(false);
    const [showManage, setShowManage] = useState(false);

    const checkedInRoom: BookingWithRoomDetails = {
        _id: 'hardcoded-checkedin',
        roomId: 'hardcoded-room',
        roomName: 'H1.101',
        coSo: '1',
        chatLuong: '3', // Cao cấp
        sucChua: '40',
        date: new Date().toLocaleDateString('vi-VN').split('/').map((v, i, arr) => arr.length === 3 ? v.padStart(2, '0') : v).join('/'),
        startTime: 8,
        endTime: 10,
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchMyRooms = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Bạn chưa đăng nhập');
                    setIsLoading(false);
                    return;
                }

                const res = await fetch('/api/profile/myroom', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Không thể lấy danh sách phòng đã đặt');
                }

                const data = await res.json();

                const sortedBookings = [...data].sort((a, b) => {
                    const [aDay, aMonth, aYear] = a.date.split('/').map(Number);
                    const [bDay, bMonth, bYear] = b.date.split('/').map(Number);

                    const dateA = new Date(aYear, aMonth - 1, aDay);
                    const dateB = new Date(bYear, bMonth - 1, bDay);

                    const dateCompare = dateA.getTime() - dateB.getTime();
                    if (dateCompare !== 0) return dateCompare;
                    return a.startTime - b.startTime;
                });

                setBookings(sortedBookings);
            } catch (err: any) {
                console.error('Lỗi khi lấy danh sách phòng đã đặt:', err);
                setError(err.message || 'Đã xảy ra lỗi');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyRooms();
    }, []);

    const formatTime = (hours: number) => {
        return `${hours.toString().padStart(2, '0')}:00`;
    };

    const formatDate = (date: string) => {
        if (date.includes('/')) {
            const [day, month, year] = date.split('/');
            const dateObj = new Date(`${year}-${month}-${day}`);
            return dateObj.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
        }
        return date;
    };

    const isCheckinAvailable = (booking: BookingWithRoomDetails) => {
        const now = currentTime;
        const [day, month, year] = booking.date.split('/').map(Number);
        const bookingDate = new Date(year, month - 1, day);

        if (
            bookingDate.getDate() !== now.getDate() ||
            bookingDate.getMonth() !== now.getMonth() ||
            bookingDate.getFullYear() !== now.getFullYear()
        ) {
            return false;
        }

        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = booking.startTime * 60;
        const endMinutes = booking.endTime * 60;

        return nowMinutes >= (startMinutes - 110) && nowMinutes <= endMinutes;
    };

    const getBookingStatus = (booking: BookingWithRoomDetails) => {
        const now = currentTime;
        const [day, month, year] = booking.date.split('/').map(Number);
        const bookingDate = new Date(year, month - 1, day);
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = booking.startTime * 60;
        const endMinutes = booking.endTime * 60;

        if (bookingDate > now) {
            return {
                label: 'Sắp tới',
                color: 'text-blue-600 bg-blue-50 border-blue-200'
            };
        }

        if (
            bookingDate.getDate() === now.getDate() &&
            bookingDate.getMonth() === now.getMonth() &&
            bookingDate.getFullYear() === now.getFullYear()
        ) {
            if (nowMinutes < startMinutes) {
                if (nowMinutes >= startMinutes - 110) {
                    return {
                        label: 'Checkin khả dụng',
                        color: 'text-green-600 bg-green-50 border-green-200'
                    };
                } else {
                    return {
                        label: 'Hôm nay',
                        color: 'text-blue-600 bg-blue-50 border-blue-200'
                    };
                }
            }

            if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
                return {
                    label: 'Đang diễn ra',
                    color: 'text-green-600 bg-green-50 border-green-200'
                };
            }

            if (nowMinutes > endMinutes) {
                return {
                    label: 'Đã kết thúc',
                    color: 'text-gray-600 bg-gray-50 border-gray-200'
                };
            }
        }

        return {
            label: 'Đã qua',
            color: 'text-gray-600 bg-gray-50 border-gray-200'
        };
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Phòng Của Tôi</h1>
                <p className="text-gray-600 mt-2">Danh sách phòng bạn đã đặt</p>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {!isLoading && !error && bookings.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-6 rounded-lg text-center">
                    <p className="font-medium">Bạn chưa đặt phòng nào</p>
                    <p className="mt-2">Hãy truy cập trang danh sách phòng để đặt phòng</p>
                    <a
                        href="/rooms"
                        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Đặt phòng ngay
                    </a>
                </div>
            )}

            {!isLoading && !error && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                            <div className="absolute top-4 right-4 flex gap-2 z-20">
                                <span className="px-4 py-2 rounded-full text-sm font-semibold border border-green-600 bg-white/90 text-green-700 shadow">
                                    Đã checkin
                                </span>
                                <button
                                    onClick={() => setShowManage(true)}
                                    className="px-4 py-2 rounded-full text-sm font-semibold border border-blue-600 bg-white/90 text-blue-700 shadow hover:bg-blue-50 transition"
                                >
                                    Điều khiển phòng
                                </button>
                            </div>
                            <img
                                src={`/images/room_type_${checkedInRoom.chatLuong}.jpg`}
                                alt={`Phòng ${checkedInRoom.roomName}`}
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <h3 className="text-2xl font-bold text-white">Phòng {checkedInRoom.roomName}</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày đặt</p>
                                        <p className="font-medium">{formatDate(checkedInRoom.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Thời gian</p>
                                        <p className="font-medium">{formatTime(checkedInRoom.startTime)} - {formatTime(checkedInRoom.endTime)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Cơ sở</p>
                                        <p className="font-medium">{checkedInRoom.coSo}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Sức chứa</p>
                                        <p className="font-medium">{checkedInRoom.sucChua} người</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <BookOpen className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500">Chất lượng</p>
                                    <p className="font-medium">{chatLuongMap[checkedInRoom.chatLuong] || "Không rõ loại"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {bookings.map((booking, index) => {
                        const status = getBookingStatus(booking);
                        const checkinAvailable = isCheckinAvailable(booking);
                        return (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                                    <div className="absolute top-0 right-0 m-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <img
                                        src={`/images/room_type_${booking.chatLuong}.jpg`}
                                        alt={`Phòng ${booking.roomName}`}
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <h3 className="text-2xl font-bold text-white">Phòng {booking.roomName}</h3>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-start">
                                            <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày đặt</p>
                                                <p className="font-medium">{formatDate(booking.date)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Thời gian</p>
                                                <p className="font-medium">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Cơ sở</p>
                                                <p className="font-medium">{booking.coSo}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Sức chứa</p>
                                                <p className="font-medium">{booking.sucChua} người</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center">
                                        <BookOpen className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-500">Chất lượng</p>
                                            <p className="font-medium">{chatLuongMap[booking.chatLuong] || "Không rõ loại"}</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex justify-end">
                                        {checkinAvailable ? (
                                            <>
                                                <button
                                                    onClick={() => setShowCamera(true)}
                                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                                >
                                                    Checkin Ngay
                                                </button>
                                                {showCamera && (
                                                    <CameraPopup onClose={() => setShowCamera(false)} />
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <AlertCircle className="h-4 w-4 mr-1.5" />
                                                {status.label === 'Đã kết thúc' || status.label === 'Đã qua' ?
                                                    'Đã hết thời gian checkin' :
                                                    'Chưa đến thời gian checkin'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {showManage && (
                <ManageRoomPopup onClose={() => setShowManage(false)} roomName={checkedInRoom.roomName} />
            )}
        </div>
    );
}