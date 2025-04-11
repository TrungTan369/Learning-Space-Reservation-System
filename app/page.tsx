'use client'

import Image from 'next/image'
import Footer from "./footer";
import Navbar from "./navbar";
import React, { useState } from 'react';

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

const backgrounds = [


	"/images/room1_page.jpg",
	"/images/room2_page.jpg",
	"/images/room3_page.jpg"
];

export default function Home() {
	const [showAdvanced, setShowAdvanced] = useState(false);

	return (
		<>
			<div className="relative h-screen w-full">
				<Navbar />
				<Image
					src="/images/room1_page.jpg"
					alt="background"
					fill
					className="object-cover brightness-75"
				/>

				{/* Overlay */}
				<div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
					<h1 className="text-4xl font-bold">Tìm Phòng Học</h1>
					<p className="mt-2 text-lg">Tìm kiếm nhanh chóng, chính xác!</p>

					<div className="mt-6 w-full max-w-5xl bg-white/90 text-black rounded-full p-3 flex flex-wrap gap-3 items-center justify-center">
						<select id="category" className="px-4 py-2 rounded-full border outline-none">
							<option>Cá nhân</option>
							<option>Hội trường</option>
							<option>Phòng máy</option>
							<option>Lý thuyết</option>
						</select>
						<label htmlFor="category"
							className="sr-only">
							Danh mục
						</label>

						<button
							type="submit"
							className="bg-rose-600 text-white px-6 py-2 rounded-full"
						>
							Tìm kiếm
						</button>

					</div>
				</div>
			</div>
			<Footer />
			<button
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				className="fixed bottom-6 right-6 w-18 h-18 bg-red-300 text-white rounded-full shadow-md flex items-center justify-center hover:bg-red-400 transition-all z-50 animate-bounce"
				title="Đặt phòng ngay"
			>
				Đặt phòng
			</button>
		</>

	);
}