import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import LocalizedPrice from './LocalizedPrice';

const SummaryTable = ({ price, isSubscription }) => (
  <div className="summary-row d-flex">
    <span className={classNames('flex-grow-1', { 'text-gray-500': isSubscription })}>
      <FormattedMessage
        id="payment.summary.table.label.price"
        defaultMessage="Price"
        description="Label for price excluding discount line on order summary table"
      />
    </span>
    <span className={classNames('summary-price', { 'text-gray-500': isSubscription })}>
      <LocalizedPrice amount={price} />
      {
        isSubscription ? (
          <FormattedMessage
            id="subscription.summary.table.label.price"
            defaultMessage="/month USD after 7-day free trial"
            description="Label for subscription on order summary table"
          />
        ) : null
      }
    </span>
  </div>
);

SummaryTable.propTypes = {
  price: PropTypes.number,
  isSubscription: PropTypes.bool,
};
SummaryTable.defaultProps = {
  price: undefined,
  isSubscription: false,
};

export default SummaryTable;
