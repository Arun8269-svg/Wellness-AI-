
import React, { useState, useEffect } from 'react';
import { AppTab, Meal, SleepEntry, Medication, Goal, WorkoutLog, HealthMetric, MetricEntry, Achievement, Appointment, MedicalRecord, BloodPressureEntry, GlucoseEntry, StepEntry } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import NutritionLogger from './components/NutritionLogger';
import WorkoutPlanner from './components/WorkoutPlanner';
import MindfulnessCorner from './components/MindfulnessCorner';
import SleepLogger from './components/SleepLogger';
import FormChecker from './components/FormChecker';
import AIChat from './components/AIChat';
import MedicationTracker from './components/MedicationTracker';
import HealthLibrary from './components/HealthLibrary';
import HealthMetricsTracker from './components/HealthMetricsTracker';
import WeeklyReport from './components/WeeklyReport';
import Profile from './components/Profile';
import Toast from './components/Toast';
import Appointments from './components/Appointments';
import MedicalRecords from './components/MedicalRecords';
import SymptomChecker from './components/SymptomChecker';
import BloodPressureTracker from './components/BloodPressureTracker';
import GlucoseTracker from './components/GlucoseTracker';
import StepTracker from './components/StepTracker';

const initialAchievements: Achievement[] = [
    { id: 'first_meal', title: 'First Bite', description: 'Log your first meal.', unlocked: false },
    { id: 'five_meals', title: 'Meal Planner', description: 'Log 5 meals.', unlocked: false },
    { id: 'first_workout', title: 'Getting Started', description: 'Log your first workout.', unlocked: false },
    { id: 'three_workouts', title: 'Fitness Fanatic', description: 'Log 3 workouts in a week.', unlocked: false },
    { id: 'streak_3', title: 'On a Roll!', description: 'Maintain a 3-day streak.', unlocked: false },
    { id: 'streak_7', title: 'Habit Builder', description: 'Maintain a 7-day streak.', unlocked: false },
];

const mockMedicalRecords: MedicalRecord = {
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    labResults: [
        { test: "Cholesterol", result: "210 mg/dL", date: "2023-10-15" },
        { test: "A1C", result: "6.8%", date: "2023-09-20" }
    ],
    immunizations: [
        { vaccine: "Influenza", date: "2023-10-05" },
        { vaccine: "COVID-19 Bivalent Booster", date: "2023-09-01" }
    ]
};


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Dashboard);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [goals, setGoals] = useState<Goal[]>([
      { id: 'steps', title: 'Daily Steps', current: 6210, target: 10000, unit: 'steps' },
      { id: 'water', title: 'Drink Water', current: 4, target: 8, unit: 'glasses' },
      { id: 'workout', title: 'Weekly Workouts', current: 1, target: 3, unit: 'sessions' },
  ]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [metricEntries, setMetricEntries] = useState<MetricEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords] = useState<MedicalRecord>(mockMedicalRecords);
  const [bpEntries, setBpEntries] = useState<BloodPressureEntry[]>([]);
  const [glucoseEntries, setGlucoseEntries] = useState<GlucoseEntry[]>([]);
  const [stepEntries, setStepEntries] = useState<StepEntry[]>([]);
  
  // New state for engagement features
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [streak, setStreak] = useState(0);
  const [toast, setToast] = useState({ message: '', show: false });

  // Theme management
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Mock data for new features
  useEffect(() => {
      // Generate some realistic mock data on initial load
      if (bpEntries.length === 0) {
            setBpEntries([
              { id: 'bp1', date: new Date(Date.now() - 3 * 86400000).toISOString(), systolic: 125, diastolic: 82, pulse: 75 },
              { id: 'bp2', date: new Date(Date.now() - 2 * 86400000).toISOString(), systolic: 122, diastolic: 80, pulse: 72 },
              { id: 'bp3', date: new Date(Date.now() - 1 * 86400000).toISOString(), systolic: 128, diastolic: 85, pulse: 78, note: "Feeling a bit stressed" },
            ]);
      }
      if (glucoseEntries.length === 0) {
          setGlucoseEntries([
              { id: 'g1', date: new Date(Date.now() - 2 * 86400000).toISOString(), level: 95, context: 'fasting' },
              { id: 'g2', date: new Date(Date.now() - 1 * 86400000).toISOString(), level: 135, context: 'post_meal', note: "After pasta" },
              { id: 'g3', date: new Date().toISOString(), level: 98, context: 'fasting' },
          ]);
      }
      if (stepEntries.length === 0) {
            const today = new Date().toISOString().split('T')[0];
            const mockData: StepEntry[] = [
                { id: 's1', date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], count: 8123 },
                { id: 's2', date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], count: 10234 },
                { id: 's3', date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], count: 7890 },
                { id: 's4', date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], count: 9540 },
            ];
            const initialTodaySteps = goals.find(g => g.id === 'steps')?.current || 0;
            if (!mockData.some(e => e.date === today)) {
                mockData.push({ id: 's5', date: today, count: initialTodaySteps });
            }
            setStepEntries(mockData);
        }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Streak and achievement logic
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastVisit = localStorage.getItem('lastVisit');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    
    const currentStreak = parseInt(localStorage.getItem('streak') || '0', 10);

    if (lastVisit === yesterdayStr) {
      setStreak(currentStreak + 1);
    } else if (lastVisit !== today) {
      setStreak(1); // Reset if not today or yesterday
    } else {
      setStreak(currentStreak); // Same day visit
    }
    
    localStorage.setItem('lastVisit', today);
    localStorage.setItem('streak', streak.toString());
    checkAchievements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak]);

  const showToast = (message: string) => {
      setToast({ message, show: true });
  };
  
  const checkAchievements = () => {
    setAchievements(prev => prev.map(ach => {
      if (ach.unlocked) return ach;
      let unlocked = false;
      switch (ach.id) {
        case 'first_meal': unlocked = meals.length >= 1; break;
        case 'five_meals': unlocked = meals.length >= 5; break;
        case 'first_workout': unlocked = workoutLogs.length >= 1; break;
        case 'three_workouts': unlocked = workoutLogs.length >= 3; break;
        case 'streak_3': unlocked = streak >= 3; break;
        case 'streak_7': unlocked = streak >= 7; break;
        default: break;
      }
      if (unlocked && !ach.unlocked) {
        showToast(`Achievement Unlocked: ${ach.title}`);
      }
      return { ...ach, unlocked };
    }));
  };
  
  useEffect(() => {
      checkAchievements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meals, workoutLogs, streak]);


  const addMeal = (meal: Meal) => {
    setMeals(prevMeals => [meal, ...prevMeals]);
    showToast("Meal logged successfully!");
  };

  const addSleepEntry = (newEntry: Omit<SleepEntry, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const entry: SleepEntry = { id: new Date().toISOString(), date: today, ...newEntry };
    setSleepEntries(prev => [entry, ...prev].sort((a,b) => b.date.localeCompare(a.date)));
    showToast("Sleep logged successfully!");
  }

  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const newMed: Medication = { id: new Date().toISOString(), ...medication };
    setMedications(prev => [newMed, ...prev]);
    showToast("Medication added!");
  };

  const logSteps = (count: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newCount = Math.max(0, count);

    setStepEntries(prev => {
        const todayEntry = prev.find(e => e.date === today);
        if (todayEntry) {
            return prev.map(e => e.date === today ? { ...e, count: newCount } : e);
        } else {
            return [...prev, { id: new Date().toISOString(), date: today, count: newCount }];
        }
    });

    setGoals(prevGoals => prevGoals.map(g => g.id === 'steps' ? { ...g, current: newCount } : g));
    showToast("Steps updated!");
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
      if (goalId === 'steps') {
          const stepGoal = goals.find(g => g.id === 'steps');
          if (stepGoal) {
              const newSteps = Math.max(0, stepGoal.current + amount);
              logSteps(newSteps);
          }
      } else {
          setGoals(prevGoals => prevGoals.map(g => g.id === goalId ? { ...g, current: Math.min(g.target, Math.max(0, g.current + amount)) } : g));
      }
  };

  const addWorkoutLog = (log: Omit<WorkoutLog, 'id' | 'date'>) => {
    const newLog: WorkoutLog = { id: new Date().toISOString(), date: new Date().toISOString().split('T')[0], ...log };
    setWorkoutLogs(prev => [newLog, ...prev]);
    updateGoalProgress('workout', 1);
    showToast("Workout session logged!");
  };

  const addMetric = (metric: Omit<HealthMetric, 'id'>) => {
      const newMetric: HealthMetric = { id: new Date().toISOString(), ...metric };
      setHealthMetrics(prev => [...prev, newMetric]);
      showToast("New metric added!");
  };

  const addMetricEntry = (entry: Omit<MetricEntry, 'id' | 'date'>) => {
      const newEntry: MetricEntry = { id: new Date().toISOString(), date: new Date().toISOString().split('T')[0], ...entry };
      setMetricEntries(prev => [newEntry, ...prev]);
      showToast("New entry logged!");
  }

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      id: new Date().toISOString(),
      status: 'upcoming',
      ...appointment
    };
    setAppointments(prev => [newAppointment, ...prev].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    showToast("Appointment successfully booked!");
  }

  const addBPEntry = (entry: Omit<BloodPressureEntry, 'id' | 'date'>) => {
    const newEntry: BloodPressureEntry = { id: new Date().toISOString(), date: new Date().toISOString(), ...entry };
    setBpEntries(prev => [...prev, newEntry]);
    showToast("Blood pressure reading saved!");
  };

  const addGlucoseEntry = (entry: Omit<GlucoseEntry, 'id' | 'date'>) => {
      const newEntry: GlucoseEntry = { id: new Date().toISOString(), date: new Date().toISOString(), ...entry };
      setGlucoseEntries(prev => [...prev, newEntry]);
      showToast("Glucose reading saved!");
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.Dashboard:
        return <Dashboard meals={meals} sleepEntries={sleepEntries} medications={medications} goals={goals} updateGoalProgress={updateGoalProgress} workoutLogs={workoutLogs} addWorkoutLog={addWorkoutLog} streak={streak} setActiveTab={setActiveTab} />;
      case AppTab.Nutrition:
        return <NutritionLogger meals={meals} addMeal={addMeal} />;
      case AppTab.Workouts:
        return <WorkoutPlanner />;
      case AppTab.Mindfulness:
        return <MindfulnessCorner />;
      case AppTab.Sleep:
        return <SleepLogger sleepEntries={sleepEntries} addSleepEntry={addSleepEntry} />;
      case AppTab.FormChecker:
        return <FormChecker />;
      case AppTab.AIChat:
        return <AIChat />;
      case AppTab.Medications:
        return <MedicationTracker medications={medications} addMedication={addMedication} />;
      case AppTab.Appointments:
        return <Appointments appointments={appointments} addAppointment={addAppointment} />;
      case AppTab.Records:
        return <MedicalRecords records={medicalRecords} />;
      case AppTab.SymptomChecker:
        return <SymptomChecker />;
      case AppTab.Learn:
        return <HealthLibrary />;
      case AppTab.Metrics:
        return <HealthMetricsTracker metrics={healthMetrics} entries={metricEntries} addMetric={addMetric} addEntry={addMetricEntry} />;
      case AppTab.Steps:
        const stepGoal = goals.find(g => g.id === 'steps')?.target || 10000;
        return <StepTracker entries={stepEntries} goal={stepGoal} logSteps={logSteps} />;
      case AppTab.BP:
        return <BloodPressureTracker entries={bpEntries} addEntry={addBPEntry} />;
      case AppTab.Glucose:
        return <GlucoseTracker entries={glucoseEntries} addEntry={addGlucoseEntry} />;
      case AppTab.Reports:
        return <WeeklyReport meals={meals} sleepEntries={sleepEntries} workoutLogs={workoutLogs} />;
      case AppTab.Profile:
        return <Profile theme={theme} setTheme={setTheme} achievements={achievements} />;
      default:
        return <Dashboard meals={meals} sleepEntries={sleepEntries} medications={medications} goals={goals} updateGoalProgress={updateGoalProgress} workoutLogs={workoutLogs} addWorkoutLog={addWorkoutLog} streak={streak} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="md:flex min-h-screen font-sans text-neutral dark:text-dark-neutral bg-base-100 dark:bg-dark-base-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        {renderContent()}
      </main>
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
};

export default App;
