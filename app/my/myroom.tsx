'use client';
import { useState, useEffect } from 'react';
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

// Map chat luong values to display text
const chatLuongMap: Record<string, string> = {
    '1': 'Tiêu chuẩn',
    '2': 'Tốt',
    '3': 'Cao cấp',
};

export default function MyRoom() {
    const [bookings, setBookings] = useState<BookingWithRoomDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    // Update current time every minute
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

                // Sort bookings by date (ascending) and then by start time (ascending)
                const sortedBookings = [...data].sort((a, b) => {
                    // First compare dates (DD/MM/YYYY format)
                    const [aDay, aMonth, aYear] = a.date.split('/').map(Number);
                    const [bDay, bMonth, bYear] = b.date.split('/').map(Number);

                    const dateA = new Date(aYear, aMonth - 1, aDay);
                    const dateB = new Date(bYear, bMonth - 1, bDay);

                    const dateCompare = dateA.getTime() - dateB.getTime();

                    if (dateCompare !== 0) return dateCompare;

                    // If same date, compare by start time
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

    // Format time from hours to readable format (e.g., 07:00)
    const formatTime = (hours: number) => {
        return `${hours.toString().padStart(2, '0')}:00`;
    };

    // Format date from "DD/MM/YYYY" to more readable format
    const formatDate = (date: string) => {
        // Check if date is already in DD/MM/YYYY format
        if (date.includes('/')) {
            const [day, month, year] = date.split('/');
            const dateObj = new Date(`${year}-${month}-${day}`);
            return dateObj.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
        }
        return date;
    };

    // Check if a booking is within the checkin window (30 mins before start until end time)
    const isCheckinAvailable = (booking: BookingWithRoomDetails) => {
        const now = currentTime;
        const [day, month, year] = booking.date.split('/').map(Number);
        const bookingDate = new Date(year, month - 1, day);

        // If booking date is in the future, not available yet
        if (bookingDate > now) return false;

        // If booking date is in the past, not available anymore
        if (bookingDate.getDate() !== now.getDate() ||
            bookingDate.getMonth() !== now.getMonth() ||
            bookingDate.getFullYear() !== now.getFullYear()) {
            return false;
        }

        // Convert current time to minutes
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        // Available 30 minutes before start time until end time
        return nowMinutes >= (booking.startTime - 30) && nowMinutes <= booking.endTime;
    };

    // Get the booking status
    const getBookingStatus = (booking: BookingWithRoomDetails) => {
        const now = currentTime;
        const [day, month, year] = booking.date.split('/').map(Number);
        const bookingDate = new Date(year, month - 1, day);
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        // If booking date is in the future
        if (bookingDate > now) {
            return {
                label: 'Sắp tới',
                color: 'text-blue-600 bg-blue-50 border-blue-200'
            };
        }

        // If booking date is today
        if (bookingDate.getDate() === now.getDate() &&
            bookingDate.getMonth() === now.getMonth() &&
            bookingDate.getFullYear() === now.getFullYear()) {

            // If current time is before the booking start time
            if (nowMinutes < booking.startTime) {
                // If within 30 minutes of start time
                if (nowMinutes >= booking.startTime - 30) {
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

            // If current time is within the booking time slot
            if (nowMinutes >= booking.startTime && nowMinutes <= booking.endTime) {
                return {
                    label: 'Đang diễn ra',
                    color: 'text-green-600 bg-green-50 border-green-200'
                };
            }

            // If current time is after the booking end time
            if (nowMinutes > booking.endTime) {
                return {
                    label: 'Đã kết thúc',
                    color: 'text-gray-600 bg-gray-50 border-gray-200'
                };
            }
        }

        // If booking date is in the past
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

            {!isLoading && !error && bookings.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
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
                                            <Link
                                                href="/manager/checkin"
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                Checkin
                                            </Link>
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
        </div>
    );
}