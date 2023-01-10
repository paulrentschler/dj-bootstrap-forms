/**
 * Javascript for interacting with a Bootstrap styled form
 */

/**
 * Class that represents a form field
 *
 * @param {str} name -- Value of the input element's "name" attribute
 * @param {bool} collapsable -- Indicates if the widget should be made collapsable
 * @return {void}
 */
function BsField(name, collapsable) {
  this._selector  = 'form [name="' + name + '"]'
  this.inputs     = document.querySelectorAll(this._selector)
  if (this.inputs.length == 0) {
    this._selector = this._selector.replace('name=', 'name^=')
    this.inputs    = document.querySelectorAll(this._selector)
  }
  if (this.inputs.length == 0) {
    this._selector = '#field_' + name
    this.inputs    = document.querySelectorAll(this._selector)
  }
  this.widget      = this.inputs[0].closest('.form-item')
  this.is_required = this.widget.classList.contains('required')

  collapsable = collapsable || false
  if (collapsable) this.makeCollapsable()
}


/**
 * Add CSS classes to the widget
 *
 * @param {str} classes -- String of space-separated CSS classes to add
 * @return {void}
 */
BsField.prototype.addClass = function (classes) {
  let addClassList = classes.split(' ')
  let that = this
  addClassList.forEach(function(item, index) {
    that.widget.classList.add(item)
  })
}


/**
 * Adds an event listener to each input of the widget
 *
 * @return {void}
 */
BsField.prototype.addEventListener = function (type, listener, options) {
  this.inputs.forEach(function(element, index) {
    element.addEventListener(type, listener, options)
  })
}


/**
 * Add an error or warning to a widget
 *
 * @param {str} type    -- type of message being added (e.g., 'ERROR', 'WARNING')
 * @param {str} message -- text of the message to add to the widget
 * @return {void}
 */
BsField.prototype.addMessage = function (type, message) {
  let that        = this
  let errorList   = that.widget.querySelector('.errorlist')
  let widgetClass = (type.trim().toUpperCase() == 'WARNING') ? 'is-warning' : 'is-invalid';
  let msgElement  = document.createElement('li')
  msgElement.textContent = message
  that.widget.classList.add(widgetClass)
  errorList.append(msgElement)
}


/**
 * Clear any error/warning messages from the widget
 *
 * @return {void}
 */
BsField.prototype.clearMessages = function () {
  let that      = this
  var errorList = that.widget.querySelector('.errorlist')
  var messages  = errorList.querySelectorAll('li')
  messages.forEach(function(item, index) {
    errorList.removeChild(item)
  })
  that.widget.classList.remove('is-invalid')
  that.widget.classList.remove('is-warning')
}


/**
 * Hide (i.e., collapse) the widget
 *
 * @return {void}
 */
BsField.prototype.hide = function () {
  if (this.widget.classList.contains('collapse')) {
    this.widget.classList.remove('show')
  } else {
    this.widget.style.display = 'none'
  }
  if (this.is_required) this.removeRequired()
}


/**
 * Makes the widget able of being collapsed/expanded
 *
 * @return {void}
 */
BsField.prototype.makeCollapsable = function () {
  this.widget.classList.add('collapse')
}


/**
 * Make the field required by adding the necessary indicator and attributes
 *
 * @return {void}
 */
BsField.prototype.makeRequired = function () {
  this.widget.classList.add('required')
  this.inputs.forEach(function (element, index) {
    element.setAttribute('required', '')
  })
}


/**
 * Remove the required indicator and attribute from the field
 *
 * @return {void}
 */
BsField.prototype.removeRequired = function () {
  this.widget.classList.remove('required')
  this.inputs.forEach(function (element, index) {
    element.removeAttribute('required')
  })
}


/**
 * Display (i.e., uncollapse) the widget
 *
 * @return {void}
 */
BsField.prototype.show = function () {
  if (this.is_required) this.makeRequired()
  if (this.widget.classList.contains('collapse')) {
    this.widget.classList.add('show')
  } else {
    this.widget.style.display = 'block'
  }
}


/**
 * Returns the value of the field
 *
 * @return {str} Value of the field input/selected field input
 */
BsField.prototype.val = function () {
  if (this.inputs.length == 0) {
    return undefined
  } else if (this.inputs.length == 1) {
    if (this.inputs[0].type == 'checkbox') {
      // TODO: return the .value if checked
    } else {
      return this.inputs[0].value
    }
  } else {
    if (this.inputs[0].type == 'radio') {
      let item = document.querySelector(this._selector + ':checked')
      if (item === null) return null
      return item.value
    } else {
      var val = ''
      this.inputs.forEach(function (element, index) {
        val += element.value + ' '
      })
      return val.trim()
    }
  }
}
