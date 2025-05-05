'use client';
import { useState } from 'react';

export default function ControlRoom() {
    const [lights, setLights] = useState(Array(8).fill(false));
    const [acs, setAcs] = useState([false, false]);
    const [speaker, setSpeaker] = useState(50);

    const toggleLight = (idx: number) => {
        setLights(lights => lights.map((v, i) => i === idx ? !v : v));
    };
    const toggleAc = (idx: number) => {
        setAcs(acs => acs.map((v, i) => i === idx ? !v : v));
    };

    return (
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Điều khiển phòng H1.101</h2>
            <div className="flex flex-col gap-6 w-full">
                <div>
                    <div className="font-semibold mb-2 flex items-center gap-2 text-yellow-600 text-lg">
                        <span>💡</span> 8 Bóng đèn
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {lights.map((on, idx) => (
                            <button
                                key={idx}
                                onClick={() => toggleLight(idx)}
                                className={`relative rounded-full w-12 h-12 flex items-center justify-center text-2xl border transition
                                    ${on ? 'bg-yellow-300 border-yellow-500 shadow text-yellow-900' : 'bg-gray-100 border-gray-300 text-gray-400'}`}
                                aria-label={`Bóng đèn ${idx + 1}`}
                            >
                                💡
                                <span className="absolute text-xs font-bold right-2 bottom-2">{idx + 1}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="font-semibold mb-2 flex items-center gap-2 text-blue-600 text-lg">
                        <span>❄️</span> 2 Máy lạnh
                    </div>
                    <div className="flex gap-4">
                        {acs.map((on, idx) => (
                            <button
                                key={idx}
                                onClick={() => toggleAc(idx)}
                                className={`rounded-full w-14 h-14 flex flex-col items-center justify-center text-2xl border transition
                                    ${on ? 'bg-blue-300 border-blue-500 shadow text-blue-900' : 'bg-gray-100 border-gray-300 text-gray-400'}`}
                                aria-label={`Máy lạnh ${idx + 1}`}
                            >
                                ❄️
                                <span className="text-xs font-bold mt-1">AC{idx + 1}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="font-semibold mb-2 flex items-center gap-2 text-gray-700 text-lg">
                        <span>🔊</span> Loa (0-100)
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={speaker}
                            onChange={e => setSpeaker(Number(e.target.value))}
                            className="w-40 accent-blue-500"
                        />
                        <span className="font-bold text-blue-700">{speaker}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}