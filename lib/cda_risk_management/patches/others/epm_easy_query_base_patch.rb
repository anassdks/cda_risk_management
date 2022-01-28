module CdaRiskManagement 
  module Patches
    module EpmEasyQueryBasePatch
      def self.prepended(base)
        base.class_eval do
          def get_show_data(settings, user, page_context = {})
            query = get_query(settings, user, page_context)
        
            if page_zone_module && query&.valid?
              case output(settings)
              when 'chart', 'list', 'tiles'
                if page_zone_module.settings['daily_snapshot'] == '1'
                  query = get_snapshot_query(query, settings)
                end
                entities = get_entities(query, settings)
              when 'calendar'
                calendar = query.build_calendar(user: user, start_date: (settings['start_date'].to_date rescue nil), period: settings['period'])
              else
                entities = get_entities(query, settings)
                prop_keys = [Setting.plugin_cda_risk_management['criticite_apres_pac_cf_id'].to_i, Setting.plugin_cda_risk_management['probabilite_apres_pac_cf_id'].to_i]
                if settings['given_date'] != '' && !settings['given_date'].nil?
                  # entities = entities.reject{|e| e.created_at.strftime('%Y-%m-%d').to_date > settings['given_date'].to_date }
                  entities.each do |entity|
                    journals = Journal.where(journalized_id: entity.id, journalized_type: 'EasyRisk')
                    journals = journals.reject{|j| j.created_on.strftime('%Y-%m-%d').to_date > settings['given_date'].to_date }
                    criticite = ''
                    journals.reverse.each do |journal|
                      detail_crit = journal.details.detect {|d| d.property == 'cf' && d.prop_key == Setting.plugin_cda_risk_management['criticite_apres_pac_cf_id']}
                      detail_prob = journal.details.detect {|d| d.property == 'cf' && d.prop_key == Setting.plugin_cda_risk_management['probabilite_apres_pac_cf_id']}
                      if !detail_crit.nil? && criticite == ''
                        criticite = detail_crit.old_value
                      end
                      if !detail_prob.nil? && criticite == ''
                        criticite = detail_prob.old_value
                      end
                    end
                    
                  end
                  issues_ids = entities.map(&:id)
                  journals_ids = Journal.where(journalized_id: issues_ids, journalized_type: 'EasyRisk').map(&:id)
                  journal_details = JournalDetail.where(journal_id: journals_ids, property: 'cf', prop_key: prop_keys)

                  entities.each do |entity|
                    prob_apres_pac = CustomValue.where(custom_field_id: Setting.plugin_cda_risk_management['probabilite_apres_pac_cf_id'].to_i, customized_id: entity.id).first.value
                    impact_apres_pac = CustomValue.where(custom_field_id: Setting.plugin_cda_risk_management['criticite_apres_pac_cf_id'].to_i, customized_id: entity.id).first.value
                    if !prob_apres_pac.nil? && !impact_apres_pac.nil?
                      prob_apres_pac = prob_apres_pac.delete("^0-9-.")
                      impact_apres_pac = impact_apres_pac.delete("^0-9-.")
                    end
                    # probability_id: 25, impact_id: 20, severity_id: 30
                    entity.probability_id = 25
                    entity.impact_id = 20
                    entity.severity_id = 30
                    entity.change_severity_pac
                  end
                end 
              end
            end
        
            { query: query, entities: entities, calendar: calendar }
          end
        end
      end
    end
  end
end

unless EpmEasyQueryBase.included_modules.include?(CdaRiskManagement::Patches::EpmEasyQueryBasePatch)
  EpmEasyQueryBase.prepend(CdaRiskManagement::Patches::EpmEasyQueryBasePatch)
end