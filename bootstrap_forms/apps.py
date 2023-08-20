from django.apps import AppConfig


class BootstrapFormsConfig(AppConfig):
    name = 'bootstrap_forms'
    verbose_name = 'Bootstrap Forms'

    def ready(self):
        # monkey patch the proper HTML5 input types for dates and times
        from django.forms.widgets import DateInput, TimeInput
        DateInput.input_type = 'date'
        TimeInput.input_type = 'time'
