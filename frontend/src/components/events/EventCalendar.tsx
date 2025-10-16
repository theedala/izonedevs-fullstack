import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
interface Event {
  id: string;
  title: string;
  date: Date;
  category: string;
}
interface EventCalendarProps {
  events: Event[];
  onSelectDate: (date: Date) => void;
  className?: string;
}
const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  onSelectDate,
  className = ''
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
      // Check if there are events on this day
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      });
      days.push(<div key={day} className={`h-10 flex flex-col items-center justify-center rounded-lg cursor-pointer relative
            ${isToday ? 'bg-primary text-white' : dayEvents.length > 0 ? 'hover:bg-dark-light' : 'hover:bg-dark-lighter'}`} onClick={() => onSelectDate(date)}>
          <span>{day}</span>
          {dayEvents.length > 0 && <div className="absolute bottom-1 flex space-x-1">
              {dayEvents.slice(0, 3).map((event, index) => <div key={index} className="w-1.5 h-1.5 rounded-full bg-secondary" title={event.title}></div>)}
              {dayEvents.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>}
            </div>}
        </div>);
    }
    return days;
  };
  return <div className={`bg-dark-lighter p-6 rounded-lg border border-neutral/20 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Events Calendar</h3>
        <div className="flex items-center space-x-4">
          <button onClick={goToPreviousMonth} className="p-1 rounded-full hover:bg-dark-light" aria-label="Previous month">
            <ChevronLeftIcon size={20} />
          </button>
          <span className="font-medium">
            {MONTHS[currentMonth]} {currentYear}
          </span>
          <button onClick={goToNextMonth} className="p-1 rounded-full hover:bg-dark-light" aria-label="Next month">
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS.map(day => <div key={day} className="text-center text-sm font-medium text-white/60">
            {day}
          </div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
    </div>;
};
export default EventCalendar;