import React, { useState } from 'react';
import { Dumbbell, History } from 'lucide-react';
import { Exercise, Workout } from './types';
import { ExerciseForm } from './components/ExerciseForm';
import { WorkoutHistory } from './components/WorkoutHistory';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('workouts', []);
  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSaveExercise = (exercise: Exercise) => {
    setCurrentExercises([...currentExercises, exercise]);
  };

  const handleFinishWorkout = () => {
    if (currentExercises.length === 0) return;

    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      date: workoutDate,
      exercises: currentExercises,
    };

    setWorkouts([newWorkout, ...workouts]);
    setCurrentExercises([]);
    setWorkoutDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Fitness Tracker</h1>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <History className="h-5 w-5 mr-2" />
              {showHistory ? 'New Workout' : 'History'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showHistory ? (
          <WorkoutHistory workouts={workouts} />
        ) : (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700">Workout Date</label>
              <input
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <ExerciseForm onSave={handleSaveExercise} />

            {currentExercises.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                <h2 className="text-lg font-semibold">Current Workout</h2>
                {currentExercises.map((exercise) => (
                  <div key={exercise.id} className="border-t pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{exercise.name}</h3>
                        {exercise.sets.map((set, index) => (
                          <p key={set.id} className="text-sm text-gray-600">
                            Set {index + 1}: {set.reps} reps @ {set.weight}kg
                          </p>
                        ))}
                        {exercise.category && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {exercise.category}
                          </span>
                        )}
                      </div>
                    </div>
                    {exercise.notes && (
                      <p className="mt-2 text-sm text-gray-600">{exercise.notes}</p>
                    )}
                  </div>
                ))}

                <button
                  onClick={handleFinishWorkout}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Finish Workout
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;