Deface::Override.new(
  virtual_path: 'easy_page_modules/others/_easy_risks_edit',
  replace: "erb[loud]:contains('_compare_to_previous_period_paragraph')",
  template: 'cda_risks/easy_risks_edit',
  method_access: false
)