
'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar";
import Footer from "../footer";
import CheckinPage from "./checkin";
import ManageUser from "./user";
import ManageRoom from "./room";
export default function MyPage() {
    const [activeTab, setActiveTab] = useState("checkin");
    const router = useRouter();
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

    return (
        <>
            <Navbar />
            <div className="mx-6 mt-4 bg-while rounded-xl shadow-sm border border-gray-200 px-8 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold ">Trung tâm quản lí</h1>
            </div>

            <div className="flex min-h-[600px] bg-gray-50 mx-6 my-6 gap-6">

                {/* Sidebar */}
                <div className="w-64 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between h-140">
                    <nav className="space-y-4 text-gray-700 text-base">

                        <div
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === "checkin" ? "bg-blue-100 text-blue-600 font-medium" : ""
                                }`}
                            onClick={() => setActiveTab("checkin")}
                        >
                            <span>📘</span>
                            <span>Quản lí checkin</span>
                        </div>
                        <div
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === "manageUser" ? "bg-blue-100 text-blue-600 font-medium" : ""
                                }`}
                            onClick={() => setActiveTab("manageUser")}
                        >
                            <span>💳</span>
                            <span>Quản lí User</span>
                        </div>
                        <div
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${activeTab === "manageRoom" ? "bg-blue-100 text-blue-600 font-medium" : ""
                                }`}
                            onClick={() => setActiveTab("manageRoom")}
                        >
                            <span>🔐</span>
                            <span>Quản lí phòng</span>
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