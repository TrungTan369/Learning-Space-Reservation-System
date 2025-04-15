'use client';
import React from 'react';
import { useState } from 'react';
import lunar from 'lunar-calendar';

const Calendar = () => {

    const today = new Date();
    const [month, setMonth] = useState(today.getMonth()); // 0-11
    const [year, setYear] = useState(today.getFullYear());
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const lunarDate = lunar.solarToLunar(year, month + 1, today.getDate());
    let choosevideo = "";
    if (lunarDate.lunarMonth === 1) {
        choosevideo = "/images/tet.mp4";
    } else if ([0, 1, 2].includes(month)) {
        choosevideo = "/images/spring.mp4";
    } else if ([3, 4, 5].includes(month)) {
        choosevideo = "/images/summer.mp4";
    } else if ([6, 7, 8].includes(month)) {
        choosevideo = "/images/autumn.mp4";
    } else if ([9, 10, 11].includes(month)) {
        choosevideo = "/images/winter.mp4";
    }

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === today.getDate();
        const lunarDay = lunar.solarToLunar(year, month + 1, d);
        let content = <span>{d}</span>;

        const isTet = lunarDay.lunarMonth === 1 && [1, 2, 3].includes(lunarDay.lunarDay);
        if (isTet) {
            content = (
                <div className="flex flex-col items-center w-full h-full bg-red-400 p-2 rounded-2xl">
                    <strong>{d}</strong>
                    <img src={"images/baolixi.png"} alt="bao lì xì" className='w-8 h-8'>
                    </img>
                    <span className="text-xs text-white font-semibold">Tết Nguyên Đán</span>
                </div>
            );
        } else if (d === 20) {
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
                className="border rounded-2xl border-gray-300 bg-gray-50 flex justify-center items-center h-20 hover:bg-gray-100 cursor-pointer"
            >
                {content}
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen overflow-hidden">

            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
            >
                <source src={choosevideo} type="video/mp4" />
            </video>

            <div className="p-6 w-full bg-white/20 backdrop-blur-sm rounded-xl shadow-xl max-w-4xl mx-auto mt-10 ">
                <div className="flex items-center justify-between mb-4">
                    <button
                        className="bg-purple-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-gray-300"
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
                        className="bg-purple-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-gray-300"
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
                <div className="grid grid-cols-7 gap-2">
                    <div className="font-bold text-center border rounded-2xl bg-red-200">Sun</div>
                    <div className="font-bold text-center border rounded-2xl bg-green-200">Mon</div>
                    <div className="font-bold text-center border rounded-2xl bg-green-200">Tue</div>
                    <div className="font-bold text-center border rounded-2xl bg-green-200">Wed</div>
                    <div className="font-bold text-center border rounded-2xl bg-green-200">Thu</div>
                    <div className="font-bold text-center border rounded-2xl bg-green-200">Fri</div>
                    <div className="font-bold text-center rounded-2xl bg-red-200">T7</div>
                    {days}
                </div>
            </div>
        </div>
    );

};

export default Calendar;
