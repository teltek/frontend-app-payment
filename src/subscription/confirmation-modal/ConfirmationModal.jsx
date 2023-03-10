import React, { useState } from 'react';
import {
  ModalDialog, ActionRow, Button, Hyperlink,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import { ArrowForward } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { useIntl, defineMessages, FormattedMessage } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'subscription.confirmation.modal.heading': {
    id: 'subscription.confirmation.modal.heading',
    defaultMessage: 'Congratulations! Your 7-day free trial of {programTitle} has started.',
    description: 'Subscription confirmation success heading.',
  },
  'subscription.confirmation.modal.body': {
    id: 'subscription.confirmation.modal.body',
    defaultMessage: "When your free trial ends, your subscription will begin, and we'll charge your payment method on file {price} per month plus any applicable taxes. This subscription will automatically renew every month unless you cancel from the {ordersAndSubscriptionLink} page.",
    description: 'Subscription confirmation success message explaining monthly subscription plan.',
  },
  'subscription.confirmation.modal.body.orders.link': {
    id: 'subscription.confirmation.modal.body.orders.link',
    defaultMessage: 'Orders & Subscriptions',
    description: 'Subscription Orders & Subscriptions link placeholder.',
  },
});

/**
 * ConfirmationModal
 */
export const ConfirmationModal = ({ price, programTitle }) => {
  const [isOpen] = useState(false);
  const intl = useIntl();
  // TODO: update the correct URL
  const ordersAndSubscriptionLink = (
    <Hyperlink
      destination={getConfig().ORDER_HISTORY_URL}
    >
      {intl.formatMessage(messages['subscription.confirmation.modal.body.orders.link'])}
    </Hyperlink>
  );
  return (
    <ModalDialog
      title="Subscription Confirmation Dialog"
      isOpen={isOpen}
      onClose={() => {}}
      hasCloseButton={false}
      isFullscreenOnMobile={false}
      className="confirmation-modal"
    >
      <ModalDialog.Header>
        <ModalDialog.Title as="h3">
          {
            intl.formatMessage(messages['subscription.confirmation.modal.heading'], {
              programTitle,
            })
          }
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        {
          intl.formatMessage(messages['subscription.confirmation.modal.body'], {
            price: intl.formatNumber(price, { style: 'currency', currency: 'USD' }),
            ordersAndSubscriptionLink,
          })
        }
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="brand" iconAfter={ArrowForward}>
            <FormattedMessage
              id="subscription.confirmation.modal.navigation.title"
              defaultMessage="Go to dashboard"
              description="Subscription confirmation success button title."
            />
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

ConfirmationModal.propTypes = {
  programTitle: PropTypes.string,
  price: PropTypes.number,
};

ConfirmationModal.defaultProps = {
  // TODO: fetch dynamic price
  programTitle: 'Blockchain Fundamentals',
  price: 15.99,
};

export default ConfirmationModal;
