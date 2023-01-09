/**
 * Javascript to make the Date Time Calendar widget work
 */

(function (DateTimeCalendar, undefined)
{
    /*** PROPERTIES ***/
    // DateTimeCalendar.DateTime = null


    /*** METHODS ***/
    function _current_month_display (widget) {
      return widget.querySelector('.datetimecalendar .date-header span')
    }

    function _value_display (widget) {
      return widget.querySelector('input[type="text"][disabled]')
    }

    function _value_input (widget) {
      return widget.querySelector('input[type="hidden"]')
    }


    function init () {
      let widgets = document.querySelectorAll('.DateTimeCalendarWidget')
      Array.from(widgets).forEach(function (widget, index) {
        let dt            = luxon.DateTime.fromSQL(_value_input(widget).value)
        let display       = _value_display(widget)
        let month_display = _current_month_display(widget)

        display.value = dt.toLocaleString(luxon.DateTime.DATE_FULL)
        month_display.textContent = dt.toFormat('LLLL yyyy')
        render_calendar(widget, dt)
      })
    }


    function render_calendar (widget, dt) {
      let first = dt.startOf('month')
      let last  = dt.endOf('month')
      var cal   = widget.querySelector('.date-picker')

      console.log(first.weekday)
      for (i = 1; i <= first.weekday; i++) {
        let div_empty = document.createElement('div')
        div_empty.classList.add('date')
        div_empty.classList.add('empty')
        cal.append(div_empty)
      }
      for (i = 1; i <= last.day; i++) {
        let div_day = document.createElement('div')
        div_day.classList.add('date')
        div_day.textContent = i
        cal.append(div_day)
      }
    }





    /*** INITIALIZATION ***/
    document.addEventListener('DOMContentLoaded', init, false);


    /*** EVENT HANDLERS ***/


}( window.DateTimeCalendar = window.DateTimeCalendar || {}))

