'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar";
import Footer from "../footer";
import CheckinPage from "./checkin";
import ManageUser from "./manageUser";
import ManageRoom from "./manaeRoom";

export default function MyPage() {
    const [activeTab, setActiveTab] = useState("checkin");
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Kiểm tra quyền khi trang được tải
    useEffect(() => {
        const checkAdminRole = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const res = await fetch('/api/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                const data = await res.json();
                
                if (data.role !== 'admin') {
                    // Không phải admin, chuyển hướng về trang chủ
                    router.push('/');
                } else {
                    setIsAdmin(true);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Lỗi kiểm tra quyền:', error);
                router.push('/');
            }
        };

        checkAdminRole();
    }, [router]);

    const renderContent = () => {
        switch (activeTab) {
            case "checkin":
                return <CheckinPage />;
            case "manageUser":
                return <ManageUser />
            case "manageRoom":
                return <ManageRoom />;
        }
    };

    // Hiển thị màn hình loading trong khi kiểm tra role
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Chỉ hiển thị nội dung nếu là admin
    return (
        <>
            <Navbar />
            <div className="mx-6 mt-4 bg-while rounded-xl shadow-sm border border-gray-200 px-8 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold ">Trung tâm quản lí</h1>
            </div>

            <div className="flex min-h-[600px] bg-gray-50 mx-6 my-6 gap-6">
                {/* Rest of your existing component */}
                {/* Sidebar */}
                <div className="w-64 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between h-140">
                    <nav className="space-y-4 text-gray-700 text-base">
                        {/* Your navigation items */}
                        <div
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === "checkin" ? "bg-blue-100 text-blue-600 font-medium" : ""}`}
                            onClick={() => setActiveTab("checkin")}
                        >
                            <span>📘</span>
                            <span>Quản lí Checkin</span>
                        </div>
                        {/* Other navigation items */}
                        <div
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === "manageUser" ? "bg-blue-100 text-blue-600 font-medium" : ""}`}
                            onClick={() => setActiveTab("manageUser")}
                        >
                            <span>💳</span>
                            <span>Quản lí User</span>
                        </div>
                        <div
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === "manageRoom" ? "bg-blue-100 text-blue-600 font-medium" : ""}`}
                            onClick={() => setActiveTab("manageRoom")}
                        >
                            <span>🔐</span>
                            <span>Quản lí Phòng</span>
                        </div>
                    </nav>
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