import Image from "next/image";
import { Bell, MessageCircle, ChevronDown, Search } from "lucide-react";
import { Menu } from '@headlessui/react';
import React, { useState, useRef } from 'react';
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	return (
		<nav className="sticky top-0 left-0 w-full bg-transparent backdrop-blur-md shadow-sm z-50">
			<div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">

				<div className="flex items-center space-x-6">
					<Image src="/images/logo.png" alt="BK Logo" width={32} height={32} />
					<a
						href="/"
						className={`hover:underline ${pathname === '/' ? 'font-semibold text-blue-600 underline' : ''
							}`}
					>
						Trang chủ
					</a>
					<a href="/"
						className={`hover:underline ${pathname === '/calendar' ? 'font-semibold text-blue-600 underline' : ''
							}`}>
						Lịch của tôi
					</a>
					<a href="/rooms"
						className={`hover:underline ${pathname === '/rooms' ? 'font-semibold text-blue-600 underline' : ''
							}`}>
						Xem phòng
					</a>
					<a href="/"
						className={`hover:underline ${pathname === '/notice' ? 'font-semibold text-blue-600 underline' : ''
							}`}>
						Thông báo chung
					</a>
				</div>

				<div className="flex items-center space-x-4">

					<Bell className="hover:text-gray-200 cursor-pointer" />

					<MessageCircle className="hover:text-gray-200 cursor-pointer" />

					<div className="flex items-center space-x-1">
						<Menu as="div" className="relative inline-block text-left">
							<Menu.Button className="focus:outline-none cursor-pointer">
								<Image
									src="/images/avatar.jpg"
									alt="User Avatar"
									width={32}
									height={32}
									className="rounded-full"
								/>
							</Menu.Button>

							<Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
								<Menu.Item>
									{({ active }) => (
										<a
											href="/profile"
											className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''
												}`}
										>
											Thông tin cá nhân
										</a>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
										<a
											href="/profile"
											className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''
												}`}
										>
											Báo lỗi
										</a>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
										<a
											href="/profile"
											className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''
												}`}
										>
											Góp ý
										</a>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
										<button
											onClick={() => {
												router.push("/login");
											}}
											className={`cursor-pointer block w-full text-left px-4 py-2 text-sm text-red-600 ${active ? 'bg-gray-100' : ''
												}`}
										>
											Đăng xuất
										</button>
									)}
								</Menu.Item>
							</Menu.Items>
						</Menu>
						<ChevronDown size={16} />
					</div>
				</div>
			</div>
		</nav>
	);
}
