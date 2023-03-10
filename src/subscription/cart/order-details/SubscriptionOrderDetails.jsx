import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage, defineMessages, useIntl,
} from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'subscription.cart.order.details': {
    id: 'subscription.cart.order.details',
    defaultMessage: 'After you complete your order you will have verified access to each course in {programTitle}.',
    description: 'A paragraph explaining what kind of access they will have in this program.',
  },
});

const SubscriptionOrderDetails = ({
  programTitle,
}) => {
  const intl = useIntl();
  if (programTitle === '' || programTitle === null) {
    return (
      <><div className="skeleton py-2 mb-3 w-50" />
        <div className="skeleton py-2 mb-2 mr-4" />
        <div className="skeleton py-2 mb-5 w-75" />
      </>
    );
  }
  return (
    <div className="basket-section order-details">
      <FormattedMessage
        id="subscription.cart.order.details.heading"
        defaultMessage="Order details"
        description="The heading for details about an subscription order"
      >
        {text => <h5 aria-level="2">{text}</h5>}
      </FormattedMessage>
      <FormattedMessage
        id="subscription.cart.order.details.taxes"
        defaultMessage="The above total includes any applicable taxes."
        description="Subscription details explaining total includes any application taxes."
      >
        {text => <p className="mb-2">{text}</p>}
      </FormattedMessage>
      <p className="mb-2">
        {intl.formatMessage(messages['subscription.cart.order.details'], {
          programTitle,
        })}
      </p>
      <FormattedMessage
        id="subscription.cart.order.details.cancel"
        defaultMessage="Cancel anytime."
        description="Inform user that they can cancel their subscription anytime."
      >
        {text => <p>{text}</p>}
      </FormattedMessage>
    </div>
  );
};

SubscriptionOrderDetails.propTypes = {
  programTitle: PropTypes.string,
};

SubscriptionOrderDetails.defaultProps = {
  // TODO: Fix dynamic program title
  programTitle: 'Blockchain Fundamentals',
};

export default SubscriptionOrderDetails;
