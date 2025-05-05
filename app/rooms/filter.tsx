'use client';

import React, { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";

export type FilterState = {
    _id: string;
    name: string;
    coSo: string[];
    sucChua: string[];
    chatLuong: string[];
};

type FilterProps = {
    onFilterChange: (filters: FilterState) => void;
};

const Filter = ({ onFilterChange }: FilterProps) => {
    const [filters, setFilters] = useState<FilterState>({
        _id: "",
        name: "",
        coSo: [],
        sucChua: [],
        chatLuong: [],
    });

    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const toggleCheckbox = (key: keyof FilterState, value: string) => {
        setFilters((prev) => {
            const currentValues = prev[key] as string[];
            const updated = prev[key].includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...prev[key], value];
            return { ...prev, [key]: updated };
        });
    };

    const CheckboxGroup = (
        title: string,
        key: keyof FilterState,
        options: string[]
    ) => (
        <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="space-y-1">
                {options.map((opt) => (
                    <label key={opt} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={filters[key].includes(opt)}
                            onChange={() => toggleCheckbox(key, opt)}
                            className="accent-rose-600"
                        />
                        <span>{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (

        <div className="bg-white shadow rounded-2xl p-4 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                <SlidersHorizontal size={20} /> Bộ lọc
            </h2>
            {CheckboxGroup("Cơ sở", "coSo", ["1", "2"])}
            {CheckboxGroup("Sức chứa", "sucChua", ["10", "20", "40"])}
            {CheckboxGroup("Chất lượng", "chatLuong", ["1", "2", "3"])}
        </div>
    );
};

export default Filter;
