module CdaRiskManagement
  module Patches
    module EasyAutoCompletesControllerPatch

      def self.prepended(base)

        base.class_eval do
          def easy_risk_projects
            # if params.has_key?(:autocomplete_options) && params[:autocomplete_options].has_key?(:all_projects) && params[:autocomplete_options][:all_projects]
              @projects = get_visible_easy_risk_projects(params[:term])
            # else
            #   @projects = get_visible_easy_risk_projects(params[:term], EasySetting.value('easy_select_limit').to_i)
            # end
            respond_to do |format|
              format.api { render template: 'easy_auto_completes/projects_with_id', formats: [:api] }
            end
          end

          def my_projects
            @projects = Project.search_results(params[:term], User.current, nil, titles_only: true)

            respond_to do |format|
              format.api { render :template => 'easy_auto_completes/projects_with_url', :formats => [:api] }
            end
          end

          def visible_projects
            @projects = get_visible_projects(params[:term])

            @additional_options = []
            @additional_options << ["--- #{l(:label_in_modules)} ---", ''] if params[:include_system_options]&.include?('no_filter')

            respond_to do |format|
              format.api { render template: 'easy_auto_completes/projects_with_id', locals: { additional_select_options: @additional_options }, formats: [:api]
              }
            end
          end

          def visible_active_projects
            @projects = get_visible_projects_scope(params[:term]).active_and_planned.to_a

            respond_to do |format|
              format.api { render :template => 'easy_auto_completes/projects_with_id', :formats => [:api] }
            end
          end

          def project_templates
            @projects = get_template_projects(params[:term])

            respond_to do |format|
              format.api { render :template => 'easy_auto_completes/projects_with_id', :formats => [:api] }
            end
          end

          def add_issue_projects
            @projects = get_visible_projects_with_permission(:add_issues, params[:term])

            respond_to do |format|
              format.api { render :template => 'easy_auto_completes/projects_with_id', :formats => [:api] }
            end
          end

          def allowed_target_projects_on_move
            @projects = get_visible_projects_with_permission(:move_issues, params[:term])

            respond_to do |format|
              format.api { render :template => 'easy_auto_completes/projects_with_id', :formats => [:api] }
            end
          end

          private

          def get_visible_easy_risk_projects(term = '', limit = nil)
            get_visible_projects_scope(term, limit).active.has_module(:easy_risk_management)
          end
        end
      end
    end
  end
end

unless EasyAutoCompletesController.included_modules.include?(CdaRiskManagement::Patches::EasyAutoCompletesControllerPatch)
  EasyAutoCompletesController.prepend(CdaRiskManagement::Patches::EasyAutoCompletesControllerPatch)
end
