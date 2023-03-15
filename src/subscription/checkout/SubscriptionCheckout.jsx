import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  getLocale,
  useIntl,
} from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import messages from '../../payment/checkout/Checkout.messages';
import { paymentSelector } from '../data/subscription/selectors';
import { submitPayment } from '../data/subscription/actions';
import { fetchClientSecret } from '../data/client-secret/actions';
import { updateClientSecretSelector } from '../data/client-secret/selectors';

import StripePaymentForm from '../../payment/checkout/payment-form/StripePaymentForm';
import CheckoutSkeleton from './skeleton/CheckoutSkeleton';
import { getStripeOptions } from './StripeOptions';

/**
 * SubscriptionCheckout component
 * renders Address and Stripe form
 */
export const SubscriptionCheckout = () => {
  const {
    loading,
    loaded,
    submitting,
    isBasketProcessing,
    paymentMethod,
    enableStripePaymentProcessor,
  } = useSelector(paymentSelector);
  const { clientSecretId } = useSelector(updateClientSecretSelector);

  const dispatch = useDispatch();
  const intl = useIntl();

  const handleSubmitStripe = (formData) => {
    dispatch(submitPayment({ method: 'stripe', ...formData }));
  };

  const handleSubmitStripeButtonClick = () => {
    sendTrackEvent(
      'edx.bi.ecommerce.basket.payment_selected',
      {
        type: 'click',
        category: 'checkout',
        paymentMethod: 'Credit Card - Stripe',
        checkoutType: 'client_side',
        stripeEnabled: enableStripePaymentProcessor,
      },
    );
  };

  useEffect(() => {
    dispatch(fetchClientSecret());
  }, [dispatch]);

  const isQuantityUpdating = isBasketProcessing && loaded;
  const options = getStripeOptions(clientSecretId);

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
    <section aria-label={intl.formatMessage(messages['payment.section.payment.details.label'])}>
      {/* Passing the enableStripePaymentProcessor flag down the Stripe form component to
        be used in the CardHolderInformation component (child). We could get the flag value
        from Basket selector from the child component but this would require more change for a temp feature,
        since the flag will not be needed when we remove CyberSource.
        This is not needed in CyberSource form component since the default is set to false. */}
      {shouldDisplayStripePaymentForm ? (
        <Elements options={options} stripe={stripePromise}>
          <StripePaymentForm
            options={options}
            onSubmitPayment={handleSubmitStripe}
            onSubmitButtonClick={handleSubmitStripeButtonClick}
            isProcessing={stripeIsSubmitting}
            isQuantityUpdating={isQuantityUpdating}
            isSubscription
          />
        </Elements>
      ) : (loading && (<CheckoutSkeleton />))}
    </section>
  );
};

export default SubscriptionCheckout;
