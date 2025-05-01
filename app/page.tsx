"use client";

import Image from 'next/image'
import Footer from "./footer";
import Navbar from "./navbar";
import React, { useRef } from 'react';

import { motion } from 'framer-motion';
import { useInView } from "framer-motion";

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function Home() {
    const ref2 = useRef(null);
    const isInView2 = useInView(ref2, { once: true, amount: 0.5 });

    const ref3 = useRef(null);
    const isInView3 = useInView(ref3, { once: true, amount: 0.5 });

    return (
        <>
            <Navbar />
            <div className="relative h-screen w-full">
                <Image
                    src="/images/room1_page.jpg"
                    alt="background"
                    fill
                    className="object-cover brightness-75"
                />

                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
                    <h1 className="text-4xl font-bold">Tìm Nhanh Phòng Học</h1>
                    <p className="mt-2 text-lg">Tìm kiếm nhanh chóng, chính xác!</p>

                    <div className="mt-6 w-full max-w-5xl  text-black rounded-full p-3 flex flex-wrap gap-3 items-center justify-center">
                        <div className="relative ">
                            <select
                                id="roomType"
                                defaultValue=""
                                className="peer w-40 appearance-none rounded-full bg-white/90 border px-4 pt-5 pb-2 text-sm text-black outline-none focus:border-rose-500"
                            >
                                <option value="" disabled hidden></option>
                                <option>Cơ sở 1</option>
                                <option>Cơ Sở 2</option>
                            </select>
                            <label
                                htmlFor="roomType"
                                className="absolute left-4 top-2 text-xs text-gray-500 transition-all
											peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
											peer-placeholder-shown:text-gray-400
											peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-500"
                            >
                                Chọn cơ sở
                            </label>
                        </div>
                        <div className="relative ">
                            <select
                                id="roomType"
                                defaultValue=""
                                className="peer w-40 appearance-none rounded-full bg-white/90 border px-4 pt-5 pb-2 text-sm text-black outline-none focus:border-rose-500"
                            >
                                <option value="" disabled hidden></option>
                                <option>Phòng học</option>
                                <option>Phòng meeting</option>
                            </select>
                            <label
                                htmlFor="roomType"
                                className="absolute left-4 top-2 text-xs text-gray-500 transition-all
											peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
											peer-placeholder-shown:text-gray-400
											peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-500"
                            >
                                Loại phòng
                            </label>
                        </div>

                        <div className="relative">
                            <select
                                id="capacity"
                                defaultValue=""
                                className="peer w-32 appearance-none bg-white/90 rounded-full border px-4 pt-5 pb-2 text-sm text-black outline-none focus:border-rose-500"
                            >
                                <option value="" disabled hidden></option>
                                <option>10 người</option>
                                <option>20 người</option>
                                <option>40 người</option>
                            </select>
                            <label
                                htmlFor="capacity"
                                className="absolute left-4 top-2 text-xs text-gray-500 transition-all
								peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
								peer-placeholder-shown:text-gray-400
								peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-500"
                            >
                                Số lượng
                            </label>
                        </div>

                        <div className="relative">
                            <select
                                id="quality"
                                defaultValue=""
                                className="peer w-40 appearance-none bg-white/90 rounded-full border px-4 pt-5 pb-2 text-sm text-black outline-none focus:border-rose-500"
                            >
                                <option value="" disabled hidden></option>
                                <option>Loại 1</option>
                                <option>Loại 2</option>
                                <option>Loại 3</option>
                            </select>
                            <label
                                htmlFor="quality"
                                className="absolute left-4 top-2 text-xs text-gray-500 transition-all
											peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
											peer-placeholder-shown:text-gray-400
											peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-500"
                            >
                                Chất lượng
                            </label>
                        </div>

                        {/* <div className="relative">
							<select
								id="category"
								defaultValue=""
								className="peer w-32 appearance-none bg-white/90 rounded-full border px-4 pt-5 pb-2 text-sm text-black outline-none focus:border-rose-500"
							>
								<option value="" disabled hidden></option>
								<option>Cá nhân</option>
								<option>Hội trường</option>
								<option>Phòng máy</option>
								<option>Lý thuyết</option>
							</select>
							<label
								htmlFor="category"
								className="	absolute left-4 top-2 text-xs text-gray-500 transition-all
       										peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
        									peer-placeholder-shown:text-gray-400
        									peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-500"
							>
								Danh mục
							</label>
						</div> */}

                        <button
                            type="submit"
                            className="bg-rose-600 text-white px-6 py-2 rounded-full hover:bg-rose-800 cursor-pointer"
                        >
                            Tìm kiếm
                        </button>
                    </div>

                </div>

            </div>

            {/* page 2*/}
            <div className="relative h-screen w-full bg-sky-100 overflow-hidden">
                <Image
                    src="/images/bg2_page.jpg"
                    alt="room2 background"
                    fill
                    className="object-cover opacity-40 z-0"
                />
                <div
                    ref={ref2}
                    className="relative z-10 h-full flex items-center justify-around px-10"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={isInView2 ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1 }}
                        className="max-w-md text-left text-gray-800"
                    >
                        <div className=" p-8 rounded-xl shadow-lg backdrop-blur-sm max-w-2xl">
                            <h2 className="text-4xl font-bold mb-4">Không gian học tập hiện đại – Dành riêng cho bạn</h2>
                            <ol>
                                <li>📌 Dễ dàng đặt chỗ chỉ trong vài giây</li>
                                <li>📅 Theo dõi lịch sử sử dụng phòng</li>
                                <li>🧭 Giao diện thân thiện – tối ưu cho sinh viên</li>
                                <li>🔐 Tích hợp quản lý IoT và kiểm soát truy cập</li>
                                <li>🧪 Hỗ trợ cá nhân, nhóm, hội thảo, lab,...</li>
                            </ol>
                        </div>
                    </motion.div>

                    {/* Image animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView2 ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1 }}
                        className="w-[800px] h-[500px] relative object-contain rounded-xl overflow-hidden shadow-lg"
                    >
                        <Image
                            src="/images/room2_page.png"
                            alt="Room preview"
                            fill
                            className="object-cover mt-10"
                        />
                    </motion.div>
                </div>
            </div>

            {/* page 3*/}
            <div className="relative h-screen w-full bg-sky-100 overflow-hidden">
                <Image
                    src="/images/bg3_page.jpg"
                    alt="room3 background"
                    fill
                    className="object-cover opacity-40 z-0"
                />
                <div
                    ref={ref3}
                    className="relative z-10 h-full flex items-center justify-around px-10"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={isInView3 ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1 }}
                        className="max-w-md text-left text-gray-800"
                    >
                        <div className=" p-8 rounded-xl shadow-lg backdrop-blur-sm max-w-2xl">
                            <h2 className="text-4xl font-bold mb-4">Hỗ trợ học tập hiệu quả</h2>
                            <p className="text-lg">
                                Một không gian học tập lý tưởng bắt đầu từ việc đặt phòng dễ dàng. Hệ thống của chúng tôi là cầu nối giữa sinh viên, giảng viên và những buổi học hiệu quả, tập trung – mọi lúc, mọi nơi.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView3 ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1 }}
                        className="w-[800px] h-[500px] relative rounded-xl overflow-hidden shadow-lg"
                    >
                        <Image
                            src="/images/room3_page.jpg"
                            alt="Room preview"
                            fill
                            className="object-cover mt-10"
                        />
                    </motion.div>
                </div>
            </div>
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 w-20 h-20 bg-red-300 text-white rounded-full shadow-md flex items-center justify-center hover:bg-red-400 transition-all z-50 animate-bounce"
                title="Đặt phòng ngay"
            >
                Đặt phòng
            </button>
            <Footer />
        </>

    );
}