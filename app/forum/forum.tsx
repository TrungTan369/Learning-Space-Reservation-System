'use client';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

export default function ForumPage() {
    const [posts, setPosts] = useState([]);
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

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

    return (
        <div className="p-4">
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
                </div>
            ))}

            {role === 'admin' && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="font-semibold mb-2">📝 Đăng bài mới</h2>
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
                    <button onClick={handlePost} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Đăng bài
                    </button>
                </div>
            )}
        </div>
    );
}
