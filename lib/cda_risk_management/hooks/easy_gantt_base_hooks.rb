module CdaRiskManagement
  class Hooks < Redmine::Hook::ViewListener
    render_on(:view_layouts_base_body_top, partial: 'cda_risks/_cda_css')
  end
end
