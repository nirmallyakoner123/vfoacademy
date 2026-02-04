import { Course } from '@/types/course';

const STORAGE_KEY = 'admin_course_draft';

export const saveCourse = (course: Course): void => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(course));
        }
    } catch (error) {
        console.error('Failed to save course to localStorage:', error);
    }
};

export const loadCourse = (): Course | null => {
    try {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        }
    } catch (error) {
        console.error('Failed to load course from localStorage:', error);
    }
    return null;
};

export const clearCourse = (): void => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch (error) {
        console.error('Failed to clear course from localStorage:', error);
    }
};
