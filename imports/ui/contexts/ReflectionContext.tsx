import React, { createContext, useState, useEffect, useContext } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { useTracker } from 'meteor/react-meteor-data';

interface ReflectionContextType {
  storeReflectionInput: (input: string) => void;
  dropStoredReflectionInput: () => void;
  storedReflectionInput: string | null;
}

const ReflectionContext = createContext<ReflectionContextType | null>(null);

export const useReflectionContext = () => {
  const context = useContext(ReflectionContext);
  if (!context) {
    throw new Error('useReflectionContext must be used within a ReflectionProvider');
  }
  return context;
};

export const ReflectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedReflectionInput, setStoredReflectionInput] = useState<string | null>(null);
  const navigate = useNavigate();

  const { user, userId } = useTracker(() => {
    const user = Meteor.user();
    return {
      user,
      userId: Meteor.userId(),
    };
  });

  console.log('Stored Reflection Input: ', storedReflectionInput);

  useEffect(() => {
    const storedInput = localStorage.getItem('reflectionInput');
    if (storedInput) {
      setStoredReflectionInput(storedInput);
    }
  }, []);

  useEffect(() => {
    if (userId && storedReflectionInput) {
      // @ts-ignore
      if (user && user.credit > 0) {
        console.log('Handling stored reflection');
        handleStoredReflection();
      } else {
        navigate('/reflect');
      }
    }
  }, [userId, storedReflectionInput, user]);

  const handleStoredReflection = async () => {
    try {
      const reflectionId = await Meteor.callAsync(
        'reflection.create',
        storedReflectionInput,
        'Emotional'
      );
      dropStoredReflectionInput();
      navigate(`/reflections/${reflectionId}`);
    } catch (error) {
      console.error('Error creating reflection:', error);
    }
  };

  const storeReflectionInput = (input: string) => {
    setStoredReflectionInput(input);
    localStorage.setItem('reflectionInput', input);
  };

  const dropStoredReflectionInput = () => {
    setStoredReflectionInput(null);
    localStorage.removeItem('reflectionInput');
  };

  return (
    <ReflectionContext.Provider value={{ storeReflectionInput, dropStoredReflectionInput, storedReflectionInput }}>
      {children}
    </ReflectionContext.Provider>
  );
};