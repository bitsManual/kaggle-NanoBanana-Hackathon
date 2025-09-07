
import React from 'react';

interface CharacterFormProps {
  childName: string;
  setChildName: (name: string) => void;
  petName: string;
  setPetName: (name: string) => void;
  childImage: string | null;
  petImage: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'child' | 'pet') => void;
  clearImage: (type: 'child' | 'pet') => void;
}

const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ImageUploader: React.FC<{
  id: string;
  image: string | null;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}> = ({ id, image, onUpload, onClear }) => {
  return (
    <div className="relative w-16 h-16">
      {image ? (
        <>
          <img src={image} alt="Upload preview" className="w-full h-full object-cover rounded-full shadow-md" />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-1 -right-1 bg-white rounded-full text-stone-500 hover:text-rose-500 transition"
            aria-label="Clear image"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </>
      ) : (
        <>
          <label
            htmlFor={id}
            className="w-full h-full flex items-center justify-center bg-white border-2 border-dashed border-stone-300 rounded-full cursor-pointer hover:border-rose-400 hover:text-rose-400 text-stone-400 transition"
          >
            <CameraIcon className="w-8 h-8" />
            <span className="sr-only">Upload image</span>
          </label>
          <input
            type="file"
            id={id}
            accept="image/png, image/jpeg"
            onChange={onUpload}
            className="sr-only"
          />
        </>
      )}
    </div>
  );
};


const CharacterForm: React.FC<CharacterFormProps> = ({ 
  childName, setChildName, petName, setPetName,
  childImage, petImage, handleImageUpload, clearImage
}) => {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
        <div className="w-full">
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
        <ImageUploader 
          id="child-image-upload"
          image={childImage}
          onUpload={(e) => handleImageUpload(e, 'child')}
          onClear={() => clearImage('child')}
        />
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
        <div className="w-full">
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
        <ImageUploader
          id="pet-image-upload"
          image={petImage}
          onUpload={(e) => handleImageUpload(e, 'pet')}
          onClear={() => clearImage('pet')}
        />
      </div>
    </div>
  );
};

export default CharacterForm;
