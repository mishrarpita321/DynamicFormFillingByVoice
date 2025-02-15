import React, { useContext, useState } from 'react';
import { Box } from '@mui/material';
import { ENGLISH_LANGUAGE_CODE, ENGLISH_LANGUAGE_NAME, GERMAN_LANGUAGE_CODE, GERMAN_LANGUAGE_NAME, WELCOME_MESSAGE_DE, WELCOME_MESSAGE_EN } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import { FormContext } from '../../context/Context';
import axios from 'axios';

const VoiceInputButton: React.FC = () => {
  const formContext = useContext(FormContext);
  if (!formContext) {
    throw new Error("parseJson must be used within a FormProvider");
  }
  const { isPlaying, setIsPlaying, language } = formContext;
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const navigate = useNavigate();

  const preloadAudio = async () => {
    try {
      const t2sEndPoint = `https://data-fetching-proxy-ai.vercel.app/makeTextToSpeechCall`;
      const payload = {
        audioConfig: { audioEncoding: "MP3" },
        input: { text: language === 'en' ? WELCOME_MESSAGE_EN : WELCOME_MESSAGE_DE },
        voice: { languageCode: language === 'en' ? ENGLISH_LANGUAGE_CODE : GERMAN_LANGUAGE_CODE, name: language === 'en' ? ENGLISH_LANGUAGE_NAME : GERMAN_LANGUAGE_NAME },
      };

      const response = await axios.post(t2sEndPoint, payload);
      setAudioSrc(`data:audio/mp3;base64,${response.data.audioContent}`);
    } catch (error) {
      console.error('Error preloading audio:', error);
    }
  };

  const handleStart = () => {
    if (!audioSrc) {
      console.error("Audio not preloaded.");
      return;
    }
    setIsPlaying(true);

    const audio = new Audio(audioSrc);
    audio.play();
    audio.onended = () => {
      setIsPlaying(false);
      navigate('/formTest');
    };
  };

  React.useEffect(() => {
    preloadAudio();
  }, [language]);

  return (
    <Box>
      <button
        onClick={handleStart}
        disabled={isPlaying}
        className={`px-8 py-4 rounded-full text-lg font-semibold
          transition-all duration-300 transform hover:scale-105
          ${isPlaying
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
          }`}
      >
        {isPlaying
          ? (language === 'en' ? 'Listening...' : 'Hören...')
          : (language === 'en' ? 'Start' : 'Starten')}
      </button>
    </Box>
  );
};

export default VoiceInputButton;