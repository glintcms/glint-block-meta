/**
 * Module dependencies.
 */
var fs = require('fs');
var debug = require('debug')('glint-block-meta');
var merge = require('utils-merge');
var dot = require('dot');
var domify = require('domify');
var insertCss = require('insert-css');
var addClass = require('amp-add-class');
var removeClass = require('amp-remove-class');

var c = require('./config');
var template = fs.readFileSync(__dirname + '/index.dot', 'utf-8');
var style = fs.readFileSync(__dirname + '/style.css', 'utf-8');
var compiled = dot.template(template);


/**
 * Expose MetaBlock element.
 */
exports = module.exports = MetaBlock;

/**
 * Initialize a new `MetaBlock` element.
 * @param {Object} options object
 */
function MetaBlock(options) {
  if (!(this instanceof MetaBlock)) return new MetaBlock(options);

  merge(this, c);
  merge(this, options);
}

/**
 * API functions.
 */
MetaBlock.prototype.api = MetaBlock.api = 'block-provider';

MetaBlock.prototype.place = function() {
  return 'wherever';
};

MetaBlock.prototype.load = function(content) {
  // display none on load
  this.el = this.el || document.querySelector('.topnav');
  if (this.el) this.el.style.display = 'none';

  //this.el.removeAttribute('contenteditable');
  if (typeof content === 'undefined' || typeof content === 'null') return;
  this.content = content;
  this.setContent(this.content);
  this.storeHeaderElements(this.content);
  return this.content;
};

MetaBlock.prototype.edit = function() {

  var self = this;

  // 1. enable or append metablock template
  this.el = document.querySelector(this.selector);
  if (!this.el) {
    // insert css and template
    insertCss(style);
    var options = this.content ? this.content.blocks ? this.content.blocks : {} : {};
    var html = compiled(options);
    document.body.appendChild(domify(html));

    // add topnav event listeners
    this.el = document.querySelector(this.selector);
    this.handle = document.querySelector(this.selectorHandle);
    this.nav = document.querySelector(this.selectorWindow);
    this.navHeight = this.nav.getBoundingClientRect().height;
    this.showPosition = -20 + 'px';
    this.hidePosition = (-20 - this.navHeight) + 'px';
    this.el.style.top = this.hidePosition;
    var timed = undefined;

    function enter(e) {
      if (timed) clearTimeout(timed);
      self.el.style.top = self.showPosition;
      addClass(self.el, 'topnav-flyout');
    }

    function leave(e) {
      timed = setTimeout(function() {
        self.el.style.top = self.hidePosition;
        removeClass(self.el, 'topnav-flyout');
      }, 100);
    }

    this.handle.addEventListener('mouseover', enter);
    this.handle.addEventListener('mouseout', leave);

    this.nav.addEventListener('mouseover', enter);
    this.nav.addEventListener('mouseout', leave);

  }

  // 2. display the metadata topnav
  this.el = document.querySelector(this.selector);
  if (this.el) this.el.style.display = '';

  // 3. load inputs with content
  this.setContent(this.content);
  return this.content;
};

MetaBlock.prototype.save = function() {
  // save all nested blocks
  this.content = this.getContent();
  return this.content;
};

/**
 * Base functions.
 */

MetaBlock.prototype.getContent = function() {
  this.getMetaBlockElement();

  var title = this.title ? this.title.value : '';
  var description = this.description ? this.description.value : '';

  var content = {title: title, description: description};
  this.storeHeaderElements(content);

  return content;
};

MetaBlock.prototype.setContent = function(content) {
  this.getMetaBlockElement();
  if (!this.title || !this.description) return;

  if (!content) content = this.defaults;

  this.title.value = content.title;
  this.description.value = content.description;
};

MetaBlock.prototype.getMetaBlockElement = function() {
  this.title = document.querySelector('.metadata-title');
  this.description = document.querySelector('.metadata-description');
}

MetaBlock.prototype.storeHeaderElements = function(content) {
  if (!content) return;

  document.title = content.title;

  var description = document.head.querySelector('meta[name=description]');
  if (!description) description = document.head.appendChild(domify('<meta name="description" >'));
  description.setAttribute('content', content.description);

}