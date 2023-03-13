import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Badge } from '@edx/paragon';

// TODO: Fix the a11y and dynamic headings
const CartContents = ({ children, details }) => (
  <div className="basket-section">
    <h5 aria-level="2">
      <FormattedMessage
        id="subscription.purchase.cart.heading"
        defaultMessage="In your cart"
        description="Describe what's in your cart"
      />
    </h5>
    <div className="">
      <div className="heading-badge-wrapper">
        <h3 aria-level="2" className="mb-0">
          {details.programTitle}
        </h3>
        <Badge variant="light">
          <FormattedMessage
            id="subscription.purchase.cart.label"
            defaultMessage="Subscription"
            description="Badge label for the subscription"
          />
        </Badge>
      </div>

      {/** TODO: Render different certificate types as Done in <ProductLineItem /> */}
      <h4 aria-level="2" className="mb-0">
        <FormattedMessage
          id="subscription.purchase.cart.certificate.type"
          defaultMessage="Professional Certificate"
          description="Sub heading for the program certificate type in product details section"
        />
      </h4>
      <p aria-level="2" className="body small mb-5">
        {details.organization}
      </p>
      <h5>
        <FormattedMessage
          id="subscription.purchase.cart.product.list.heading"
          defaultMessage="Included with your subscription:"
          description="Subheading of the cart in product list section"
        />
      </h5>
    </div>
    {children}
  </div>
);

CartContents.propTypes = {
  children: PropTypes.node.isRequired,
  details: PropTypes.shape({
    programTitle: PropTypes.string,
    programType: PropTypes.string,
    organization: PropTypes.string,
  }).isRequired,
};

export default CartContents;
