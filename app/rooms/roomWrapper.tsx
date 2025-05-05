'use client'

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import RoomsPage from "./rooms";
import Navbar from "../navbar";
import Filter from "./filter";
import Footer from "../footer";
import type { FilterState } from "./filter";

export default function RoomWrapper() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<FilterState>({
        _id: "",
        name: "",
        coSo: searchParams.get("coSo")?.split(",") || [],
        sucChua: searchParams.get("sucChua")?.split(",") || [],
        chatLuong: searchParams.get("chatLuong")?.split(",") || []
    });

    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.coSo.length > 0) params.set("coSo", filters.coSo.join(","));
        if (filters.sucChua.length > 0) params.set("sucChua", filters.sucChua.join(","));
        if (filters.chatLuong.length > 0) params.set("chatLuong", filters.chatLuong.join(","));

        const queryString = params.toString();
        router.push(`?${queryString}`);
    }, [filters, router]);
    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto">
                <div className="md:w-1/5 w-full">
                    <div className="sticky top-24">
                        <Filter onFilterChange={(filters) => setFilters(filters)} />
                    </div>
                </div>
                <div className="md:w-4/5 w-full">
                    <RoomsPage filters={filters} />
                </div>
            </div>

            <Footer />
        </>
    );
}
