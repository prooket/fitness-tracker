import React, { useState } from 'react';
import { PlusCircle, Plus, Trash2 } from 'lucide-react';
import { Exercise, Category, Set } from '../types';
import { NumberPicker } from './NumberPicker';

interface ExerciseFormProps {
  onSave: (exercise: Exercise) => void;
}

const categories: Category[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'];

const createNewSet = (): Set => ({
  id: crypto.randomUUID(),
  reps: 10,
  weight: 0,
});

export function ExerciseForm({ onSave }: ExerciseFormProps) {
  const [exercise, setExercise] = useState<Partial<Exercise>>({
    name: '',
    sets: [createNewSet()],
    category: 'Other'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...exercise,
      id: crypto.randomUUID(),
    } as Exercise);
    setExercise({
      name: '',
      sets: [createNewSet()],
      category: 'Other'
    });
  };

  const addSet = () => {
    setExercise(prev => ({
      ...prev,
      sets: [...(prev.sets || []), createNewSet()]
    }));
  };

  const removeSet = (setId: string) => {
    setExercise(prev => ({
      ...prev,
      sets: (prev.sets || []).filter(set => set.id !== setId)
    }));
  };

  const updateSet = (setId: string, field: keyof Set, value: number) => {
    setExercise(prev => ({
      ...prev,
      sets: (prev.sets || []).map(set =>
        set.id === setId ? { ...set, [field]: value } : set
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700">Exercise Name</label>
        <input
          type="text"
          required
          value={exercise.name}
          onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., Bench Press"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={exercise.category}
          onChange={(e) => setExercise({ ...exercise, category: e.target.value as Category })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Sets</h3>
          <button
            type="button"
            onClick={addSet}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Set
          </button>
        </div>

        <div className="space-y-4">
          {exercise.sets?.map((set, index) => (
            <div key={set.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-none">
                <span className="text-sm font-medium text-gray-500">Set {index + 1}</span>
              </div>
              <div className="flex-1 flex items-center justify-around">
                <NumberPicker
                  label="Reps"
                  value={set.reps}
                  onChange={(value) => updateSet(set.id, 'reps', value)}
                  min={1}
                  max={100}
                />
                <NumberPicker
                  label="Weight (kg)"
                  value={set.weight}
                  onChange={(value) => updateSet(set.id, 'weight', value)}
                  min={0}
                  max={500}
                  step={0.5}
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeSet(set.id)}
                  className="flex-none p-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={exercise.notes || ''}
          onChange={(e) => setExercise({ ...exercise, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          placeholder="Optional notes about the exercise..."
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add Exercise
      </button>
    </form>
  );
}