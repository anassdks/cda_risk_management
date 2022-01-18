module CdaRiskManagement 
  module Patches
    module IssuesHelperPatch
      def self.prepended(base)
        base.class_eval do

          def render_half_width_custom_fields_rows(issue)
            values = issue.visible_custom_field_values.reject {|value| value.custom_field.full_width_layout?}
            values = values.reject {|value| value.custom_field.id == Setting.plugin_cda_risk_management['consequence_cf_id'].to_i}
            values = values.reject {|value| value.custom_field.id == Setting.plugin_cda_risk_management['cause_cf_id'].to_i}
            
            return if values.empty?
            half = (values.size / 2.0).ceil
            issue_fields_rows do |rows|
              values.each_with_index do |value, i|
                m = (i < half ? :left : :right)
                rows.send m, custom_field_name_tag(value.custom_field), custom_field_value_tag(value), :class => value.custom_field.css_classes
              end
            end
          end
        end
      end
    end
  end
end

unless IssuesHelper.included_modules.include?(CdaRiskManagement::Patches::IssuesHelperPatch)
  IssuesHelper.prepend(CdaRiskManagement::Patches::IssuesHelperPatch)
end