import Image from "next/image";
import { Bell, MessageCircle, ChevronDown, Search } from "lucide-react";

export default function Navbar() {
	return (
		<nav className="sticky top-0 left-0 w-full bg-transparent backdrop-blur-md shadow-sm z-50">
			<div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">

				<div className="flex items-center space-x-6">
					<Image src="/images/logo.png" alt="BK Logo" width={32} height={32} />
					<a href="#" className="hover:underline">Trang chủ</a>
					<a href="#" className="hover:underline">Lịch của tôi</a>
					<a href="#" className="hover:underline">Xem phòng</a>
					<a href="#" className="hover:underline">Liên hệ</a>
				</div>

				<div className="flex items-center space-x-4">
					<Bell className="hover:text-gray-200 cursor-pointer" />
					<MessageCircle className="hover:text-gray-200 cursor-pointer" />
					<div className="flex items-center space-x-1 cursor-pointer">
						<Image
							src="/images/avatar.jpg"
							alt="User Avatar"
							width={32}
							height={32}
							className="rounded-full"
						/>
						<ChevronDown size={16} />
					</div>
				</div>
			</div>
		</nav>
	);
}
