
import React, { useState, useCallback } from 'react';
import { MORALS } from './constants';
import { Moral, AppState, GeneratedPage } from './types';
import CharacterForm from './components/CharacterForm';
import MoralSelector from './components/MoralSelector';
import Loader from './components/Loader';
import Storybook from './components/Storybook';
import { generateStoryPlot, generateInitialImage, editImage } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Setup);
  const [childName, setChildName] = useState('');
  const [petName, setPetName] = useState('');
  const [selectedMoral, setSelectedMoral] = useState<Moral>(MORALS[0]);
  const [generatedPages, setGeneratedPages] = useState<GeneratedPage[]>([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartOver = () => {
    setAppState(AppState.Setup);
    setChildName('');
    setPetName('');
    setSelectedMoral(MORALS[0]);
    setGeneratedPages([]);
    setErrorMessage('');
  };

  const handleGenerateStory = useCallback(async () => {
    if (!childName.trim() || !petName.trim()) {
      setErrorMessage('Please enter names for the child and pet.');
      setAppState(AppState.Error);
      return;
    }
    setAppState(AppState.Loading);
    setErrorMessage('');

    try {
      setLoadingMessage(`Thinking of a magical story for ${childName}...`);
      const plot = await generateStoryPlot(childName, petName, selectedMoral);

      let currentImage: { base64: string; mimeType: string } | null = null;
      const pages: GeneratedPage[] = [];

      for (const storyPage of plot) {
        setLoadingMessage(`Illustrating page ${storyPage.page} of ${plot.length}...`);
        if (storyPage.page === 1) {
          currentImage = await generateInitialImage(storyPage.imagePrompt);
        } else if (currentImage) {
          currentImage = await editImage(currentImage.base64, currentImage.mimeType, storyPage.imagePrompt);
        }

        if (!currentImage) throw new Error("Image generation failed.");
        
        pages.push({
          page: storyPage.page,
          text: storyPage.text,
          imageUrl: `data:${currentImage.mimeType};base64,${currentImage.base64}`
        });
      }

      setGeneratedPages(pages);
      setAppState(AppState.Storybook);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error(error);
      setErrorMessage(message);
      setAppState(AppState.Error);
    }
  }, [childName, petName, selectedMoral]);

  const renderContent = () => {
    switch (appState) {
      case AppState.Loading:
        return <Loader message={loadingMessage} />;
      case AppState.Storybook:
        return <Storybook pages={generatedPages} onStartOver={handleStartOver} />;
      case AppState.Error:
        return (
          <div className="text-center p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h2>
            <p className="text-stone-600 mb-6">{errorMessage}</p>
            <button
              onClick={handleStartOver}
              className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-full shadow-lg hover:bg-amber-600 transition"
            >
              Try Again
            </button>
          </div>
        );
      case AppState.Setup:
      default:
        return (
          <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-stone-800" style={{ fontFamily: 'serif' }}>Moral Tales</h1>
              <p className="mt-2 text-stone-600">Create a personalized, illustrated story for your child.</p>
            </div>
            <CharacterForm
              childName={childName}
              setChildName={setChildName}
              petName={petName}
              setPetName={setPetName}
            />
            <MoralSelector selectedMoral={selectedMoral} setSelectedMoral={setSelectedMoral} />
            <button
              onClick={handleGenerateStory}
              disabled={!childName.trim() || !petName.trim()}
              className="w-full py-3 bg-rose-500 text-white font-bold rounded-full shadow-lg hover:bg-rose-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              Create My Storybook
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-amber-50 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
