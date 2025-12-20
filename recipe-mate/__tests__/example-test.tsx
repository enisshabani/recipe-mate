import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

describe('Example Test', () => {
  test('renders text correctly', () => {
    const TestComponent = () => (
      <View>
        <Text>Hello Testing!</Text>
      </View>
    );

    const { getByText } = render(<TestComponent />);
    expect(getByText('Hello Testing!')).toBeTruthy();
  });
});
