import React from 'react';
import { Navbar } from './Navbar';
import { AppScreen, Student } from '../types';

interface NavigationBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  currentStudent: Student | null;
  isPostTestInProgress?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = (props) => {
  return <Navbar {...props} />;
};
