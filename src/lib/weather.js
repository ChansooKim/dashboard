// lib/weather.js
'use server'

import axios from 'axios';
import { WiRain, WiSnow, WiDaySunny } from 'react-icons/wi';

export async function getWeatherInfo() {
    // const apiUrl = "http://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList";
    const apiUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
    const serviceKey = process.env.NEXT_PUBLIC_WEATHER_SERVICE_KEY;
    const baseDate = getYesterday();

    try {
        const res = await axios.get(`${apiUrl}?serviceKey=${serviceKey}&pageNo=1&numOfRows=12&dataType=JSON&base_date=${baseDate}&base_time=2000&nx=55&ny=127`);
        // const res = await axios.get(`${apiUrl}?serviceKey=${serviceKey}&dataType=JSON&dataCd=ASOS&dateCd=DAY&startDt=${baseDate}&endDt=${baseDate}&stnIds=108`);
        console.log('requestUrl : ' + `${apiUrl}?serviceKey=${serviceKey}&pageNo=1&numOfRows=12&dataType=JSON&base_date=${baseDate}&base_time=0500&nx=55&ny=127`);
        // console.log('requestUrl : ' + `${apiUrl}?serviceKey=${serviceKey}&dataType=JSON&dataCd=ASOS&dateCd=DAY&startDt=${baseDate}&endDt=${baseDate}&stnIds=108`);

        if (res.data.response.header.resultCode === '00') {
            let data = res.data.response.body.items;
            // 12개 항목으로 발표시간 별 데이터를 반환

            let tmpData = data.item[0];     // 기온

            let averageTemp = tmpData.fcstValue;  // 평균기온
            let isRainy;
            let isSnowy;
            // let isRainy = data.sumRn !== ''; // 강수
            // let isSnowy = data.ddMes !== ''; // 적설

            let icon, msg;
            if (isRainy) {
                msg = "강우";
                icon = <WiRain size="24px" />;
            } else if (isSnowy) {
                msg = "강설";
                icon = <WiSnow size="24px" />;
            } else {
                msg = "맑음";
                icon = <WiDaySunny size="24px" />;
            }
            return {
                temp: averageTemp,
                icon: icon,
                msg: msg,
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

function getYesterday() {
    const now = new Date();
    now.setDate(now.getDate());

    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    let day = String(now.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}