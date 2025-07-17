"use client";

import { useState, useEffect } from "react";

export default function SimpleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(false);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

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
        limit: '50'
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
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateString = currentDay.toISOString().split('T')[0];
      const dayDreams = dreams.filter(dream => {
        const dreamDate = new Date(dream.createdAt).toISOString().split('T')[0];
        return dreamDate === dateString;
      });

      days.push({
        date: new Date(currentDay),
        dayNumber: currentDay.getDate(),
        isCurrentMonth: currentDay.getMonth() === month,
        dreams: dayDreams,
        dateString: dateString
      });

      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();


  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">

    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        {/* Legend */}
        <div className="flex items-center gap-1 mt-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Lucide</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Cauchemar</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Autre</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">🎤</span>
            <span>Audio</span>
          </div>
        </div>
    </div>
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
            >
              ←
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm"
            >
              Aujourd'hui
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-4">
            <div className="text-gray-400">Chargement...</div>
          </div>
        )}

        {/* Calendar grid */}
        {!loading && (
          <>
            {/* Day of the week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    relative p-2 min-h-[50px] border border-slate-600 rounded-lg
                    ${day.isCurrentMonth ? 'bg-slate-700' : 'bg-slate-800 opacity-50'}
                    ${isToday(day.date) ? 'border-indigo-400 bg-indigo-900/20' : ''}
                  `}
                >

                  <div className={`text-sm font-medium ${
                    day.isCurrentMonth ? 'text-white' : 'text-gray-500'
                  }`}>
                    {day.dayNumber}
                  </div>


                  {day.dreams.length > 0 && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="flex items-center gap-1">
                        {day.dreams.slice(0, 3).map((dream, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              dream.type === 'lucide' ? 'bg-yellow-400' :
                              dream.type === 'cauchemar' ? 'bg-red-500' :
                              'bg-blue-400'
                            }`}
                          />
                        ))}
                        {day.dreams.length > 3 && (
                          <div className="text-xs text-gray-400">+{day.dreams.length - 3}</div>
                        )}
                        {day.dreams.some(dream => dream.audioNote) && (
                          <span className="text-xs">🎤</span>
                        )}
                      </div>
                    </div>
                  )}

                  {isToday(day.date) && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-400 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}