'use client';

import { useState } from "react";
import RoomsPage from "./rooms";
import Navbar from "../navbar";
import Filter from "./filter";
import Footer from "../footer";
import type { FilterState } from "./filter";

export default function Room() {
    const [filters, setFilters] = useState<FilterState>({
        _id: "",
        name: "",
        coSo: [],
        sucChua: [],
        chatLuong: []
    });

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
