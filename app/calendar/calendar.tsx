'use client';
import React from 'react';

const Calendar = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0 = Jan
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Thêm ô trống đầu tuần nếu ngày 1 không phải Chủ Nhật
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} />);
    }

    // Render các ngày trong tháng
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === currentDate.getDate();
        let content = <span>{d}</span>;

        if (d === 15) {
            content = (
                <div className="flex flex-col items-center bg-yellow-100 p-2 rounded">
                    <strong>{d}</strong>
                    <span className="text-xs text-red-600">Đặt phòng 812</span>
                </div>
            );
        } else if (isToday) {
            content = (
                <div className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                    {d}
                </div>
            );
        }

        days.push(
            <div
                key={d}
                className="border rounded-2xl border-gray-300 flex justify-center items-center h-20 hover:bg-gray-100 cursor-pointer"
            >
                {content}
            </div>
        );
    }

    return (
        <div>


            <div className="p-6 w-full ">
                <h1 className="text-2xl font-bold mb-4">Lịch tháng {month + 1} / {year}</h1>
                <div className="grid grid-cols-7 gap-2">
                    <div className="font-bold text-center">CN</div>
                    <div className="font-bold text-center">T2</div>
                    <div className="font-bold text-center">T3</div>
                    <div className="font-bold text-center">T4</div>
                    <div className="font-bold text-center">T5</div>
                    <div className="font-bold text-center">T6</div>
                    <div className="font-bold text-center">T7</div>
                    {days}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
