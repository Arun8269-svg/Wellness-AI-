export enum AppTab {
  Dashboard = "Dashboard",
  Nutrition = "Nutrition",
  Workouts = "Workouts",
  Mindfulness = "Mindfulness",
  Sleep = "Sleep",
  FormChecker = "Form Checker",
  AIChat = "AI Chat",
  Medications = "Medications",
  Appointments = "Appointments",
  Records = "Records",
  SymptomChecker = "Symptom Checker",
  Learn = "Learn",
  Metrics = "Metrics",
  Steps = "Steps",
  BP = "Blood Pressure",
  Glucose = "Glucose",
  Reports = "Reports",
  Profile = "Profile",
}

export interface Meal {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export type WorkoutPlan = WorkoutDay[];

export interface SleepEntry {
    id: string;
    date: string;
    duration: number; // in hours
    quality: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface Recipe {
    recipeName: string;
    ingredients: string[];
    instructions: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'as_needed';
  description?: string;
}

export interface Goal {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  type: string;
  duration: number; // in minutes
}

export interface HealthMetric {
  id: string;
  name: string;
  unit: string;
}

export interface MetricEntry {
  id:string;
  metricId: string;
  value: number;
  date: string;
  note?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  reason: string;
  status: 'upcoming' | 'completed';
}

export interface MedicalRecord {
  allergies: string[];
  conditions: string[];
  labResults: { test: string; result: string; date: string; }[];
  immunizations: { vaccine: string; date: string; }[];
}

export interface BloodPressureEntry {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  note?: string;
}

export interface GlucoseEntry {
  id: string;
  date: string;
  level: number;
  context: 'fasting' | 'post_meal' | 'random';
  note?: string;
}

export interface StepEntry {
  id: string;
  date: string;
  count: number;
}
