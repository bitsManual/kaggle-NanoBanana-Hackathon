
import React from 'react';
import { MORALS } from '../constants';
import { Moral } from '../types';

interface MoralSelectorProps {
  selectedMoral: Moral;
  setSelectedMoral: (moral: Moral) => void;
}

const MoralSelector: React.FC<MoralSelectorProps> = ({ selectedMoral, setSelectedMoral }) => {
  return (
    <div className="w-full max-w-md">
      <h3 className="text-sm font-medium text-stone-700 mb-2 text-center">Choose a Moral for the Story</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {MORALS.map((moral) => (
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
    </div>
  );
};

export default MoralSelector;
