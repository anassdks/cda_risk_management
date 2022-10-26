Rails.configuration.to_prepare do
  require 'cda_risk_management/patches/models/easy_risk_patch'
  require 'cda_risk_management/patches/helpers/issues_helper_patch'
  require 'cda_risk_management/patches/others/epm_easy_risks_patch'
  require 'cda_risk_management/patches/others/epm_easy_query_base_patch'
  require 'cda_risk_management/patches/models/easy_risk_query_patch'
end
