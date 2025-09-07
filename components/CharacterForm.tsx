
import React from 'react';

interface CharacterFormProps {
  childName: string;
  setChildName: (name: string) => void;
  petName: string;
  setPetName: (name: string) => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ childName, setChildName, petName, setPetName }) => {
  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label htmlFor="childName" className="block text-sm font-medium text-stone-700 mb-1">
          Child's Name
        </label>
        <input
          type="text"
          id="childName"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="e.g., Lily"
          className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg shadow-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
        />
      </div>
      <div>
        <label htmlFor="petName" className="block text-sm font-medium text-stone-700 mb-1">
          Pet's Name
        </label>
        <input
          type="text"
          id="petName"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="e.g., Buster"
          className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg shadow-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
        />
      </div>
    </div>
  );
};

export default CharacterForm;
