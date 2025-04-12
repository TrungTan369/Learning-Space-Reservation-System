import { Sidebar } from "lucide-react"


export default function RoomsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Sidebar>
                zz
            </Sidebar>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                    Danh sách phòng
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((room) => (
                        <div
                            key={room}
                            className="rounded-2xl shadow-lg bg-white overflow-hidden hover:scale-105 transition-transform"
                        >
                            <img
                                src={`/images/room${room % 3 + 1}_page.jpg`}
                                alt={`Room ${room}`}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">Phòng {room}</h2>
                                <p className="text-gray-600 text-sm mb-3">
                                    Phòng chất lượng cao, trang bị đầy đủ, phù hợp học tập, họp nhóm.
                                </p>
                                <button className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm">
                                    Đặt phòng
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}