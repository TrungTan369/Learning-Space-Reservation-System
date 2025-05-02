'use client';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Image from 'next/image'
export default function ForumPage() {
    const [posts, setPosts] = useState<Array<{ _id: string }>>([]);
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/forum');
                const data = await res.json();
                setPosts(data);
            } catch (err) {
                console.error('Lỗi khi lấy bài viết:', err);
            }
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    setRole(decoded.role);
                    setUserId(decoded._id);
                } catch (err) {
                    console.error('Token không hợp lệ');
                }
            }
        };
        fetchData();
    }, []);

    const handlePost = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Bạn chưa đăng nhập');
            return;
        }
        const res = await fetch('/api/forum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content }),
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message || 'Đăng bài thành công');
            location.reload();
        } else {
            alert(data.message || 'Đăng bài thất bại');
        }
    };

    const handleDelete = async (postId: string) => {
        const confirmed = confirm('Bạn có chắc chắn muốn xoá bài viết này không?');
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/forum?id=${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'Đã xoá bài viết');
                setPosts((prev) => prev.filter((post) => post._id !== postId));
            } else {
                alert(data.message || 'Xoá thất bại');
            }
        } catch (err) {
            console.error('Lỗi xoá bài viết:', err);
            alert('Có lỗi xảy ra');
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Ảnh nền */}
            <Image
                src="/images/forum_bg.jpg"
                alt="background"
                fill
                className="object-cover z-0"
            />
            <div className="relative z-10 p-4">
                <h1 className="text-xl font-bold mb-4">📢 Bài viết diễn đàn</h1>
                {posts.map((post: any) => (
                    <div key={post._id} className="border p-3 mb-3 rounded bg-white shadow">
                        <h2 className="font-semibold">{post.title}</h2>
                        <p>{post.content}</p>
                        <small className="text-gray-500"> Tác giả: {post.authorName}</small>
                        <small className="text-gray-500">
                            .  📅 Ngày đăng: {new Date(post.createAt).toLocaleString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour12: false
                            })}
                        </small>
                        {role === 'admin' && (
                            <div className="mt-2">
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="text-red-600 hover:underline cursor-pointer"
                                >
                                    🗑️ Xoá
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {role === 'admin' && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
                        >
                            ➕ Tạo bài viết
                        </button>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center pointer-events-none">
                        <div
                            className="relative bg-white p-6 rounded shadow w-full max-w-md pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Nút đóng góc phải */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                            >
                                &times;
                            </button>

                            <h2 className="text-lg font-bold mb-4">📝 Tạo bài viết</h2>

                            <input
                                type="text"
                                placeholder="Tiêu đề"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="block border p-2 mb-2 w-full"
                            />
                            <textarea
                                placeholder="Nội dung"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="block border p-2 mb-2 w-full h-32"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="mr-2 px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handlePost}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Đăng bài
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
