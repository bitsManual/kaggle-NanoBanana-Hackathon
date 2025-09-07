import React from 'react';
import { MORALS } from '../constants';
import { Moral } from '../types';

interface MoralSelectorProps {
  selectedMoral: Moral;
  setSelectedMoral: (moral: Moral) => void;
}

const MoralSelector: React.FC<MoralSelectorProps> = ({ selectedMoral, setSelectedMoral }) => {
  const topMorals = MORALS.slice(0, 6);
  const moreMorals = MORALS.slice(6);

  const isMoreMoralSelected = moreMorals.some(m => m.title === selectedMoral.title);

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const moralTitle = event.target.value;
    if (moralTitle) {
      const newMoral = MORALS.find(m => m.title === moralTitle);
      if (newMoral) {
        setSelectedMoral(newMoral);
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <h3 className="text-sm font-medium text-stone-700 mb-2 text-center">Choose a Moral for the Story</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {topMorals.map((moral) => (
          <button
            key={moral.title}
            onClick={() => setSelectedMoral(moral)}
            className={`p-3 border rounded-lg text-center transition-all duration-200 shadow-sm ${
              selectedMoral.title === moral.title
                ? 'bg-rose-500 text-white ring-2 ring-offset-2 ring-rose-500 transform scale-105'
                : 'bg-white hover:bg-rose-50 text-stone-700'
            }`}
          >
            <span className="text-2xl">{moral.emoji}</span>
            <p className="font-semibold text-sm mt-1">{moral.title}</p>
          </button>
        ))}
      </div>
      <div className="mt-4">
        <label htmlFor="more-morals" className="sr-only">More Morals</label>
        <select
          id="more-morals"
          value={isMoreMoralSelected ? selectedMoral.title : ""}
          onChange={handleDropdownChange}
          className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg shadow-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
          aria-label="Select additional morals"
        >
          <option value="" disabled>Or choose from more options...</option>
          {moreMorals.map((moral) => (
            <option key={moral.title} value={moral.title}>
              {moral.emoji} {moral.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MoralSelector;