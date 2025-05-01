'use client';

import { useState } from "react";
import RoomsPage from "./rooms";
import Navbar from "../navbar";
import Filter from "./filter";
import Footer from "../footer";
import type { FilterState } from "./filter";

export default function Room() {
    const [filters, setFilters] = useState<FilterState>({
        coSo: [],
        loaiPhong: [],
    });

    return (
        <>
            <Navbar />

            <div className="flex flex-col md:flex-row gap-4 px-6 py-4">
                <div className="md:w-1/4 w-full">
                    <Filter onFilterChange={(filters) => setFilters(filters)} />
                </div>
                <div className="md:w-3/4 w-full">
                    <RoomsPage filters={filters} />
                </div>
            </div>

            <Footer />
        </>
    );

}
