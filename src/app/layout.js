"use client";

import {useState} from "react";
import "./globals.css";
import {Button} from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {ko} from "date-fns/locale/ko";


export default function RootLayout({ children }) {
  const { formattedDate, formattedTime} = getFormattedDate();
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <html lang="en">
      <body>
        {/*NavBar*/}
        {/*TODO className 을 이렇게 늘어뜨려놓으면 어떤 의미인지 확인, 전부 내가 선언한 css로 변경할거임*/}
        <div className="flex flex-col w-full max-w-4xl mx-auto">
          <div className="flex justify-between p-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="space-x-4" style={{position: "relative"}}>
              <Button variant="outline" onClick={toggleModal}>
                {formattedDate}
              </Button>
              {showModal && (
                  <div className="modal-overlay rounded-3xl">
                    <div className="modal-content">
                      <Calendar locale={ko} className="border rounded-md" />
                    </div>
                  </div>
              )}
              <Button>{formattedTime}</Button>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 border-b"></div>

          { children }
        </div>
      </body>
    </html>
  );
}

/**
 * 현재 날짜, 현재 시간 return
 * @returns {{formattedDate: string, formattedTime: string}}
 */
function getFormattedDate() {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const day = daysOfWeek[now.getDay()];

  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? '오후' : '오전';
  const formattedHours = hours % 12 || 12; // 0시를 12시로 표현

  const formattedDate = `${month}월 ${date}일 (${day})`;
  const formattedTime = `${period} ${formattedHours}:${minutes}`;

  return { formattedDate, formattedTime };
}