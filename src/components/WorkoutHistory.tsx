import React from 'react';
import { Workout } from '../types';
import { formatDate } from '../utils';

interface WorkoutHistoryProps {
  workouts: Workout[];
  onEditWorkout?: (workout: Workout) => void;
}

export function WorkoutHistory({ workouts, onEditWorkout }: WorkoutHistoryProps) {
  return (
    <div className="space-y-6">
      {workouts.map((workout) => (
        <div key={workout.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{formatDate(workout.date)}</h3>
            {onEditWorkout && (
              <button
                onClick={() => onEditWorkout(workout)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            )}
          </div>
          <div className="space-y-4">
            {workout.exercises.map((exercise) => (
              <div key={exercise.id} className="border-t pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
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
          </div>
        </div>
      ))}
    </div>
  );
}