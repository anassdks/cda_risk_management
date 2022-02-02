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
                  entities = entities.reject{|e| e.created_at.strftime('%Y-%m-%d').to_date > settings['given_date'].to_date }
                  entities.each do |entity|
                    journals = Journal.where(journalized_id: entity.id, journalized_type: 'EasyRisk')
                    journals = journals.reject{|j| j.created_on.strftime('%Y-%m-%d').to_date > settings['given_date'].to_date }
                    criticite_apres_pac = ''
                    probabilite_apres_pac = ''
                    severity_id = ''
                    probability_id = ''
                    impact_id = ''
                    journals.reverse.each do |journal|
                      detail_crit_apres_pac = journal.details.detect {|d| d.property == 'cf' && d.prop_key == Setting.plugin_cda_risk_management['criticite_apres_pac_cf_id']}
                      detail_prob_apres_pac = journal.details.detect {|d| d.property == 'cf' && d.prop_key == Setting.plugin_cda_risk_management['probabilite_apres_pac_cf_id']}
                      severity = journal.details.detect {|d| d.property == 'attr' && d.prop_key == 'severity_id'}
                      probability = journal.details.detect {|d| d.property == 'attr' && d.prop_key == 'probability_id'}
                      impact = journal.details.detect {|d| d.property == 'attr' && d.prop_key == 'impact_id'}

                      if !probability.nil? && probability_id == ''
                        probability_id = probability.old_value.to_i
                        entity.probability_id = probability_id
                      end

                      if !impact.nil? && impact_id == ''
                        impact_id = impact.old_value.to_i
                        entity.impact_id = impact_id
                      end

                      if !severity.nil? && severity_id == ''
                        severity_id = severity.old_value.to_i
                        entity.severity_id = severity_id
                      end
                      if !detail_crit_apres_pac.nil? && criticite_apres_pac == ''
                        criticite_apres_pac = detail_crit_apres_pac.old_value
                        entity.impact_apres_pac = criticite_apres_pac
                      end
                      
                      if !detail_prob_apres_pac.nil? && probabilite_apres_pac == ''
                        probabilite_apres_pac = detail_prob_apres_pac.old_value
                        entity.probabilite_apres_pac = probabilite_apres_pac
                      end
                    end
                    
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