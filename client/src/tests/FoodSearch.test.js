// We populate this file in the chapter "Unit Testing"
/* eslint-disable no-unused-vars */
import { shallow } from 'enzyme';
import React from 'react';
import FoodSearch from '../FoodSearch';
import Client from '../Client';

// Here Jest mocks the Client module and injects a test double
// of the object, which contains e.g. the search() function 
jest.mock('../Client');

describe('FoodSearch', () => {
  // ... initial state specs
  let wrapper;
  const onFoodClick = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <FoodSearch
        onFoodClick={onFoodClick}
      />
    );
  });

  afterEach(() => {
    // clear state between each assertion to ensure the mock is in a pristine
    // state before each run
    Client.search.mockClear();
    onFoodClick.mockClear();
  });

  it('should not display the remove icon', () => {
    expect(
      wrapper.find('.remove.icon').length
    ).toBe(0);
  });

  it('should display zero rows', () => {
    expect(
      wrapper.find('tbody tr').length
    ).toEqual(0);
  });

  describe('user populates search field', () => {
    const value = 'brocc';

    beforeEach(() => {
      // ... simulate user typing "brocc" in input
      const input = wrapper.find('input').first();
      input.simulate('change', {
        target: { value }
      });
    });

    it('should update state property `searchValue`', () => {
      expect(
        wrapper.state().searchValue
      ).toEqual(value);
    });

    it('should display the remove icon', () => {
      expect(
        wrapper.find('.remove.icon').length
      ).toBe(1);
    });

    /*it('...todo...', () => {
      const firstInvocation = Client.search.mock.calls[0];
      console.log('First invocation');
      // logs the first invocation and shows that callback has not been invoked
      console.log(firstInvocation);
      console.log('All invocations: ');
      console.log(Client.search.mock.calls);
    });*/

    it('should call `Client.search() with `value``', () => {
      const invocationArgs = Client.search.mock.calls[0];
      expect(invocationArgs[0]).toEqual(value);
    });

    describe('and API returns results', () => {
      const foods = [
        {
          description: 'Broccolini',
          kcal: '100',
          protein_g: '11',
          fat_g: '11',
          carbohydrate_g: '31'
        },
        {
          description: 'Broccolini rabe',
          kcal: '200',
          protein_g: '12',
          fat_g: '22',
          carbohydrate_g: '32'
        }
      ];

      beforeEach(() => {
        const invocationArgs = Client.search.mock.calls[0];
        // the callback passed to Client.search()
        const cb = invocationArgs[1];
        // simulate async by manually invoking callback passed to mock
        cb(foods);
        // update wrapper element as normal re-rendering hook does not apply
        // in shallow rendering
        wrapper.update();
      });

      it('should set the state property `foods`', () => {
        expect(
          wrapper.state().foods
        ).toEqual(foods);
      });

      it('should display two rows', () => {
        expect(
          wrapper.find('tbody tr').length
        ).toEqual(2);
      });

      it('should render the description of first food', () => {
        expect(
          wrapper.html()
        ).toContain(foods[0].description);
      });

      it('should render the description of second food', () => {
        expect(
          wrapper.html()
        ).toContain(foods[1].description);
      });

      describe('then user clicks food item', () => {
        beforeEach(() => {
          const foodRow = wrapper.find('tbody tr').first();
          foodRow.simulate('click');
        });

        it('should call prop `onFoodClick` with `food`', () => {
          const food = foods[0];
          expect(
            onFoodClick.mock.calls[0]
          ).toEqual([food]);
        });
      });

      describe('then user types more', () => {
        const value = 'broccx';

        beforeEach(() => {
          const input = wrapper.find('input').first();
          input.simulate('change', {
            target: { value }
          });
        });

        describe('and API returns no results', () => {
          beforeEach(() => {
            const secondInvocationArgs = Client.search.mock.calls[1];
            const cb = secondInvocationArgs[1];
            cb([]);
            wrapper.update();
          });

          it('should set the state property `foods`', () => {
            expect(
              wrapper.state().foods
            ).toEqual([]);
          });

        });
      });
    });

  });
});


/*

NOTES:

1. Think of a set of describes for a single component based on user actions
2. What is the hiearchy of the assertions? What happens after what?
3. 

*/