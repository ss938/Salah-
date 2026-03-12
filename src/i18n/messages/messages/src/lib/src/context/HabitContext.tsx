"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Task = { id: string; title: string; completed: boolean };
export type Habit = { id: string; title: string; completedDays: string[] };

interface HabitContextType {
  dailyTasks: Record<string, Task[]>;
  toggleTask: (date: string, taskId: string) => void;
  habits: Habit[];
  toggleHabit: (habitId: string, date: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const defaultTasks =[
  { id: '1', title: 'Morning Workout', completed: false },
  { id: '2', title: 'Read 10 Pages', completed: false },
  { id: '3', title: 'Drink 2L Water', completed: false },
];

const defaultHabits =[
  { id: 'h1', title: 'Wake up at 05:00', completedDays: [] },
  { id: 'h2', title: 'Gym', completedDays:[] },
  { id: 'h3', title: 'Budget Tracking', completedDays:[] },
  { id: 'h4', title: 'Cold Shower', completedDays:[] },
];

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [dailyTasks, setDailyTasks] = useState<Record<string, Task[]>>({});
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('habitGameTasks');
    const savedHabits = localStorage.getItem('habitGameHabits');
    if (savedTasks) setDailyTasks(JSON.parse(savedTasks));
    else {
      // Initialize with dummy data for the current week
      const initTasks: Record<string, Task[]> = {};
      for (let i = 1; i <= 5; i++) {
        initTasks[`day-${i}`] = defaultTasks.map(t => ({ ...t, completed: Math.random() > 0.5 }));
      }
      setDailyTasks(initTasks);
    }
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    else setHabits(defaultHabits);
    setIsLoaded(true);
  },[]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('habitGameTasks', JSON.stringify(dailyTasks));
      localStorage.setItem('habitGameHabits', JSON.stringify(habits));
    }
  },[dailyTasks, habits, isLoaded]);

  const toggleTask = (date: string, taskId: string) => {
    setDailyTasks(prev => ({
      ...prev,
      [date]: prev[date].map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const hasDay = h.completedDays.includes(date);
        return { ...h, completedDays: hasDay ? h.completedDays.filter(d => d !== date) : [...h.completedDays, date] };
      }
      return h;
    }));
  };

  return (
    <HabitContext.Provider value={{ dailyTasks, toggleTask, habits, toggleHabit }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabits must be used within HabitProvider");
  return context;
};
