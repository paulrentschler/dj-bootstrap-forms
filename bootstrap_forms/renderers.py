from django.forms.renderers import TemplatesSetting


class Bootstrap5FormRenderer(TemplatesSetting):
    form_template_name = 'bootstrap_forms/bootstrap5_form.html'
    # formset_template_name = "django/forms/formsets/default.html"

