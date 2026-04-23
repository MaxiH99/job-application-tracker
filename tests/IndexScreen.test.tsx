import { render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/components/ApplicationCard', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return function MockApplicationCard({ application }: any) {
    return (
      <>
        <Text>{application.companyName}</Text>
        <Text>{application.roleTitle}</Text>
      </>
    );
  };
});

jest.mock('@/app/_layout', () => {
  const React = require('react');
  return {
    ApplicationContext: React.createContext(null),
  };
});

import { ApplicationContext } from '@/app/_layout';
import IndexScreen from '../app/(tabs)/index';

describe('IndexScreen', () => {
  it('displays seeded applications', () => {
    const mockContext = {
      applications: [
        {
          id: 1,
          companyName: 'Google',
          roleTitle: 'Software Engineer',
          applicationDate: '2026-02-01',
          priorityScore: 5,
          notes: '',
          categoryId: 1,
          status: 'Applied',
        },
      ],
      setApplications: jest.fn(),
      categories: [
        { id: 1, name: 'Tech', color: '#2563EB' },
      ],
      setCategories: jest.fn(),
      targets: [],
      setTargets: jest.fn(),
    };

    render(
      <ApplicationContext.Provider value={mockContext}>
        <IndexScreen />
      </ApplicationContext.Provider>
    );

    expect(screen.getByText('Google')).toBeTruthy();
    expect(screen.getByText('Software Engineer')).toBeTruthy();
  });
});