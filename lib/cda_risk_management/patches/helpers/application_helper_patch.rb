module CdaRiskManagement
  module Patches
    module ApplicationHelperPatch

      def self.prepended(base)

        base.class_eval do
          def get_epm_easy_query_base_toggling_container_options_patched(page_module, options = {})
            tc_options = {}

            block_name, easy_page_modules_data = options[:block], options[:easy_page_modules_data]
            query                              = easy_page_modules_data[:query] if easy_page_modules_data

            if query
              if !options[:edit]
                presenter = present(query)
                presenter.outputs.first.apply_settings if presenter.outputs.first
                query_name = query.name.to_s

                # BEGIN PATCH
                unless page_module.settings[:after_pac].nil?
                  after_pac = page_module.settings[:after_pac]
                  given_date = page_module.settings[:given_date]
                  entities = easy_page_modules_data[:entities]
                  if after_pac && (given_date == '' || given_date.nil?)
                    count = entities.count{ |e| !e.impact_value_pac.zero? && !e.probability_value_pac.zero? }
                  elsif given_date!= '' && !given_date.nil?
                    count = entities.count{ |e| !e.impact_value_given_date.zero? && !e.probability_value_given_date.zero? }
                  elsif given_date!= '' && !given_date.nil? && after_pac
                    count = entities.count{ |e| !e.impact_value_pac_given_date.zero? && !e.probability_value_pac_given_date.zero? }
                  else
                    count = entities.count{ |e| !e.impact_value.zero? && !e.probability_value.zero? }
                  end
                  query_name << " (#{count})" if query.display_entity_count?
                else
                  query_name << " (#{query.entity_count})" if query.display_entity_count?
                end
                # END PATCH

                if query_path = query.path(outputs: ['list'] | query.outputs)
                  heading ||= link_to(query_name, query_path, :title => l(:label_user_saved_query, :queryname => query.name), :target => '_blank', :class => 'do_not_toggle')
                else
                  heading ||= query_name
                end

                if page_module.cache_on?
                  heading << ' <span class="small">(cached)</span>'.html_safe
                end

                tc_options[:heading]       = heading
                tc_options[:heading_links] = []

                # presenter.outputs.each(:available) do |output|
                #   next unless output.configured?
                #   tc_options[:heading_links] << link_to('', update_my_page_module_view_path(page_module.uuid, :project_id => query.project, :template => page_module.is_a?(EasyPageTemplateModule) ? '1' : '0', :block_name => block_name, block_name.to_s => {'outputs' => [output.key]}, :format => :js), :class => "icon icon-#{output.key}", :remote => true, :title => l(output.key, :scope => [:title_easy_query_change_output]))
                # end
                presenter.outputs.first.restore_settings if presenter.outputs.first
              else
                if page_module.settings[:query_type] == '1'
                  query_id         = page_module.settings[:query_id]
                  saved_query_name = EasyQuery.where(id: query_id).pluck(:name)
                  heading          = saved_query_name.first if saved_query_name.present?
                else
                  heading = query.name
                end

                if heading.present?
                  heading              = "#{page_module.module_definition.translated_name}: <span class='small'>#{heading}</span>"
                  tc_options[:heading] = content_tag(:span, heading.html_safe)
                end
              end

              tc_options[:wrapping_heading_element_classes] = entity_css_icon(query.entity)
            end

            tc_options
          end
        end
      end
    end
  end
end

unless ApplicationHelper.included_modules.include?(CdaRiskManagement::Patches::ApplicationHelperPatch)
  ApplicationHelper.prepend(CdaRiskManagement::Patches::ApplicationHelperPatch)
end
