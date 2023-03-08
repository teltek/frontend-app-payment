import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'subscription.checkout.billing.notification': {
    id: 'subscription.cart.order.legal',
    defaultMessage: 'You’ll be charged {price} USD on MM/DD then every 31 days until you cancel your subscription.',
    description: 'Subscription monthly billing notification for Users that they will be charged every 31 days for this subscription.',
  },
});

const MonthlyBillingNotification = ({
  price,
}) => {
  const intl = useIntl();
  return (
    <div className="d-flex col-12 justify-content-end pr-0">
      <p className="micro text-gray-500">
        {
        intl.formatMessage(messages['subscription.checkout.billing.notification'], {
          price: intl.formatNumber(price, { style: 'currency', currency: 'USD' }),
        })
      }
      </p>
    </div>
  );
};

MonthlyBillingNotification.propTypes = {
  price: PropTypes.number,
};

MonthlyBillingNotification.defaultProps = {
  // TODO: fetch dynamic price
  price: 15.99,
};

export default MonthlyBillingNotification;
