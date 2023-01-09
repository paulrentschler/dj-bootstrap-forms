from django.forms.widgets import DateTimeBaseInput, Widget


class DateTimeCalendar(DateTimeBaseInput):
    format_key = "DATETIME_INPUT_FORMATS"
    template_name = "bootstrap_forms/widgets/datetimecalendar.html"
    input_type = 'datetimecalendar'

    class Media:
        css = {'all': ('bootstrap_forms/css/datetimecalendar.css', )}
        js = ['bootstrap_forms/js/luxon.min.js',
              'bootstrap_forms/js/datetimecalendar.js']

    # def get_context(self, name, value, attrs):
    #     context = super().get_context(name, value, attrs)
    #     context["widget"]["id_for_label"] = self.id_for_label
    #     return context


class Message(Widget):
    """Widget that displays a message on the form

    Designed to work with a CharField, this widget displays the "value" of
    the field as the message text.
    """
    template_name = 'bootstrap_forms/widgets/message.html'
