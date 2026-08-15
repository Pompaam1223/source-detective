import { useState, useEffect } from 'react';
import { Student, StudentProgress } from '../types';
import { StorageService } from '../engine/StorageService';

export function useStudent() {
  const [student, setStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);

  useEffect(() => {
    const loadedStudent = StorageService.getStudent();
    if (loadedStudent) {
      setStudent(loadedStudent);
      const loadedProgress = StorageService.getProgress(loadedStudent.studentId);
      setProgress(loadedProgress);
    }
  }, []);

  const updateStudent = (newStudent: Student) => {
    StorageService.saveStudent(newStudent);
    setStudent(newStudent);
    const loadedProgress = StorageService.getProgress(newStudent.studentId);
    setProgress(loadedProgress);
  };

  const reloadProgress = () => {
    if (student) {
      const loadedProgress = StorageService.getProgress(student.studentId);
      setProgress(loadedProgress);
    }
  };

  return {
    student,
    progress,
    updateStudent,
    reloadProgress
  };
}
