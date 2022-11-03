module CdaRiskManagement
  module Patches
    module EasyRiskQueryPatch

      def self.prepended(base)
        base.alias_method_chain :initialize_available_columns, :severtiy_value_patched
        base.alias_method_chain :initialize_available_filters, :project_id_patched
      end

      def initialize_available_columns_with_severtiy_value_patched
        initialize_available_columns_without_severtiy_value_patched
        group = l("label_filter_group_#{class_name_underscored}")
        on_column_group(group) do
          add_available_column :severity_value_patched, caption: :field_easy_risk_severity_value_patched, sumable: :both, sumable_sql: "easy_risk_enumeration_values.value * enumeration_impact_values_easy_risks.value", joins: [:enumeration_probability_value, :enumeration_impact_value]
        end
      end

      def initialize_available_filters_with_project_id_patched
        initialize_available_filters_without_project_id_patched
        group = l("label_filter_group_#{class_name_underscored}")
        on_filter_group(group) do
          add_available_filter 'project_id', { type: :list_autocomplete, source: 'easy_risk_projects', source_root: 'projects', autocomplete_options: {all_projects: true} } unless project
        end
      end
    end
  end
end

unless EasyRiskQuery.included_modules.include?(CdaRiskManagement::Patches::EasyRiskQueryPatch)
  EasyRiskQuery.prepend(CdaRiskManagement::Patches::EasyRiskQueryPatch)
end
