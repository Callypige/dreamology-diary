"use client";

import { Dream } from "@/types/Dream";
import { useState, useEffect } from "react";

export default function Calendar({ onDateSelected }: { 
  onDateSelected?: (date: Date, dreams: Dream[]) => void 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  // Click handler for day selection
  const handleDayClick = (selectedDate: Date) => {
  if (onDateSelected) {
    onDateSelected(selectedDate, []); 
    }
  }

  useEffect(() => {
    fetchDreams();
  }, [currentDate]);

  const fetchDreams = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const params = new URLSearchParams({
        startDate: firstDay.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0],
        limit: '100'
      });

      const res = await fetch(`${baseUrl}/api/dreams?${params.toString()}`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setDreams(data.body || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rêves:", error);
    } finally {
      setLoading(false);
    }
  };

    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const days = [];
      const currentDay = new Date(startDate);
      
      for (let i = 0; i < 42; i++) {
        // VERSION CORRIGÉE - éviter les fuseaux horaires
        const year = currentDay.getFullYear();
        const month = (currentDay.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDay.getDate().toString().padStart(2, '0');
        const dateString = `${year}-${month}-${day}`; // "2025-07-10"
        
        const dayDreams = dreams.filter(dream => {
          const dreamDateString = dream.date.split('T')[0]; // "2025-07-10"
          return dreamDateString === dateString;
        });

        days.push({
          date: new Date(currentDay),
          dayNumber: currentDay.getDate(),
          isCurrentMonth: currentDay.getMonth() === currentDate.getMonth(),
          dreams: dayDreams,
          dateString: dateString
        });

        currentDay.setDate(currentDay.getDate() + 1);
      }

      return days;
    };

  const calendarDays = generateCalendarDays();

  const goToPreviousMonth = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      setIsTransitioning(false);
    }, 150); // Délai court pour la transition
  };

  const goToNextMonth = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      setIsTransitioning(false);
    }, 150);
  };

  const goToToday = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(new Date());
      setIsTransitioning(false);
    }, 150);
  };


  const isToday = (date: Date) : boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="w-full mb-6 overflow-hidden"> 
      <div className="bg-slate-800 rounded-xl p-2 md:p-4 border border-slate-700">
        
        <div className="flex items-center justify-between mb-3 min-h-[40px]">
          <h2 className="text-sm md:text-xl font-bold text-white truncate flex-1 mr-2">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={goToPreviousMonth}
              disabled={isTransitioning}
              className="p-1.5 md:p-2 rounded-md bg-slate-700 text-white hover:bg-slate-600 transition-colors disabled:opacity-50 touch-manipulation text-sm"
            >
              ←
            </button>
            <button
              onClick={goToToday}
              disabled={isTransitioning}
              className="px-1.5 md:px-3 py-1.5 md:py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-xs disabled:opacity-50 touch-manipulation whitespace-nowrap"
            >
              Auj.
            </button>
            <button
              onClick={goToNextMonth}
              disabled={isTransitioning}
              className="p-1.5 md:p-2 rounded-md bg-slate-700 text-white hover:bg-slate-600 transition-colors disabled:opacity-50 touch-manipulation text-sm"
            >
              →
            </button>
          </div>
        </div>

        {loading && (
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Chargement...</div>
          </div>
        )}

        {!loading && (
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day, index) => (
                <div key={index} className="p-1 md:p-2 text-center text-xs md:text-sm font-medium text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 md:gap-1 min-h-[180px] md:min-h-[280px]">
              {calendarDays.map((day, index) => (
               <div
                key={`${day.dateString}-${index}`}
                className={`
                  relative p-0.5 md:p-2 min-h-[24px] md:min-h-[40px] border border-slate-600 rounded-sm md:rounded-md text-center overflow-hidden
                  cursor-pointer select-none touch-manipulation
                  ${day.isCurrentMonth ? 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500' : 'bg-slate-800 opacity-50 hover:opacity-75'}
                  ${isToday(day.date) ? 'border-indigo-400 bg-indigo-900/20' : ''}
                  transition-all duration-200 hover:shadow-md
                `}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🖱️ onClick déclenché pour le jour:', day.dayNumber);
                  handleDayClick(day.date);
                }}
                onMouseEnter={() => console.log('🐭 Hover sur le jour:', day.dayNumber)}
                >

                  <div className={`text-[10px] md:text-sm font-medium leading-tight ${
                      day.isCurrentMonth ? 'text-white' : 'text-gray-500'
                    }`}>
                      {day.dayNumber}
                  </div>

                  {day.dreams.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
                      <div className="flex items-center gap-0.5">
                        {day.dreams.slice(0, 1).map((dream, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${
                              dream.type === 'lucide' ? 'bg-yellow-400' :
                              dream.type === 'cauchemar' ? 'bg-red-500' :
                              dream.type === 'autre' ? 'bg-blue-400' : 'bg-zinc-500'
                            }`}
                          />
                        ))}
                        {day.dreams.length > 1 && (
                          <div className="text-[6px] md:text-xs text-gray-400">+</div>
                        )}
                        {day.dreams.some(dream => dream.audioNote) && (
                          <span className="text-[6px] md:text-xs">🎤</span>
                        )}
                      </div>
                    </div>
                  )}
                  {isToday(day.date) && (
                    <div className="absolute top-0 right-0 w-1 h-1 md:w-2 md:h-2 bg-slate-100 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4 mt-3 text-xs md:text-sm text-gray-300 overflow-x-auto">
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full"></div>
            <span>Lucide</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full"></div>
            <span>Cauchemar</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full"></div>
            <span>Autre</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs">🎤</span>
            <span>Audio</span>
          </div>
        </div>
      </div>
    </div>
  );
}