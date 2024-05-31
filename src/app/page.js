'use client';

import { useEffect, useState } from 'react';
import { getWeatherInfo } from '@/lib/weather';
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import supabase from "@/lib/supabase/client"

export default function Home() {
    let [todolist, setTodolists] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    let [date, setDate] = useState(null);

    useEffect(() => {
        if(!date) return;
        const fetchTodos = async () => {
            setLoading(true);
            const formattedDate = formatDate(date);
            console.log('formattedDate', formattedDate);
            const { data, error } = await supabase
                .from('todolist').select('*').eq('date', formattedDate);

            console.log('data', data);
            if(error) {
                setError(error.message);
            } else {
                setTodolists(data);
            }
            setLoading(false);
        };

        fetchTodos();
    }, [date]);

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

        setLoading(false);
        fetchWeatherInfo();
    }, []);

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error.message}</div>;

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <div className="h-6 w-6">{weatherInfo.icon}</div>
                    <span>{weatherInfo.temp}°C</span>
                    <span>{weatherInfo.msg}</span>
                </div>
                <p className="text-sm">"즐거운 하루 보내세요."</p>
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    {todolist.length > 0 && (
                        <div className="space-y-1">
                            {todolist.map((todo) => (
                                <div key={todo.id} className="flex items-center">
                                    <Checkbox id={`task-${todo.id}`} />
                                    <label className="ml-2" htmlFor={`task-${todo.id}`}>
                                        {todo.text}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-4">

            </div>
            <div className="flex space-y-4">
                <Calendar className="border rounded-md" />
            </div>
        </div>
    );
}

function formatDate(date) {
    if(!date instanceof Date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
