'use client';
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import lunar from 'lunar-calendar';

interface BookingData {
    roomName: string;
    date: string;
    startTime: number;
    endTime: number;
    coSo: string;
}

const Calendar = () => {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth()); // 0-11
    const [year, setYear] = useState(today.getFullYear());
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get days in month and first day of month
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fetch bookings on component mount and when month/year changes
    useEffect(() => {
        const fetchBookings = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Bạn chưa đăng nhập');
                    setIsLoading(false);
                    return;
                }
                
                const res = await fetch('/api/myroom', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!res.ok) {
                    throw new Error('Không thể lấy danh sách phòng đã đặt');
                }
                
                const data = await res.json();
                setBookings(data);
            } catch (err: any) {
                console.error('Lỗi khi lấy danh sách phòng đã đặt:', err);
                setError(err.message || 'Đã xảy ra lỗi');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchBookings();
    }, []);

    // Format time (e.g., 7:00)
    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    // Choose seasonal video background
    let choosevideo = "";
    let isLunarNewYearMonth = false;
    for (let d = 1; d <= daysInMonth; d++) {
        const ld = lunar.solarToLunar(year, month + 1, d);
        if (ld.lunarDay === 1 && ld.lunarMonth === 1) {
            isLunarNewYearMonth = true;
            break;
        }
    }

    if (isLunarNewYearMonth) {
        choosevideo = "/images/tet.mp4";
    } else if ([0, 1, 2].includes(month)) {
        choosevideo = "/images/spring.mp4";
    } else if ([3, 4, 5].includes(month)) {
        choosevideo = "/images/summer.mp4";
    } else if ([6, 7, 8].includes(month)) {
        choosevideo = "/images/autumn.mp4";
    } else {
        choosevideo = "/images/winter.mp4";
    }

    // Process bookings for the current month
    const bookingsForMonth = useMemo(() => {
        const bookingsByDate: Record<number, BookingData[]> = {};
        
        bookings.forEach(booking => {
            if (booking.date) {
                // Extract date parts (DD/MM/YYYY)
                const [day, monthStr, yearStr] = booking.date.split('/').map(Number);
                
                // Only include bookings for the current month/year
                if (monthStr === month + 1 && yearStr === year) {
                    if (!bookingsByDate[day]) {
                        bookingsByDate[day] = [];
                    }
                    bookingsByDate[day].push(booking);
                }
            }
        });
        
        return bookingsByDate;
    }, [bookings, month, year]);

    // Generate calendar days
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} />);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === today.getDate() && 
                        month === today.getMonth() && 
                        year === today.getFullYear();
        
        const lunarDay = lunar.solarToLunar(year, month + 1, d);
        let content = <span>{d}</span>;
        
        const isTet = lunarDay.lunarMonth === 1 && [1, 2, 3].includes(lunarDay.lunarDay);
        const hasBookings = bookingsForMonth[d] && bookingsForMonth[d].length > 0;
        
        if (isTet) {
            content = (
                <div className="flex flex-col items-center w-full h-full bg-red-400 p-2 rounded-2xl">
                    <strong>{d}</strong>
                    <img src="/images/baolixi.png" alt="bao lì xì" className='w-8 h-8' />
                    <span className="text-xs text-white font-semibold">Tết Nguyên Đán</span>
                </div>
            );
        } else if (hasBookings) {
            content = (
                <div className="flex flex-col items-center bg-yellow-100 p-2 rounded h-full">
                    <strong>{d}</strong>
                    <div className="overflow-y-auto max-h-20 w-full">
                        {bookingsForMonth[d].map((booking, idx) => (
                            <div key={idx} className="text-xs text-red-600 font-medium p-1 bg-white/60 rounded mt-1 truncate">
                                {formatTime(booking.startTime)}-{formatTime(booking.endTime)}<br/>
                                Phòng {booking.roomName}
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else if (isToday) {
            content = (
                <div className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full flex items-center justify-center h-8 w-8">
                    {d}
                </div>
            );
        }

        days.push(
            <div
                key={d}
                className={`min-h-[80px] border border-gray-200 rounded-lg p-1 ${
                    isToday && !hasBookings ? "bg-blue-50" : ""
                }`}
            >
                {content}
            </div>
        );
    }

    return (
        <>
            <video
                className="fixed inset-0 w-full h-full object-cover -z-10 opacity-20"
                src={choosevideo}
                autoPlay
                loop
                muted
            ></video>
            
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600"
                        onClick={() => {
                            if (month === 0) {
                                setMonth(11);
                                setYear(year - 1);
                            } else {
                                setMonth(month - 1);
                            }
                        }}
                    >
                        Tháng trước
                    </button>
                    <h1 className="text-2xl font-bold mb-4 text-center">Lịch tháng {month + 1} / {year}</h1>
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600"
                        onClick={() => {
                            if (month === 11) {
                                setMonth(0);
                                setYear(year + 1);
                            } else {
                                setMonth(month + 1);
                            }
                        }}
                    >
                        Tháng sau
                    </button>
                </div>
                
                {isLoading && (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Đang tải lịch đặt phòng...</p>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                
                <div className="grid grid-cols-7 gap-2 mb-4">
                    <div className="font-bold text-center border rounded-md py-1 bg-red-200">CN</div>
                    <div className="font-bold text-center border rounded-md py-1 bg-blue-100">T2</div>
                    <div className="font-bold text-center border rounded-md py-1 bg-blue-100">T3</div>
                    <div className="font-bold text-center border rounded-md py-1 bg-blue-100">T4</div>
                    <div className="font-bold text-center border rounded-md py-1 bg-blue-100">T5</div>
                    <div className="font-bold text-center border rounded-md py-1 bg-blue-100">T6</div>
                    <div className="font-bold text-center border rounded-md py-1 bg-green-200">T7</div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                    {days}
                </div>
                
                {bookings.length > 0 && (
                    <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
                        <p className="font-medium text-yellow-800">Lịch đặt phòng trong tháng: {bookings.filter(b => {
                            const [day, monthStr, yearStr] = b.date?.split('/').map(Number) || [];
                            return monthStr === month + 1 && yearStr === year;
                        }).length} lượt</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Calendar;
