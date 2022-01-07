Rails.configuration.to_prepare do
  require 'cda_risk_management/patches/models/easy_risk_patch'
end