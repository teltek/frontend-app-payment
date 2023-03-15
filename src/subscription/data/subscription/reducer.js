import {
  BASKET_DATA_RECEIVED,
  BASKET_PROCESSING,
  fetchBasket,
  submitPayment,
} from './actions';

// TODO: Remove all basket names once subscription services available
const basketInitialState = {
  loading: true,
  loaded: false,
  submitting: false,
  redirect: false,
  isBasketProcessing: false,
  products: [],
  // TODO: remove these once fetched from DB
  details: {
    programTitle: 'Blockchain Fundamentals',
    certificate_type: 'verified',
    organization: 'University of California, Berkeley',
    price: 0,
  },
};

export const subscriptionReducer = (state = basketInitialState, action = null) => {
  if (action !== null) {
    switch (action.type) {
      case fetchBasket.TRIGGER: return { ...state, loading: true };
      case fetchBasket.FULFILL: return {
        ...state,
        loading: false,
        loaded: true,
      };

      case BASKET_DATA_RECEIVED: return { ...state, ...action.payload };

      case BASKET_PROCESSING: return {
        ...state,
        isBasketProcessing: action.payload,
      };

      case submitPayment.TRIGGER: return {
        ...state,
        paymentMethod: action.payload.method,
      };
      case submitPayment.REQUEST: return {
        ...state,
        submitting: true,
      };
      case submitPayment.SUCCESS: return {
        ...state,
        redirect: true,
      };
      case submitPayment.FULFILL: return {
        ...state,
        submitting: false,
        paymentMethod: undefined,
      };

      default:
    }
  }
  return state;
};

export default subscriptionReducer;
