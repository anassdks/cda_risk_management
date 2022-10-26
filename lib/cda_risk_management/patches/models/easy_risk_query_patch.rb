module CdaRiskManagement
  module Patches
    module EasyRiskQueryPatch

      def self.prepended(base)
        base.alias_method_chain :initialize_available_columns, :severtiy_value_patched
      end

      def initialize_available_columns_with_severtiy_value_patched
        initialize_available_columns_without_severtiy_value_patched
        group = l("label_filter_group_#{class_name_underscored}")
        on_column_group(group) do
          add_available_column :severity_value_patched, caption: :field_easy_risk_severity_value, sumable: :both, sumable_sql: "easy_risk_enumeration_values.value * enumeration_impact_values_easy_risks.value", joins: [:enumeration_probability_value, :enumeration_impact_value]
        end
      end
    end
  end
end

unless EasyRiskQuery.included_modules.include?(CdaRiskManagement::Patches::EasyRiskQueryPatch)
  EasyRiskQuery.prepend(CdaRiskManagement::Patches::EasyRiskQueryPatch)
end
