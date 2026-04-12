import { useState, useEffect, useRef } from "react";

/**
 * A hook to automatically save form data after a specified delay of inactivity.
 * @param {Object} data The form data to save
 * @param {Function} saveFunction The async function to call to save the data (should return the saved object if possible)
 * @param {number} delay The debounce delay in milliseconds
 * @param {boolean} isDraft Whether we are currently in draft mode (only autosaves if true or if we handle it outside)
 * @returns {Object} { isSaving: boolean, lastSaved: Date, hasUnsavedChanges: boolean }
 */
export const useAutoSave = (data, saveFunction, delay = 3000, enabled = true) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const initialMount = useRef(true);
  const dataRef = useRef(data);

  // We want to skip the first render deep equality check, and only trigger
  // autosave when the user actually changes the data.
  // Using JSON.stringify for deep comparison of form data is generally okay for this.
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    if (!enabled) return;

    if (JSON.stringify(dataRef.current) !== JSON.stringify(data)) {
      setHasUnsavedChanges(true);
      dataRef.current = data;

      const timer = setTimeout(async () => {
        setIsSaving(true);
        try {
          await saveFunction(data);
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error("Autosave failed", error);
        } finally {
          setIsSaving(false);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [data, saveFunction, delay, enabled]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Trigger a save when the tab or app is hidden or closed
      if (document.visibilityState === "hidden" && hasUnsavedChanges) {
        setIsSaving(true);
        saveFunction(dataRef.current)
          .then(() => {
            setLastSaved(new Date());
            setHasUnsavedChanges(false);
          })
          .catch((err) => console.error("Visibility auto-save failed", err))
          .finally(() => setIsSaving(false));
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasUnsavedChanges, saveFunction]);

  return { isSaving, lastSaved, hasUnsavedChanges };
};
