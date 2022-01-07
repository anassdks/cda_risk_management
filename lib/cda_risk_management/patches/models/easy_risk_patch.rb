module CdaRiskManagement 
  module Patches
    module EasyRiskPatch
      def self.prepended(base)
        base.class_eval do
          before_validation :check_cda_rules
        end
      end
    
      # Patch pour implémentation des règles de gestion de CDA
      # avant enregistrement de la tâche
      def check_cda_rules
        self.check_plan_action
      end

      # ila kan plan d'action 'non' Probabilité après PAC et impact après PAC
  
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

      private

      def get_custom_value(custom_field_id)
        cv = self.custom_field_values.detect { |i| i.custom_field_id == custom_field_id }.try(:value)
        if cv.nil?
          cv = ''
        else 
          cv
        end
      end
    end
  end
end

unless EasyRisk.included_modules.include?(CdaRiskManagement::Patches::EasyRiskPatch)
  EasyRisk.prepend(CdaRiskManagement::Patches::EasyRiskPatch)
end