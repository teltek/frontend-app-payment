import camelCase from 'lodash.camelcase';
import snakeCase from 'lodash.snakecase';
import { getConfig } from '@edx/frontend-platform';
import { ORDER_TYPES } from './constants';

export function modifyObjectKeys(object, modify) {
  // If the passed in object is not an object, return it.
  if (
    object === undefined
    || object === null
    || (typeof object !== 'object' && !Array.isArray(object))
  ) {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(value => modifyObjectKeys(value, modify));
  }

  // Otherwise, process all its keys.
  const result = {};
  Object.entries(object).forEach(([key, value]) => {
    result[modify(key)] = modifyObjectKeys(value, modify);
  });
  return result;
}

export function camelCaseObject(object) {
  return modifyObjectKeys(object, camelCase);
}

export function snakeCaseObject(object) {
  return modifyObjectKeys(object, snakeCase);
}

export function convertKeyNames(object, nameMap) {
  const transformer = key => (nameMap[key] === undefined ? key : nameMap[key]);

  return modifyObjectKeys(object, transformer);
}

export function keepKeys(data, whitelist) {
  const result = {};
  Object.keys(data).forEach((key) => {
    if (whitelist.indexOf(key) > -1) {
      result[key] = data[key];
    }
  });
  return result;
}

/**
 * Given a state tree and an array representing a set of keys to traverse in that tree, returns
 * the portion of the tree at that key path.
 *
 * Example:
 *
 * const result = getModuleState(
 *   {
 *     first: { red: { awesome: 'sauce' }, blue: { weak: 'sauce' } },
 *     second: { other: 'data', }
 *   },
 *   ['first', 'red']
 * );
 *
 * result will be:
 *
 * {
 *   awesome: 'sauce'
 * }
 */
export function getModuleState(state, originalPath) {
  const path = [...originalPath]; // don't modify your argument
  if (path.length < 1) {
    return state;
  }
  const key = path.shift();
  if (state[key] === undefined) {
    throw new Error(`Unexpected state key ${key} given to getModuleState. Is your state path set up correctly?`);
  }
  return getModuleState(state[key], path);
}

/**
 * Helper class to save time when writing out action types for asynchronous methods.  Also helps
 * ensure that actions are namespaced.
 *
 * TODO: Put somewhere common to it can be used by other MFEs.
 */
export class AsyncActionType {
  constructor(topic, name) {
    this.topic = topic;
    this.name = name;
  }

  get BASE() {
    return `${this.topic}__${this.name}`;
  }

  get BEGIN() {
    return `${this.topic}__${this.name}__BEGIN`;
  }

  get SUCCESS() {
    return `${this.topic}__${this.name}__SUCCESS`;
  }

  get FAILURE() {
    return `${this.topic}__${this.name}__FAILURE`;
  }

  get RESET() {
    return `${this.topic}__${this.name}__RESET`;
  }
}

export function generateAndSubmitForm(url, params = {}) {
  const form = global.document.createElement('form');
  form.method = 'POST';
  form.action = url;

  Object.keys(params).forEach((key) => {
    const hiddenField = global.document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = key;
    hiddenField.value = params[key];

    form.appendChild(hiddenField);
  });

  global.document.body.appendChild(form);
  form.submit();
}

export function isWaffleFlagEnabled(flagName, defaultValue = false) {
  const value = getConfig().WAFFLE_FLAGS[flagName];
  return typeof value !== 'undefined' ? value : defaultValue;
}

function getOrderType(productType) {
  switch (productType) {
    case 'Enrollment Code':
      return ORDER_TYPES.BULK_ENROLLMENT;
    case 'Course Entitlement':
      return ORDER_TYPES.ENTITLEMENT;
    case 'Seat':
    default:
      return ORDER_TYPES.SEAT;
  }
}

export function transformResults(data) {
  const results = camelCaseObject(data);

  const lastProduct = results.products && results.products[results.products.length - 1];
  results.orderType = getOrderType(lastProduct && lastProduct.productType);

  return results;
}
