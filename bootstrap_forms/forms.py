

class Bootstrap5FormMixin():

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.add_css_classes()
        self.set_optional_fields()
        self.label_suffix = ''
        self.error_css_class = 'is-invalid'
        self.required_css_class = 'required'
        self.template_name_label = 'bootstrap_forms/label.html'

    def add_css_classes(self):
        """Adds Bootstrap CSS classes to each widget"""
        for item in self.visible_fields():
            _classes = item.field.widget.attrs.get('class', '').split(' ')
            _input_type = getattr(item.field.widget, 'input_type', '')
            if _input_type == 'radio':
                _classes.append('form-check-input')
            else:
                _classes.append('form-control')
                if _input_type == 'select':
                    _classes.append('form-select')
            item.field.widget.attrs['class'] = ' '.join(set(_classes)).strip()

    def set_optional_fields(self):
        for item in self.visible_fields():
            if item.name in self._optional_fields:
                item.field.required = False
