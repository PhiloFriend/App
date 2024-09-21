import { useState, useCallback, useMemo } from "react";
import { PhilosophyType } from "/imports/api/Philosophies";

interface SelectedPhilosophies {
  primary: PhilosophyType | null;
  complementary: PhilosophyType[];
}

export const useManuallySelectedPhilosophies = (
  philosophies: PhilosophyType[]
) => {
  const [selectedPhilosophies, setSelectedPhilosophies] =
    useState<SelectedPhilosophies>({
      primary: null,
      complementary: [],
    });

  // Calculate the number of philosophies still needed
  const philosophiesToSelect = useMemo(() => {
    const totalSelected =
      (selectedPhilosophies.primary ? 1 : 0) +
      selectedPhilosophies.complementary.length;
    return 3 - totalSelected;
  }, [selectedPhilosophies]);

  // Determine if the selection is complete
  const isSelectionComplete = useMemo(() => {
    return philosophiesToSelect === 0;
  }, [philosophiesToSelect]);

  const isSelected = useCallback(
    (id: string) => {
      return (
        selectedPhilosophies.primary?.id === id ||
        selectedPhilosophies.complementary.some((phil) => phil.id === id)
      );
    },
    [selectedPhilosophies]
  );

  const selectPhilosophy = useCallback(
    (id: string) => {
      const philosophy = philosophies.find((phil) => phil.id === id);
      if (!philosophy) return;

      setSelectedPhilosophies((prev) => {
        if (prev.primary === null) {
          return { ...prev, primary: philosophy };
        } else if (prev.complementary.length < 2) {
          return {
            ...prev,
            complementary: [...prev.complementary, philosophy],
          };
        }
        return prev;
      });
    },
    [philosophies]
  );

  const removePhilosophy = useCallback((id: string) => {
    setSelectedPhilosophies((prev) => {
      if (prev.primary?.id === id) {
        // If removing the primary, shift everything up
        return {
          primary: prev.complementary[0] || null,
          complementary: prev.complementary.slice(1),
        };
      } else {
        // If removing from complementary, just filter it out
        return {
          ...prev,
          complementary: prev.complementary.filter((phil) => phil.id !== id),
        };
      }
    });
  }, []);

  const canSelectMore = useCallback(() => {
    return philosophiesToSelect > 0;
  }, [philosophiesToSelect]);

  const moveToPosition = useCallback(
    (
      id: string,
      position: "primary" | "complementary1" | "complementary2"
    ) => {
      setSelectedPhilosophies((prev) => {
        const allSelected = [prev.primary, ...prev.complementary].filter(
          (p): p is PhilosophyType => p !== null
        );
        const movedPhilosophy = allSelected.find((p) => p.id === id);
        const otherPhilosophies = allSelected.filter((p) => p.id !== id);

        if (!movedPhilosophy) return prev;

        switch (position) {
          case "primary":
            return {
              primary: movedPhilosophy,
              complementary: otherPhilosophies.slice(0, 2),
            };
          case "complementary1":
            return {
              primary: otherPhilosophies[0] || null,
              complementary: [movedPhilosophy, otherPhilosophies[1]].filter(
                (p): p is PhilosophyType => p !== null
              ),
            };
          case "complementary2":
            return {
              primary: otherPhilosophies[0] || null,
              complementary: [otherPhilosophies[1], movedPhilosophy].filter(
                (p): p is PhilosophyType => p !== null
              ),
            };
          default:
            return prev;
        }
      });
    },
    []
  );

  return {
    selectedPhilosophies,
    isSelected,
    selectPhilosophy,
    removePhilosophy,
    canSelectMore,
    moveToPosition,
    isSelectionComplete,
    philosophiesToSelect, // Add this line to return the new variable
  };
};
