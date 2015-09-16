/**
 * Module dependencies.
 */
var debug = require('debug')('glint-block-meta');
var merge = require('utils-merge');


/**
 * Expose MetaBlock element.
 */
exports = module.exports = MetaBlock;

/**
 * Initialize a new `MetaBlock` element.
 * @param {[type]} options [description]
 */

function MetaBlock(options) {
  if (!(this instanceof MetaBlock)) return new MetaBlock(options);
  merge(this, options);
}


/**
 * API functions.
 */
MetaBlock.prototype.api = MetaBlock.api = 'block-provider';

MetaBlock.prototype.load = function (content) {
  return content;
};

