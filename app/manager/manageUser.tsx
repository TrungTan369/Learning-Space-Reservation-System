'use client';
import { useEffect, useState } from 'react';
import { User, UserPlus, Trash2, Search } from 'lucide-react';

type UserType = {
    _id: string;
    username: string;
    fullname: string;
    role: string;
};

export default function ManageUser() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', fullname: '', password: '', role: 'user' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (name = '') => {
        setLoading(true);
        const params = name ? `?name=${encodeURIComponent(name)}` : '';
        const res = await fetch(`/api/manager/manageUser${params}`);
        const data = await res.json();
        setUsers(data.users || []);
        setLoading(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers(search);
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/manager/manageUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });

        let data = {};
        try {
            data = await res.json();
        } catch {
            data = {};
        }

        if (res.ok) {
            setUsers([...users, (data as any).user]);
            setNewUser({ username: '', fullname: '', password: '', role: 'user' });
        } else {
            alert((data as any).message || 'Thêm thất bại');
        }
        setLoading(false);
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
        setLoading(true);
        const res = await fetch(`/api/manager/manageUser?id=${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
            setUsers(users.filter(u => u._id !== id));
        } else {
            alert(data.message || 'Xóa thất bại');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-blue-700">
                <User className="w-8 h-8" /> Quản lý người dùng
            </h1>
            {/* Form thêm user */}
            <form onSubmit={handleAddUser} className="mb-8 flex flex-wrap gap-3 items-end bg-blue-50 border border-blue-200 rounded-xl p-4 shadow">
                <UserPlus className="w-6 h-6 text-blue-600 mr-2" />
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={newUser.username}
                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                    className="border p-2 rounded flex-1 min-w-[120px]"
                    required
                />
                <input
                    type="text"
                    placeholder="Họ tên"
                    value={newUser.fullname}
                    onChange={e => setNewUser({ ...newUser, fullname: e.target.value })}
                    className="border p-2 rounded flex-1 min-w-[120px]"
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    className="border p-2 rounded flex-1 min-w-[120px]"
                    required
                />
                <select
                    aria-label="add account"
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Thêm
                </button>
            </form>
            {/* Form tìm kiếm */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2 items-center">
                <Search className="w-5 h-5 text-blue-500" />
                <input
                    type="text"
                    placeholder="Tìm theo tên..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Tìm
                </button>
            </form>
            {/* Danh sách user */}
            {loading ? (
                <div className="text-center text-blue-600">Đang tải...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {users.map(user => (
                        <div
                            key={user._id}
                            className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col gap-2 relative"
                        >
                            <div className="flex items-center gap-3 mb-2 pr-10">
                                <User className="w-6 h-6 text-blue-500" />
                                <span className="font-semibold text-lg">{user.fullname}</span>
                                <span className={`ml-auto px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="text-gray-600 text-sm">
                                <span className="font-mono text-blue-700">{user.username}</span>
                            </div>
                            <button
                                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
                                title="Xóa tài khoản"
                                onClick={() => handleDeleteUser(user._id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
