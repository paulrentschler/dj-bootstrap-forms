/**
 * Javascript for interacting with a Bootstrap styled form
 */

/**
 * Class that represents a form field
 * @param {string} name -- Value of the input element's "name" attribute
 * @param {bool} collapsable -- Indicates if the widget should be made collapsable
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
 * @param {string} classes -- String of space-separated CSS classes to add
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
 */
BsField.prototype.addEventListener = function (type, listener, options) {
  this.inputs.forEach(function(element, index) {
    element.addEventListener(type, listener, options)
  })
}


/**
 * Hide (i.e., collapse) the widget
 * @return null
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
 * @return null
 */
BsField.prototype.makeCollapsable = function () {
  this.widget.classList.add('collapse')
}


/**
 * Make the field required by adding the necessary indicator and attributes
 * @return null
 */
BsField.prototype.makeRequired = function () {
  this.widget.classList.add('required')
  this.inputs.forEach(function (element, index) {
    element.setAttribute('required', '')
  })
}


/**
 * Remove the required indicator and attribute from the field
 * @return null
 */
BsField.prototype.removeRequired = function () {
  this.widget.classList.remove('required')
  this.inputs.forEach(function (element, index) {
    element.removeAttribute('required')
  })
}


/**
 * Display (i.e., uncollapse) the widget
 * @return null
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
 * @return {string} Value of the field input/selected field input
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
