from django.apps import AppConfig


def a11y__build_widget_attrs(self, attrs, widget=None):
    widget = widget or self.field.widget
    attrs = dict(attrs)  # Copy attrs to avoid modifying the argument.
    if (
        widget.use_required_attribute(self.initial)
        and self.field.required
        and self.form.use_required_attribute
    ):
        # MultiValueField has require_all_fields: if False, fall back
        # on subfields.
        if (
            hasattr(self.field, "require_all_fields")
            and not self.field.require_all_fields
            and isinstance(self.field.widget, MultiWidget)
        ):
            for subfield, subwidget in zip(self.field.fields, widget.widgets):
                subwidget.attrs["required"] = (
                    subwidget.use_required_attribute(self.initial)
                    and subfield.required
                )
        else:
            attrs["required"] = True
    if self.field.disabled:
        attrs["disabled"] = True

    # Borrowed from Django 5.0
    # If a custom aria-describedby attribute is given (either via the attrs
    # argument or widget.attrs) and help_text is used, the custom
    # aria-describedby is preserved so user can set the desired order.
    if (
        not attrs.get('aria-describedby')
        and not widget.attrs.get('aria-describedby')
        and self.field.help_text
        and self.id_for_label
    ):
        attrs['aria-describedby'] = f'{self.id_for_label}_helptext'
    return attrs


class BootstrapFormsConfig(AppConfig):
    name = 'bootstrap_forms'
    verbose_name = 'Bootstrap Forms'

    def ready(self):
        # monkey patch the proper HTML5 input types for dates and times
        from django.forms.widgets import DateInput, TimeInput
        DateInput.input_type = 'date'
        TimeInput.input_type = 'time'

        from django.forms.boundfield import BoundField
        BoundField.build_widget_attrs = a11y__build_widget_attrs
