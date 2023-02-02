from django.forms.widgets import Input, Widget


class Message(Widget):
    """Widget that displays a message on the form

    Designed to work with a CharField, this widget displays the "value" of
    the field as the message text.
    """
    template_name = 'bootstrap_forms/widgets/message.html'


class UsPhoneNumberInput(Input):
    """Widget that collects a validated US phone number

    The default pattern works for US phone numbers in any of these formats:
        - 814-555-1212
        - 814- 555-1212
        - 814-5551212
        - 814555-1212
        - 8145551212
        - (814) 555-1212
        - (814)555-1212
        - (814) 5551212
        - (814)5551212
    """
    input_type = "tel"
    template_name = 'bootstrap_forms/widgets/usphonenumber.html'

    def __init__(self, attrs=None):
        default_pattern = '\(?[0-9]{3}(\)|-)?\s?[0-9]{3}-?[0-9]{4}'
        if attrs is None:
            attrs = {'pattern': default_pattern}
        else:
            attrs = attrs.copy()
            if 'pattern' not in attrs.keys():
                attrs['pattern'] = default_pattern
        super().__init__(attrs)
