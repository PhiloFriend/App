import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export const CreateReflection: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleCreateReflection = (reflectionData: any) => {
    Meteor.call('createReflection', reflectionData, (error: Meteor.Error | null, result: string | null) => {
      if (error) {
        if (error.error === 'insufficient-credit') {
          setError("You don't have enough credit to create a reflection. Please add more credits.");
        } else {
          setError("An error occurred while creating the reflection.");
        }
      } else {
        // Handle successful creation
        console.log("Reflection created with ID:", result);
        // You might want to navigate to the new reflection or update the UI
      }
    });
  };

  // Render your form and use handleCreateReflection when submitting
  // ...
};