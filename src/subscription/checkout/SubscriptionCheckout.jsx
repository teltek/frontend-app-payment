import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  getLocale,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import messages from '../../payment/checkout/Checkout.messages';
import { paymentSelector } from '../data/subscription/selectors';
import { submitPayment } from '../data/subscription/actions';
import { fetchClientSecret } from '../data/client-secret/actions';
import { updateClientSecretSelector } from '../data/client-secret/selectors';

import StripePaymentForm from '../../payment/checkout/payment-form/StripePaymentForm';
import CheckoutSkeleton from './skeleton/CheckoutSkeleton';

class SubscriptionCheckout extends React.Component {
  componentDidMount() {
    this.props.fetchClientSecret();
  }

  handleSubmitStripe = (formData) => {
    this.props.submitPayment({ method: 'stripe', ...formData });
  };

  handleSubmitStripeButtonClick = () => {
    sendTrackEvent(
      'edx.bi.ecommerce.basket.payment_selected',
      {
        type: 'click',
        category: 'checkout',
        paymentMethod: 'Credit Card - Stripe',
        checkoutType: 'client_side',
        stripeEnabled: this.props.enableStripePaymentProcessor,
      },
    );
  };

  renderCheckoutOptions() {
    const {
      enableStripePaymentProcessor,
      isBasketProcessing,
      loading,
      loaded,
      paymentMethod,
      submitting,
    } = this.props;
    const isQuantityUpdating = isBasketProcessing && loaded;

    // Stripe element config
    // TODO: Move these to a better home
    const options = {
      clientSecret: this.props.clientSecretId,
      appearance: {
        // Normally these styling values would come from Paragon,
        // however since stripe requires styling to be passed
        // in through the appearance object they are currently placed here.
        // TODO: Investigate if these values can be pulled into javascript from the Paragon css files
        rules: {
          '.Input': {
            border: 'solid 1px #707070', // $gray-500
            borderRadius: '0',
          },
          '.Input:hover': {
            border: 'solid 1px #1f3226',
          },
          '.Input:focus': {
            color: '#454545',
            backgroundColor: '#FFFFFF', // $white
            borderColor: '#0A3055', // $primary
            outline: '0',
            boxShadow: '0 0 0 1px #0A3055', // $primary
          },
          '.Label': {
            fontSize: '1.125rem',
            fontFamily: 'Inter,Helvetica Neue,Arial,sans-serif',
            fontWeight: '400',
            marginBottom: '0.5rem',
          },
        },
      },
      fields: {
        billingDetails: {
          address: 'never',
        },
      },
    };

    // istanbul ignore next
    const stripeIsSubmitting = submitting && paymentMethod === 'stripe';

    // TODO: Right now when fetching capture context, CyberSource's captureKey is saved as clientSecretId
    // so we cannot rely on !options.clientSecret to distinguish btw payment processors
    const shouldDisplayStripePaymentForm = !loading && enableStripePaymentProcessor && options.clientSecret;

    // Doing this within the Checkout component so locale is configured and available
    let stripePromise;
    if (shouldDisplayStripePaymentForm) {
      stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY, {
        betas: [process.env.STRIPE_BETA_FLAG],
        apiVersion: process.env.STRIPE_API_VERSION,
        locale: getLocale(),
      });
    }

    return (
      <>
        {/* Passing the enableStripePaymentProcessor flag down the Stripe form component to
        be used in the CardHolderInformation component (child). We could get the flag value
        from Basket selector from the child component but this would require more change for a temp feature,
        since the flag will not be needed when we remove CyberSource.
        This is not needed in CyberSource form component since the default is set to false. */}
        {shouldDisplayStripePaymentForm ? (
          <Elements options={options} stripe={stripePromise}>
            <StripePaymentForm
              options={options}
              onSubmitPayment={this.handleSubmitStripe}
              onSubmitButtonClick={this.handleSubmitStripeButtonClick}
              isProcessing={stripeIsSubmitting}
              isQuantityUpdating={isQuantityUpdating}
              isSubscription
            />
          </Elements>
        ) : (loading && (<CheckoutSkeleton />))}
      </>
    );
  }

  render() {
    const { intl } = this.props;

    return (
      <section
        aria-label={intl.formatMessage(messages['payment.section.payment.details.label'])}
      >
        {this.renderCheckoutOptions()}
      </section>
    );
  }
}

// TODO: remove unused props
SubscriptionCheckout.propTypes = {
  intl: intlShape.isRequired,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  fetchClientSecret: PropTypes.func.isRequired,
  submitPayment: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  isBasketProcessing: PropTypes.bool,
  paymentMethod: PropTypes.oneOf(['paypal', 'apple-pay', 'cybersource', 'stripe']),
  enableStripePaymentProcessor: PropTypes.bool,
  clientSecretId: PropTypes.string,
};

SubscriptionCheckout.defaultProps = {
  loading: false,
  loaded: false,
  submitting: false,
  isBasketProcessing: false,
  paymentMethod: undefined,
  enableStripePaymentProcessor: false,
  clientSecretId: null,
};

const mapStateToProps = (state) => ({
  ...paymentSelector(state),
  ...updateClientSecretSelector(state),
});

export default connect(mapStateToProps, { fetchClientSecret, submitPayment })(injectIntl(SubscriptionCheckout));
