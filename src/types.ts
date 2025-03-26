export interface Set {
  id: string;
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
  category?: string;
}

export interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
}

export type Category = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio' | 'Other';