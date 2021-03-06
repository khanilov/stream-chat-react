import React from 'react';
import renderer from 'react-test-renderer';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import DateSeparator from '../DateSeparator';

afterEach(cleanup); // eslint-disable-line

const getTDateTimeParserMock = (string) => () => ({
  calendar: () => string,
});

// this changes every time tests are run,
// but by mocking the actual renderers tests are still deterministic
const now = new Date();

describe('DateSeparator', () => {
  it('should render nothing if the date prop is not provided', () => {
    const { queryByText } = render(
      <DateSeparator formatDate={() => 'the date'} date={null} />,
    );
    expect(queryByText('the date')).toBeNull();
  });

  it('should use formatDate if it is provided', () => {
    const { queryByText } = render(
      <DateSeparator formatDate={() => 'the date'} date={now} />,
    );

    expect(queryByText('the date')).toBeInTheDocument();
  });

  it("should use tDateTimeParser's calendar method to format dates if formatDate prop is not specified", () => {
    const tDateTimeParser = getTDateTimeParserMock('calendar date');
    const { queryByText } = render(
      <DateSeparator date={now} tDateTimeParser={tDateTimeParser} />,
    );

    expect(queryByText('calendar date')).toBeInTheDocument();
  });

  describe('Position prop', () => {
    const renderWithPosition = (position) => (
      <DateSeparator
        formatDate={() => 'the date'}
        date={now}
        position={position}
      />
    );

    const defaultPosition = renderer.create(renderWithPosition()).toJSON();

    it('should render correctly with position==="right", and it should match the default', () => {
      const tree = renderer.create(renderWithPosition('right')).toJSON();
      expect(tree).toMatchSnapshot();
      expect(defaultPosition).toEqual(tree);
    });

    it('should render correctly with position==="left"', () => {
      const tree = renderer.create(renderWithPosition('left')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render correctly with position==="center"', () => {
      const tree = renderer.create(renderWithPosition('center')).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
