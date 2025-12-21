import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ConfirmModal from '../components/ConfirmModal';

describe('ConfirmModal', () => {
  // Snapshot Test
  it('renders correctly', () => {
    const tree = render(
      <ConfirmModal 
        visible={true} 
        message="Are you sure?" 
        showConfirm={true} 
        onConfirm={() => {}} 
        onClose={() => {}} 
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Interaction Test: Button press
  it('calls onConfirm when Yes button is pressed', () => {
    const onConfirmMock = jest.fn();
    const onCloseMock = jest.fn();

    const { getByText } = render(
      <ConfirmModal 
        visible={true} 
        message="Delete item?" 
        showConfirm={true} 
        onConfirm={onConfirmMock} 
        onClose={onCloseMock} 
        type="error"
      />
    );

    const yesButton = getByText('Yes');
    fireEvent.press(yesButton);

    expect(onConfirmMock).toHaveBeenCalled();
    // Based on component logic: onPress={() => { onConfirm(); onClose(); }}
    expect(onCloseMock).toHaveBeenCalled(); 
  });

  // Interaction Test: Modal visibility (implied by rendering) and Cancel
  it('calls onClose when Cancel button is pressed', () => {
    const onCloseMock = jest.fn();

    const { getByText } = render(
      <ConfirmModal 
        visible={true} 
        message="Delete item?" 
        showConfirm={true} 
        onClose={onCloseMock} 
      />
    );

    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
