'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar";
import Footer from "../footer";
import Profile from "./profile";
import Booked from "./booked";
import Security from "./security"
import ControlRoom from "./control";
export default function MyPage() {
    const [activeTab, setActiveTab] = useState("booked");
    const router = useRouter();
    const renderContent = () => {
        switch (activeTab) {
            case "booked":
                return <Booked />;
            case "profile":
                return <Profile />;
            case "security":
                return <Security />;
            case "control":
                return <ControlRoom />;
        }
    };

    return (
        <>
            <Navbar />
            <div className="mx-6 mt-4 bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Trung tâm tài khoản</h1>
            </div>

            <div className="flex min-h-[600px] bg-gray-50 mx-6 my-6 gap-6">

                {/* Sidebar */}
                <div className="w-64 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between h-140">
                    <nav className="space-y-4 text-gray-700 text-base">

                        <div
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === "myroom" ? "bg-blue-100 text-blue-600 font-medium" : ""
                                }`}
                            onClick={() => setActiveTab("booked")}
                        >
                            <span>📘</span>
                            <span>Phòng đã đặt</span>
                        </div>
                        <div
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === "control" ? "bg-blue-100 text-blue-600 font-medium" : ""
                                }`}
                            onClick={() => setActiveTab("control")}
                        >
                            <span>📘</span>
                            <span>Điều khiển phòng</span>
                        </div>
                        <div
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === "profile" ? "bg-blue-100 text-blue-600 font-medium" : ""
                                }`}
                            onClick={() => setActiveTab("profile")}
                        >
                            <span>💳</span>
                            <span>Thông tin cá nhân</span>
                        </div>
                        <div
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === "security" ? "bg-blue-100 text-blue-600 font-medium" : ""
                                }`}
                            onClick={() => setActiveTab("security")}
                        >
                            <span>🔐</span>
                            <span>Mật khẩu & bảo mật</span>
                        </div>
                    </nav>

                    {/* Logout Button */}
                    <div className="mt-auto pt-4">
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                router.push("/login");
                            }}
                            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    {renderContent()}
                </div>
            </div>

            <Footer />
        </>
    );
}