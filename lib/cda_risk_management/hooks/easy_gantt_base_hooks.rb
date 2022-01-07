module EasySmpGantt
  class Hooks < Redmine::Hook::ViewListener
    render_on(:view_layouts_base_body_bottom, partial: 'gantt/gantt_js')
    render_on(:view_layouts_base_body_top, partial: 'gantt/gantt_css')
  end
end
