const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8800";

export interface Settings {
  phonenumbers: string[];
  location: string;
  banner?: string;
  title: string;
  language: string;
  description?: string;
  socialMediaLinks?: {
    instagram?: string;
    telegram?: string;
  };
  logo?: string;
}

// Settings ma'lumotlarini olish
export const getSettings = async (): Promise<Settings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Settings ma\'lumotlarini olishda xatolik yuz berdi');
    }

    return await response.json();
  } catch (error) {
    console.error('Settings ma\'lumotlarini olishda xatolik:', error);
    throw error;
  }
};

// Admin uchun settings ma'lumotlarini yangilash
export const updateSettings = async (settings: Settings): Promise<Settings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Settings ma\'lumotlarini yangilashda xatolik yuz berdi');
    }

    return await response.json();
  } catch (error) {
    console.error('Settings ma\'lumotlarini yangilashda xatolik:', error);
    throw error;
  }
};