
import React from 'react';
import Client from './Client';

const MATCHING_ITEM_LIMIT = 25;

class FoodSearch extends React.Component {
  state = {
    foods: [],
    showRemoveIcon: false,
    searchValue: '',
  };

  onSearchChange = (e) => {
    const value = e.target.value;

    this.setState({
      searchValue: value,
    });

    if (value === '') {
      this.setState({
        foods: [],
        showRemoveIcon: false,
      });
    } else {
      this.setState({
        showRemoveIcon: true,
      });

      Client.search(value, (foods) => {
        this.setState({
          foods: foods.slice(0, MATCHING_ITEM_LIMIT),
        });
      });
    }
  };

  onRemoveIconClick = () => {
    this.setState({
      foods: [],
      showRemoveIcon: false,
      searchValue: '',
    });
  };

  render() {
    return (
      <div id='food-search'>
        <table className='ui selectable structured large table'>
          <thead>
            <tr>
              <th colSpan='5'>
                <div className='ui fluid search'>
                  <div className='ui icon input'>
                    <input
                      className='prompt'
                      type='text'
                      placeholder='Search foods...'
                      value={this.state.searchValue}
                      onChange={this.onSearchChange}
                    />
                    <i className='search icon' />
                  </div>
                  {
                    // boolean in state used here!!
                    // check the sweet ternary
                    this.state.showRemoveIcon ? (
                      <i
                        className='remove icon'
                        onClick={this.onRemoveIconClick}
                      />
                    ) : ''
                  }
                </div>
              </th>
            </tr>
            <tr>
              <th className='eight wide'>Description</th>
              <th>Kcal</th>
              <th>Protein (g)</th>
              <th>Fat (g)</th>
              <th>Carbs (g)</th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.foods.map((food, idx) => (
              <tr
                key={idx}
                onClick={() => this.props.onFoodClick(food)}
              >
                <td>{food.description}</td>
                <td className='right aligned'>
                  {food.kcal}
                </td>
                <td className='right aligned'>
                  {food.protein_g}
                </td>
                <td className='right aligned'>
                  {food.fat_g}
                </td>
                <td className='right aligned'>
                  {food.carbohydrate_g}
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default FoodSearch;