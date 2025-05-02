'use client';

import { useEffect, useState } from 'react';

export default function ForumPage() {
    const [posts, setPosts] = useState([]);
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/forum');
            const data = await res.json();
            setPosts(data);

            const role = localStorage.getItem('userRole') || '';
            const id = localStorage.getItem('userId') || '';
            setRole(role);
            setUserId(id);
        };
        fetchData();
    }, []);

    const handlePost = async () => {
        const res = await fetch('/api/forum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, authorId: userId, role }),
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            location.reload();
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">📢 Bài viết diễn đàn</h1>
            {posts.map((post: any) => (
                <div key={post._id} className="border p-3 mb-3 rounded bg-white shadow">
                    <h2 className="font-semibold">{post.title}</h2>
                    <p>{post.content}</p>
                    <small className="text-gray-500">Tác giả: {post.author}</small>
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
