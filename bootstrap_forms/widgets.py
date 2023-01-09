from django.forms.widgets import Widget


class Message(Widget):
    """Widget that displays a message on the form

    Designed to work with a CharField, this widget displays the "value" of
    the field as the message text.
    """
    template_name = 'bootstrap_forms/widgets/message.html'
