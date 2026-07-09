export interface LocalUser {
  name: string;
  email: string;
  password: string;
}

export interface ScanHistoryItem {
  id: string;
  fileName: string;
  fileSize: string;
  imageUrl: string;
  aiScore: number;
  humanAuthenticity: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  insightTitle: string;
  insightText: string;
  imageDescription?: string;
  reasons?: string[];
  createdAt: string;
}

const USERS_KEY = 'ai-police-users';
const SESSION_KEY = 'ai-police-session';
const HISTORY_PREFIX = 'ai-police-history';

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

export const getUsers = () => readJson<LocalUser[]>(USERS_KEY, []);

export const saveUser = (user: LocalUser) => {
  const users = getUsers();
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
};

export const findUser = (email: string) =>
  getUsers().find((user) => user.email.toLowerCase() === email.toLowerCase());

export const setCurrentUser = (email: string) => {
  localStorage.setItem(SESSION_KEY, email);
  window.dispatchEvent(new Event('authchange'));
};

export const continueWithGoogleDemo = () => {
  const email = 'google.user@ai-police.local';
  const existing = findUser(email);

  if (!existing) {
    saveUser({
      name: 'Google User',
      email,
      password: 'google-demo',
    });
  }

  setCurrentUser(email);
  return email;
};

export const getCurrentUser = () => {
  const email = localStorage.getItem(SESSION_KEY);
  return email ? findUser(email) ?? null : null;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('authchange'));
};

const historyKey = (email: string) => `${HISTORY_PREFIX}:${email.toLowerCase()}`;

export const getHistory = (email: string) => readJson<ScanHistoryItem[]>(historyKey(email), []);

export const addHistoryItem = (email: string, item: ScanHistoryItem) => {
  const key = historyKey(email);
  const existing = getHistory(email).filter((historyItem) => !historyItem.insightTitle.includes('Most likely class'));
  let nextItems = [item, ...existing].slice(0, 12);

  while (nextItems.length > 0) {
    try {
      localStorage.setItem(key, JSON.stringify(nextItems));
      return true;
    } catch (error) {
      nextItems = nextItems.slice(0, -1);
    }
  }

  return false;
};

export const clearHistory = (email: string) => {
  localStorage.removeItem(historyKey(email));
};

export const createImageThumbnail = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const maxSize = 420;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');

      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Could not create image thumbnail.'));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.68));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image for thumbnail.'));
    };

    image.src = objectUrl;
  });
