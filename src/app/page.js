'use client';

import { useEffect, useState } from 'react';
import { getWeatherInfo } from '@/lib/weather';

export default function Home() {
    const [weatherInfo, setWeatherInfo] = useState({
        temp: null,
        icon: null,
        msg: null,
    });

    useEffect(() => {
        const fetchWeatherInfo = async () => {
            const weatherData = await getWeatherInfo();
            setWeatherInfo(weatherData);
        };

        fetchWeatherInfo();
    }, []);

    if (!weatherInfo.temp) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <div className="h-6 w-6">{weatherInfo.icon}</div>
                    <span>{weatherInfo.temp}°C</span>
                    <span>{weatherInfo.msg}</span>
                </div>
                <p className="text-sm">"즐거운 하루 보내세요."</p>
            </div>
        </div>
    );
}