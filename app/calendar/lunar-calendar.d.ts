declare module 'lunar-calendar' {
    interface LunarDate {
        lunarYear: number;
        lunarMonth: number;
        lunarDay: number;
        isLeap: boolean;
        zodiac: string;
        ganZhiYear: string;
        ganZhiMonth: string;
        ganZhiDay: string;
    }

    const lunar: {
        solarToLunar: (year: number, month: number, day: number) => LunarDate;
    };

    export default lunar;
}
