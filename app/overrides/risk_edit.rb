# if !@epzm.nil?
#   @div = 'div#module_inside_modal_' + @epzm.uuid + '_compare_to_previous_period_paragraph'
# else 
#   @div = ''
# end
# Deface::Override.new(
#   virtual_path: 'easy_page_modules/others/_easy_risks_edit',
#   replace: 'div#module_inside_modal_' + @epzm.uuid + '_compare_to_previous_period_paragraph',
#   template: 'cda_risks/easy_risks_edit',
#   method_access: false
# )