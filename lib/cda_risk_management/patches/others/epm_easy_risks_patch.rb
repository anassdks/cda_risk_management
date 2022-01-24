module CdaRiskManagement 
  module Patches
    module EpmEasyRisksPatch
      def self.prepended(base)
        base.class_eval do
          def show_path
            'cda_risks/easy_page_modules/easy_risks_show'
          end
          def edit_path
            'cda_risks/easy_page_modules/easy_risks_edit'
          end
        end
      end
    end
  end
end

unless EpmEasyRisks.included_modules.include?(CdaRiskManagement::Patches::EpmEasyRisksPatch)
  EpmEasyRisks.prepend(CdaRiskManagement::Patches::EpmEasyRisksPatch)
end