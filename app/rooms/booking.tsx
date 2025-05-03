"use client";
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

type BookingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onBook: (bookingData: any) => void;
    roomId: string;
};

const timeSlots = [
    "07-09",
    "09-11",
    "11-13",
    "13-15",
    "15-17",
    "17-19",
];

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onBook, roomId }) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [isSlotsLoading, setIsSlotsLoading] = useState(false);

    const handleBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Bạn chưa đăng nhập');
            return;
        }

        if (selectedDate && selectedSlot) {
            const [startStr, endStr] = selectedSlot.split("-");
            const startTime = parseInt(startStr);
            const endTime = parseInt(endStr);

            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    roomId,
                    date: selectedDate,
                    startTime,
                    endTime,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'Đặt phòng thành công');
                onBook({ roomId, date: selectedDate, startTime, endTime }); // callback
                onClose();
            } else {
                alert(data.message || 'Đặt phòng thất bại');
            }
        } else {
            alert("Vui lòng chọn ngày và khung giờ");
        }
    };

    const fetchBookedSlots = async (date: string) => {
        setIsSlotsLoading(true);
        try {
            const res = await fetch(`/api/booking?roomId=${roomId}&date=${selectedDate}`);
            const data = await res.json();
            setBookedSlots(data.bookedSlots || []);
        } catch (error) {
            console.error("Lỗi khi lấy slot đã đặt:", error);
        } finally {
            setIsSlotsLoading(false);
        }
    };
    useEffect(() => {
        if (!selectedDate || !roomId) return;
        fetchBookedSlots(selectedDate);
    }, [selectedDate, roomId]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="z-50 w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl">
                <Dialog.Title className="text-xl font-semibold text-blue-800 mb-4">
                    Đặt phòng
                </Dialog.Title>

                {/* Ngày */}
                <h2 className="text-1xl font-medium text-purple-700 mb-2">Chọn ngày</h2>
                <div className="flex justify-between gap-2 mb-4">
                    {Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i + 1);

                        const formattedForDisplay = date.toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                        });
                        const formatted = date.toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        });

                        return (
                            <button
                                key={i}
                                onClick={async () => {
                                    setSelectedDate(formatted);
                                    setSelectedSlot(null);
                                    setIsSlotsLoading(true);
                                    //
                                    await fetchBookedSlots(formatted);
                                    setIsSlotsLoading(false);
                                }}
                                className={`w-full px-3 py-2 rounded-lg text-sm text-center cursor-pointer
                        ${selectedDate === formatted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                            >
                                {formattedForDisplay}
                            </button>
                        );
                    })}
                </div>

                <h3 className="text-md font-medium text-purple-700 mb-2">Chọn giờ</h3>
                <div className="flex flex-wrap justify-between gap-2 mb-6">
                    {timeSlots.map((slot) => {
                        const [startStr, endStr] = slot.split("-");
                        const start = parseInt(startStr);
                        const end = parseInt(endStr);

                        // Ý tưởng: slot 07-09 sẽ bị đỏ nếu có số 8 nằm trong bookedSlots
                        // => chỉ cần kiểm tra nếu bookedSlots có chứa (start + 1)
                        const criticalHour = (start + 1).toString();
                        const isBooked = bookedSlots.includes(criticalHour);
                        const disabledByDate = !selectedDate;
                        return (
                            <button
                                key={slot}
                                onClick={() => {
                                    if (!isBooked) {
                                        setSelectedSlot(slot);
                                    }
                                }}
                                disabled={isBooked}
                                className={`flex-1 px-4 py-2 rounded-full text-sm border transition
                                    ${selectedSlot === slot
                                        ? "bg-green-600 text-white"
                                        : isBooked
                                            ? "bg-red-500 text-white opacity-90 cursor-not-allowed"
                                            : disabledByDate || isSlotsLoading
                                                ? "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {slot}
                            </button>
                        );
                    })}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-full text-sm bg-gray-300 hover:bg-gray-400 text-gray-800">
                        Huỷ
                    </button>
                    <button
                        onClick={handleBooking}
                        disabled={!selectedDate || !selectedSlot}
                        className="px-4 py-2 rounded-full text-sm bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
                    >
                        Đặt phòng
                    </button>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
};

export default BookingModal;
