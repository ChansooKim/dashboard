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
import { ko } from "date-fns/locale/ko";

export default function Home() {
    let [todolist, setTodolists] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    let [date, setDate] = useState(null);
    let [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if(!date) return;
        const fetchTodos = async () => {
            setLoading(true);
            const formattedDate = formatDate(date);
            console.log('formattedDate', formattedDate);
            const { data, error } = await supabase
                .from('todolist').select('*').eq('date', formattedDate);

            if(error) {
                setError(error.message);
            } else {
                setTodolists(data);
            }
            setLoading(false);
        };

        fetchTodos();
    }, [date]);

    // 날짜 선택 후 Popover 닫기
    const handleDateSelect = (selectedDate) => {
        setDate(selectedDate);
        setIsOpen(false);
    };

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

    /*if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error.message}</div>;*/

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <div className="h-6 w-6">{weatherInfo.icon}</div>
                    <span>{weatherInfo.temp}°C</span>
                    <span>{weatherInfo.msg}</span>
                </div>
                <p className="text-sm">"즐거운 하루 보내세요."</p>
                <div className="space-y-4">   {/*여백*/}
                     {/*TODO 추가/수정버튼*/}
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[180px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                                onClick={() => setIsOpen(true)}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "yyyy-MM-dd") : <span>날짜를 선택하세요</span>}

                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                locale={ko}
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    {todolist.length > 0 && (
                        <div className="items-top flex space-x-5">
                            {todolist.map((todo) => (
                                <div key={todo.id} className="flext items-top flex space-x-2">
                                    <Checkbox
                                        id={`task-${todo.id}`}
                                        checked={todo.complete}
                                        onChange={(e)=>handleCheckboxChange(todo.id, e.target.checked)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                    <label htmlFor={`task-${todo.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {todo.title}
                                    </label>
                                    <p className="text-sm text-muted-foreground">{todo.text}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-4">

            </div>
            <div className="flex space-y-4">
                {/*TODO 달력이 현재로서는 큰 의미가 없는 것 같음.. 상단 날짜 선택 또는 달력 아이콘을 배치해서, 클릭 시 hovering되게 수정*/}
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

function handleCheckboxChange(id, checked) {
    console.log('Handleing Checkbox ==> id : '+id+'checked : '+checked);
}


