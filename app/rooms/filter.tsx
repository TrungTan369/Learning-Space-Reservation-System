// components/xem-phong/Filter.tsx
import React, { useState, useEffect } from "react";

export type FilterState = {
    coSo: string[];
    loaiPhong: string[];
};

type FilterProps = {
    onFilterChange: (filters: FilterState) => void;
};

const Filter = ({ onFilterChange }: FilterProps) => {
    const [filters, setFilters] = useState<FilterState>({
        coSo: [],
        loaiPhong: [],
    });

    const toggleCheckbox = (key: keyof FilterState, value: string) => {
        setFilters(prev => {
            const updated = prev[key].includes(value)
                ? prev[key].filter(v => v !== value)
                : [...prev[key], value];
            return { ...prev, [key]: updated };
        });
    };

    useEffect(() => {
        onFilterChange(filters);
    }, [filters]);

    return (
        <div className="w-64 p-4 bg-white shadow rounded-lg space-y-4 sticky top-20 h-fit">
            <h2 className="text-lg font-semibold">Bộ lọc</h2>

            {/* Cơ sở */}
            <div>
                <p className="font-medium mb-2">Chọn cơ sở</p>
                {["1", "2"].map(cs => (
                    <label key={cs} className="flex items-center space-x-2 mb-1">
                        <input
                            type="checkbox"
                            checked={filters.coSo.includes(cs)}
                            onChange={() => toggleCheckbox("coSo", cs)}
                        />
                        <span>Cơ sở {cs}</span>
                    </label>
                ))}
            </div>

            {/* Loại phòng */}
            <div>
                <p className="font-medium mb-2">Loại phòng</p>
                {["hoc", "hop"].map(lp => (
                    <label key={lp} className="flex items-center space-x-2 mb-1">
                        <input
                            type="checkbox"
                            checked={filters.loaiPhong.includes(lp)}
                            onChange={() => toggleCheckbox("loaiPhong", lp)}
                        />
                        <span>{lp === "hoc" ? "Phòng học" : "Phòng họp"}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Filter;
