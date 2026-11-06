export interface TTSVoice {
  id: string;
  name: string;
  language: string;
  gender: 'Male' | 'Female';
}

export type VoiceOption = TTSVoice;

export const AVAILABLE_VOICES: TTSVoice[] = [
  // Bengali Voices
  { id: 'bn-BD-PradeepNeural', name: 'Pradeep (Bangla - Bangladesh, Male)', language: 'bn-BD', gender: 'Male' },
  { id: 'bn-BD-NabanitaNeural', name: 'Nabanita (Bangla - Bangladesh, Female)', language: 'bn-BD', gender: 'Female' },
  { id: 'bn-IN-BashkarNeural', name: 'Bashkar (Bangla - India, Male)', language: 'bn-IN', gender: 'Male' },
  { id: 'bn-IN-TanishaaNeural', name: 'Tanishaa (Bangla - India, Female)', language: 'bn-IN', gender: 'Female' },
  
  // English Voices
  { id: 'en-US-ChristopherNeural', name: 'Christopher (US - Deep, Storyteller Male)', language: 'en-US', gender: 'Male' },
  { id: 'en-US-JennyNeural', name: 'Jenny (US - Conversational Female)', language: 'en-US', gender: 'Female' },
  { id: 'en-US-GuyNeural', name: 'Guy (US - Natural Casual Male)', language: 'en-US', gender: 'Male' },
  { id: 'en-US-AriaNeural', name: 'Aria (US - Expressive Female)', language: 'en-US', gender: 'Female' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (UK - British Male)', language: 'en-GB', gender: 'Male' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia (UK - British Female)', language: 'en-GB', gender: 'Female' },

  // Hindi Voices
  { id: 'hi-IN-MadhurNeural', name: 'Madhur (Hindi - Male)', language: 'hi-IN', gender: 'Male' },
  { id: 'hi-IN-SwaraNeural', name: 'Swara (Hindi - Female)', language: 'hi-IN', gender: 'Female' },
];
