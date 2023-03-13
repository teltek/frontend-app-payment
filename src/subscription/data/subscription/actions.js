import { createRoutine } from 'redux-saga-routines';

// Routines are action + action creator pairs in a series.
// Actions adhere to the flux standard action format.
// Routines by default are in the form of:
//
// Action                |   Action Creator
// -----------------------------------------------
// fetchBasket.TRIGGER   |   fetchBasket()
// fetchBasket.SUCCESS   |   fetchBasket.success()
// fetchBasket.FAILURE   |   fetchBasket.failure()
// fetchBasket.FULFILL   |   fetchBasket.fulfill()
//
// Created with redux-saga-routines
export const submitPayment = createRoutine('SUBMIT_PAYMENT');
export const fetchBasket = createRoutine('FETCH_BASKET');

// Actions and their action creators
export const BASKET_DATA_RECEIVED = 'BASKET_DATA_RECEIVED';
export const BASKET_PROCESSING = 'BASKET_PROCESSING';

export const basketDataReceived = basket => ({
  type: BASKET_DATA_RECEIVED,
  payload: basket,
});

export const basketProcessing = isProcessing => ({
  type: BASKET_PROCESSING,
  payload: isProcessing,
});
