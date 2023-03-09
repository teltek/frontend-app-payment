/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from '../../payment/cart/Cart.messages';
import { cartSelector } from '../../payment/data/selectors';
import { ORDER_TYPES } from '../../payment/data/constants';

import CurrencyDisclaimer from '../../payment/cart/CurrencyDisclaimer';
import OrderSummary from '../../payment/cart/OrderSummary';
import ProductLineItem from '../../payment/cart/ProductLineItem';
import SummaryTable from '../../payment/cart/SummaryTable';
import TotalTable from '../../payment/cart/TotalTable';

import SubscriptionCartSkeleton from './skeleton/SubscriptionCartSkeleton';
import SubscriptionLegal from './legal/SubscriptionLegal';
import SubscriptionContent from './content/SubscriptionContent';
import SubscriptionOrderDetails from './order-details/SubscriptionOrderDetails';

/**
 * SubscriptionCart component
 * renders the cart details
 */
class SubscriptionCart extends React.Component {
  renderCart() {
    const {
      products,
      isCurrencyConverted,
      orderTotal,
      summaryPrice,
      loaded,
    } = this.props;
    return (
      <div>
        <span className="sr-only">
          <FormattedMessage
            id="subscription.screen.reader.cart.details.loaded"
            defaultMessage="Shopping cart details are loaded."
            description="Screen reader text to be read when cart details load."
          />
        </span>

        <SubscriptionContent>
          {products.map(product => (
            <ProductLineItem
              key={product.title}
              {...product}
            />
          ))}
        </SubscriptionContent>
        {loaded
          ? (
            <OrderSummary>
              <SummaryTable price={summaryPrice} isSubscription />
              <TotalTable total={orderTotal} isSubscription />
              {isCurrencyConverted ? <CurrencyDisclaimer /> : null}
            </OrderSummary>
          ) : (
            <>
              <div className="skeleton py-2 mb-3 w-50" />
              <div className="skeleton py-2 mb-2" />
              <div className="skeleton py-2 mb-5" />
            </>
          )}
        <SubscriptionOrderDetails />
        <SubscriptionLegal price={summaryPrice} />
      </div>
    );
  }

  render() {
    const {
      intl,
      loading,
    } = this.props;

    return (
      <section
        aria-live="polite"
        aria-relevant="all"
        aria-label={intl.formatMessage(messages['payment.section.cart.label'])}
      >
        {loading ? <SubscriptionCartSkeleton /> : this.renderCart() }
      </section>
    );
  }
}

SubscriptionCart.propTypes = {
  intl: intlShape.isRequired,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.shape({
    imageUrl: PropTypes.string,
    title: PropTypes.string,
    certificateType: PropTypes.oneOf(['audit', 'honor', 'verified', 'no-id-professional', 'professional', 'credit']),
  })),
  orderType: PropTypes.oneOf(Object.values(ORDER_TYPES)),
  isCurrencyConverted: PropTypes.bool,
  orderTotal: PropTypes.number,
  summaryPrice: PropTypes.number,
};

SubscriptionCart.defaultProps = {
  loading: true,
  loaded: false,
  products: [],
  orderType: ORDER_TYPES.SEAT,
  isCurrencyConverted: false,
  orderTotal: undefined,
  summaryPrice: undefined,
};

export default connect(cartSelector)(injectIntl(SubscriptionCart));
