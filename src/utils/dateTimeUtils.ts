// src/utils/dateTimeUtils.ts - Tout en un seul fichier

// ===== Format =====
export const formatDate = (date: string): string => {
  try {
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Date invalide";
  }
};

export const formatDateOnly = (date: string): string => {
  try {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return "Date invalide";
  }
};

export const formatTimeOnly = (date: string): string => {
  try {
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Heure invalide";
  }
};

// ===== Prep for form =====
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch (error) {
    return "";
  }
};

export const formatTimeForInput = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    return "";
  }
};

// ===== COMBINAISON ET VALIDATION =====
export const combineDateTime = (dateString: string, timeString: string): string => {
  if (!dateString || !timeString) return "";
  
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    const date = new Date(dateString);
    date.setUTCHours(hours, minutes, 0, 0);
    
    return date.toISOString();
  } catch (error) {
    console.error("Error combining date and time:", error);
    return "";
  }
};

export const validateSleepTimes = (sleepTime?: string, wokeUpTime?: string, dreamDate?: string) => {
  if (!sleepTime || !wokeUpTime || !dreamDate) {
    return { isValid: true, errors: [], warnings: [], sleepDuration: null };
  }
  
  try {
    const sleep = new Date(combineDateTime(dreamDate, sleepTime));
    const wake = new Date(combineDateTime(dreamDate, wokeUpTime));
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (wake.getTime() < sleep.getTime()) {
      wake.setDate(wake.getDate() + 1);
    }
    
    const diffHours = (wake.getTime() - sleep.getTime()) / (1000 * 60 * 60);
    
    // Validations
    if (diffHours > 24) {
      errors.push("Durée de sommeil trop longue (>24h)");
    }
    
    if (diffHours < 1) {
      warnings.push("Durée de sommeil très courte (<1h)");
    }
    
    if (diffHours > 12) {
      warnings.push("Durée de sommeil très longue (>12h)");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sleepDuration: Math.round(diffHours * 100) / 100
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ["Erreur dans les heures saisies"],
      warnings: [],
      sleepDuration: null
    };
  }
};

// ===== BONUS =====
export const isToday = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch {
    return false;
  }
};

export const daysSince = (dateString: string): number => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

export const calculateSleepDuration = (sleepTime: string, wokeUpTime: string): number | null => {
  try {
    const sleep = new Date(`2000-01-01T${sleepTime}:00`);
    let wake = new Date(`2000-01-01T${wokeUpTime}:00`);
    
    if (wake.getTime() < sleep.getTime()) {
      wake.setDate(wake.getDate() + 1);
    }
    
    const diffHours = (wake.getTime() - sleep.getTime()) / (1000 * 60 * 60);
    return Math.round(diffHours * 100) / 100;
  } catch {
    return null;
  }
};