import React from 'react';
import './BusinessList.css';
import Business from '../Business/Business';

class BusinessList extends React.Component {
  render() {
    return (
      <div className="BusinessList">
        {this.props.businesses.map((business, i) => {
          let unique_key = business.id;
          return (
            <Business key={unique_key} business={business} />
          );
        })}
      </div>
    )
  }
};

export default BusinessList;
