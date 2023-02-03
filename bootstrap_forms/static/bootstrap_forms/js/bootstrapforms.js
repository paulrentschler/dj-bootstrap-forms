/**
 * Javascript for interacting with a Bootstrap styled form
 */


/**
 * Debouncer
 *
 * Delays execution of a function until the user stops triggering it.
 *
 * Explanations:
 *   - https://www.freecodecamp.org/news/javascript-debounce-example/
 *   - https://blog.bitsrc.io/what-is-debounce-in-javascript-a2b8e6157a5a
 *   - https://chrisboakes.com/how-a-javascript-debounce-function-works/
 *   - https://davidwalsh.name/javascript-debounce-function
 */
function bsf_debounce (callback, wait) {
    let timeout
    return (...args) => {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => callback.apply(context, args), wait)
    }
}



/**
 * Class that represents a form field
 *
 * @param {str} name -- Value of the input element's "name" attribute
 * @param {bool} collapsable -- Indicates if the widget should be made collapsable
 * @return {void}
 */
function BsField(name, collapsable) {
  // remove the "_#" suffix on name, if it exists
  let parts = name.split('_')
  let last  = parts[parts.length - 1]
  let index = parseInt(last)
  if (!isNaN(index)) {
    name = parts.slice(0, parts.length - 1).join('_')
  }

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
  let exists      = false
  var messages    = errorList.querySelectorAll('li')
  let msgElement  = document.createElement('li')
  let widgetClass = (type.trim().toUpperCase() == 'WARNING') ? 'is-warning' : 'is-invalid';
  // remove warnings if adding errors
  if (widgetClass == 'is-invalid' && that.widget.classList.contains('is-warning')) {
    that.clearMessages()
  }
  // determine if the message is already displayed
  messages.forEach(function(item, index) {
    if (item.innerHTML == message) exists = true;
  })
  if (!exists) {
    // display the message
    msgElement.innerHTML = message
    that.widget.classList.add(widgetClass)
    errorList.append(msgElement)
  }
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
 * Indicates if all the inputs have valid content
 *
 * @return {bool}
 */
BsField.prototype.isValid = function () {
  var valid = true
  this.inputs.forEach(function(element, index) {
      if (!element.validity.valid) valid = false;
  })
  if (valid && this.widget.classList.contains('is-warning')) return false;
  return valid
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




/**
 * Check input element for HTML5 validation errors
 *
 * @param  {element} input -- HTML input/textarea element to check
 * @param  {BsField} field -- BsField instance associated with `input`
 * @return {void}
 */
function displayValidationErrors (input, field) {
  let type_ = input.getAttribute('type')
  if (input.validity.valueMissing) {
    field.addMessage('ERROR', 'This field is required.')

  } else if (input.validity.typeMismatch || input.validity.patternMismatch) {
    if (type_ == 'color') {
      field.addMessage('ERROR', 'Please enter a valid color in the format: #RRGGBB')
    } else if (type_ == 'date') {
      field.addMessage('ERROR', 'Please enter a valid date in the format: YYYY-MM-DD')
    } else if (type_ == 'email') {
      field.addMessage('ERROR', 'Please enter a valid email address.')
    } else if (type_ == 'number') {
      field.addMessage('ERROR', 'Please enter a number.')
    } else if (type_ == 'tel') {
      field.addMessage('ERROR', 'Please enter a valid phone number.')
    } else if (type_ == 'time') {
      field.addMessage('ERROR', 'Please enter a valid time in the format: HH:MM am/pm')
    } else if (type_ == 'url') {
      field.addMessage('ERROR', 'Please enter a valid web site address.')
    }

  } else if (input.validity.tooLong) {
    field.addMessage('ERROR', 'Please limit your answer to ' + input.getAttribute('maxlength') + ' characters.')

  } else if (input.validity.tooShort) {
    field.addMessage('ERROR', 'Your answer needs to be at least ' + input.getAttribute('minlength') + ' characters.')

  } else if (input.validity.rangeUnderflow) {
    if (type_ == 'number' || type_ == 'range') {
      field.addMessage('ERROR', 'You must enter/select a value of at least ' + input.getAttribute('min') + '.')
    } else {
      let label = type_
      if (type_ == 'datetime-local') label = 'date/time';
      field.addMessage('ERROR', 'You must enter/select a ' + label + ' after ' + input.getAttribute('min') + '.')
    }

  } else if (input.validity.rangeOverflow) {
    if (type_ == 'number' || type_ == 'range') {
      field.addMessage('ERROR', 'You must enter/select a value less than ' + input.getAttribute('max') + '.')
    } else {
      let label = type_
      if (type_ == 'datetime-local') label = 'date/time';
      field.addMessage('ERROR', 'You must enter/select a ' + label + ' before ' + input.getAttribute('max') + '.')
    }

  } else if (input.validity.stepMismatch) {
    field.addMessage('ERROR', 'Please enter/select a valid value in increments of ' + input.getAttribute('step') + '.')

  } else if (input.validity.badInput) {
    field.addMessage('ERROR', 'Please enter a valid value.')
  }
}


/**
 * Apply custom form validation handling
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#implementing_a_customized_error_message
 */
document.addEventListener(
  'DOMContentLoaded',
  function () {
    const forms = document.querySelectorAll('form')
    forms.forEach(function (form, index) {
      // The form must have the "novalidate" attribute
      //   to apply this custom validation handling
      if (form.getAttribute('novalidate') === null) return;
      if (form.getAttribute('novalidate') == 'debug') return;

      // Add an event listener for user input for all input/textarea elements
      let inputs = form.querySelectorAll('input, textarea')
      inputs.forEach(function (input, subindex) {
        if (['button', 'hidden', 'submit'].indexOf(input.getAttribute('type')) >= 0) return;
        input.addEventListener('input', (event) => {
          let field = new BsField(input.getAttribute('name'))
          let name = input.getAttribute('name')
          if (field.isValid()) {
            field.clearMessages()
          }
          if (!input.validity.valid) {
            displayValidationErrors(input, field)
          }
        })
      })

      // Add an event listener to block form submissions if any fields have errors
      form.addEventListener('submit', (event) => {
        var hasErrors = false
        var firstError = null
        let inputs = event.target.querySelectorAll('input, textarea')
        inputs.forEach(function (input, index) {
          if (['button', 'hidden', 'submit'].indexOf(input.getAttribute('type')) >= 0) return;

          let field = new BsField(input.getAttribute('name'))
          if (field.isValid()) {
            field.clearMessages()
          }
          if (!input.validity.valid) {
            hasErrors = true
            if (firstError === null) firstError = field
            displayValidationErrors(input, field)
          }
        })
        if (firstError !== null) {
          firstError.widget.scrollIntoView({behavior: 'smooth'})
        }
        if (hasErrors) event.preventDefault();
      })
    })
  }
)
