import React from 'react';
import { render } from '@testing-library/react-native';
import FloatingTabBar from '../components/FloatingTabBar';

// Mocking external dependencies (Mocking tests)
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/(tabs)/index',
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#A0522D',
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#000000',
      border: '#CCCCCC',
      notification: '#FF3B30',
    },
  }),
}));

jest.mock('@/components/ui/icon-symbol', () => {
  const { View } = require('react-native');
  return function IconSymbol() {
    return <View testID="mock-icon" />;
  };
});

describe('FloatingTabBar', () => {
  const mockTabs = [
    {
      route: '/(tabs)/index',
      label: 'Home',
      icon: 'house',
      activeIcon: 'house.fill',
    },
    {
      route: '/(tabs)/searchMeal',
      label: 'Search',
      icon: 'magnifyingglass',
    },
    {
      route: '/(tabs)/timer',
      label: 'Timer',
      icon: 'timer',
    },
    {
      route: '/(tabs)/profile',
      label: 'Profile',
      icon: 'person',
    },
  ];

  it('renders all tabs correctly with mocked dependencies', () => {
    const { getByText, getAllByTestId } = render(
      <FloatingTabBar tabs={mockTabs} />
    );

    // Check if all tab labels are rendered
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
    expect(getByText('Timer')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();

    // Check if icons are rendered (mocked)
    const icons = getAllByTestId('mock-icon');
    expect(icons.length).toBe(4);
  });

  it('renders with custom containerWidth', () => {
    const { getByText } = render(
      <FloatingTabBar tabs={mockTabs} containerWidth={300} />
    );

    expect(getByText('Home')).toBeTruthy();
  });
});
