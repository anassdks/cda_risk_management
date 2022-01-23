module CdaRiskManagement 
  module Patches
    module EasyRiskPatch
      def self.prepended(base)
        base.class_eval do
          before_validation :check_plan_action
          after_save :check_partage_client


          def probability_value_pac
            prob_apres_pac = CustomValue.where(custom_field_id: Setting.plugin_cda_risk_management['probabilite_apres_pac_cf_id'].to_i, customized_id: self.id).first.value
            if !prob_apres_pac.nil? 
              prob_apres_pac = prob_apres_pac.delete("^0-9-.").to_i
            end
            BigDecimal(prob_apres_pac)
          end
        
          def impact_value_pac
            impact_apres_pac = CustomValue.where(custom_field_id: Setting.plugin_cda_risk_management['criticite_apres_pac_cf_id'].to_i, customized_id: self.id).first.value
            if !impact_apres_pac.nil?
              impact_apres_pac = impact_apres_pac.delete("^0-9-.").to_i
            end
            BigDecimal(impact_apres_pac)
          end
        
          def severity_value_pac
            probability_value_pac * impact_value_pac
          end

          def change_severity_pac
            range = EasyRiskEnumerationRange.all.detect{|r| r.range.cover?(severity_value_pac) }
            self.severity = range&.enumeration
          end
        
        end
      end
    
      # Patch pour implémentation des règles de gestion de CDA
      # avant enregistrement de la tâche
  
      def check_plan_action
        plan_action = get_custom_value(Setting.plugin_cda_risk_management['plan_action_cf_id'].to_i).to_i
        probabilite = get_custom_value(Setting.plugin_cda_risk_management['probabilite_apres_pac_cf_id'].to_i)
        criticite = get_custom_value(Setting.plugin_cda_risk_management['criticite_apres_pac_cf_id'].to_i)

        if plan_action == 1
          if self.solution.empty?
            errors.add :base, "La solution doit être remplie!"
          end
          if probabilite.empty? || probabilite.nil? 
            errors.add :base, "La Probabilité après PAC doit être remplie!"
          end
          if criticite.empty? || criticite.nil? 
            errors.add :base, "La Criticité après PAC doit être remplie!"
          end
        elsif plan_action != 1
          if !self.solution.empty?
            errors.add :base, "La solution doit être vide!"
          end
          if !probabilite.empty?
            errors.add :base, "La Probabilité après PAC doit être vide!"
          end
          if !criticite.empty?
            errors.add :base, "La Criticité après PAC doit être vide!"
          end
        end
      end

      def check_partage_client
        partage_client = get_custom_value(Setting.plugin_cda_risk_management['partage_client_cf_id'].to_i).to_i
        id_client = get_custom_value(Setting.plugin_cda_risk_management['id_client_cf_id'].to_i)

        project_risks = EasyRisk.where(project_id: self.project_id).map(&:id)
        external_string_ids = CustomValue.where(custom_field_id:Setting.plugin_cda_risk_management['id_client_cf_id'].to_i, customized_id: project_risks).map(&:value)
        external_ids = external_string_ids.map{|i| i.chars.last(4).join }
        max_id = external_ids.max.to_i
        # max_id = CustomValue.where(custom_field_id:Setting.plugin_cda_risk_management['id_client_cf_id'].to_i).maximum('value').to_i
        if partage_client == 1
          if id_client == ''
            new_id = max_id + 1
            new_value = self.project.name + '-' + format('%04d', new_id)
            update_custom_value(Setting.plugin_cda_risk_management['id_client_cf_id'].to_i, new_value)
          end
        elsif partage_client == 0
          update_custom_value(Setting.plugin_cda_risk_management['id_client_cf_id'].to_i, '')
        end                         

      end

      private

      def get_custom_value(custom_field_id)
        cv = self.custom_field_values.detect { |i| i.custom_field_id == custom_field_id }.try(:value)
        if cv.nil?
          cv = ''
        else 
          cv
        end
      end

      def update_custom_value(custom_field_id, value)
        custom_value = CustomValue.find_or_create_by(custom_field_id: custom_field_id, customized_type: "EasyRisk", customized_id: self.id)
        custom_value.update(value: value)
      end
    end
  end
end

unless EasyRisk.included_modules.include?(CdaRiskManagement::Patches::EasyRiskPatch)
  EasyRisk.prepend(CdaRiskManagement::Patches::EasyRiskPatch)
end