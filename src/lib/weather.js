// lib/weather.js
'use server'

import axios from 'axios';
import { WiRain, WiSnow, WiDaySunny, WiCloud, WiCloudy } from 'react-icons/wi';

export async function getWeatherInfo() {
    const apiUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
    const serviceKey = process.env.NEXT_PUBLIC_WEATHER_SERVICE_KEY;
    let baseDate = getToday();
    let currentTime = getBaseTime();

    // 당일의 예보가 발표되지 않은 상태라면, 전날의 마지막 예보를 사용
    if(!currentTime) {
        baseDate = String(baseDate - 1);
        currentTime = "2300";
    }

    const nx = 59;      // 예보지점 X좌표 (오픈API 위경도 격자 참조)
    const ny = 125;     // 예보지점 Y좌표

    try {
        const res =
            await axios.get(`${apiUrl}?serviceKey=${serviceKey}&pageNo=1&numOfRows=12&dataType=JSON&base_date=${baseDate}&base_time=${currentTime}&nx=${nx}&ny=${ny}`);
        if (res.data.response.header.resultCode === '00') {
            let data = res.data.response.body.items;
            // 12개 항목으로 발표시간 별 데이터를 반환
            let tmp;    // 1시간 기온(°C)
            let pop;    // 강수확률(%)
            let sky;    // 하늘상태 코드 : 맑음(1), 구름많음(3), 흐림(4)
            let pty;    // 강수형태 코드 : 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)

            for(let item of data.item) {
                if(item.category === 'TMP') {
                    tmp = item.fcstValue;
                } else if(item.category === 'POP') {
                    pop = item.fcstValue;
                } else if(item.category === 'SKY') {
                    switch (item.fcstValue) {
                        case '1':
                            sky = '맑음'; break;
                        case '3':
                            sky = '구름많음'; break;
                        case '4':
                            sky = '흐림'; break;
                        default:
                            sky = '모름';
                    }
                } else if(item.category === 'PTY') {
                    switch (item.fcstValue) {
                        case '0':
                            pty = '없음'; break;
                        case '1':
                            pty = '비'; break;
                        case '2':
                            pty = '비/눈'; break;
                        case '3':
                            pty = '눈'; break;
                        case '4':
                            pty = '소나기'; break;
                        default:
                            pty = '없음';
                    }
                }
            }

            let icon;
            if(pty === '눈' || pty === '비/눈') {
                icon = <WiSnow size="24px" />;
            } else if(pty === '비') {
                icon = <WiRain size="24px" />;
            } else if(sky === '구름많음') {
                icon = <WiCloudy size="24px" />;
            } else if(sky === '흐림') {
                icon = <WiCloud size="24px" />;
            } else {
                icon = <WiDaySunny size="24px" />;
            }

            return {
                temp: tmp,
                icon: icon,
                msg: sky.concat(' / ').concat(pty),
            };
        } else {
            console.warn('No Data');
            return {
                temp: 'N/A',
                icon: <WiDaySunny size="24px" />,
                msg: '데이터 없음',
            };
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return {
            temp: 'N/A',
            icon: <WiDaySunny size="24px" />,
            msg: '데이터 없음',
        };
    }
}

function getToday() {
    const now = new Date();
    now.setDate(now.getDate());

    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    let day = String(now.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}

function getBaseTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    let currentTime = hours * 100 + minutes;

    // 단기예보 - Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
    const availableTimes = ["200", "500", "800", "1100", "1400", "1700", "2000", "2300"];

    // 현재 시간에서 가장 가까운 시간 선택
    let closestTime = availableTimes.reduce((prev, curr) => {
        return Math.abs(curr - currentTime) < Math.abs(prev - currentTime) ? curr : prev;
    });

    // 현재 시간이 넘지 않는다면, 이전 시간 선택
    if (closestTime > currentTime) {
        const index = availableTimes.indexOf(closestTime);
        closestTime = availableTimes[index - 1];
    }

    return closestTime;
}