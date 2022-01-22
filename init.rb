Redmine::Plugin.register :cda_risk_management do
  name 'CDA risk management plugin'
  author 'AKKA Technologies'
  description 'This is a plugin to override some funtionalities in easy_risk_management plugin'
  version '0.2.0'

  settings default: { phase_cf_id: nil}, :partial => 'settings/cda_risk_management_settings'
end



require 'cda_risk_management'

# Little hack for deface in redmine:
# - redmine plugins are not railties nor engines, so deface overrides are not detected automatically
# - deface doesn't support direct loading anymore ; it unloads everything at boot so that reload in dev works
# - hack consists in adding "app/overrides" path of all plugins in Redmine's main #paths
Rails.application.paths["app/overrides"] ||= []
Dir.glob("#{Rails.root}/plugins/*/app/overrides").each do |dir|
  Rails.application.paths["app/overrides"] << dir unless Rails.application.paths["app/overrides"].include?(dir)
end