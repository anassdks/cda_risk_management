# # Plugin's routes
# # See: http://guides.rubyonrails.org/routing.html
# get '/issue_relations', to: 'issue_relations_importer#index', as: 'new_import_issue_relations'
# post '/issue_relations', to: 'issue_relations_importer#import_issue_relations', as: 'create_imports_issue_relations'
# match '/import/:id/issue_relations_settings', to: 'issue_relations_importer#settings', :via => [:get, :post], as: 'issue_relations_import_settings'
# match '/import/:id/mapping', to: 'issue_relations_importer#mapping', :via => [:get, :post], as: 'issue_relations_import_mapping'
# match '/import/:id/run', to: 'issue_relations_importer#run', :via => [:get, :post], as: 'issue_relations_import_run'

# get '/local_issue_relations', to: 'local_issue_relations_importer#index', as: 'new_import_local_issue_relations'
# post '/local_issue_relations', to: 'local_issue_relations_importer#import_local_issue_relations', as: 'create_imports_local_issue_relations'
# match '/local_import/:id/local_issue_relations_settings', to: 'local_issue_relations_importer#settings', :via => [:get, :post], as: 'local_issue_relations_import_settings'
# match '/local_import/:id/mapping', to: 'local_issue_relations_importer#mapping', :via => [:get, :post], as: 'local_issue_relations_import_mapping'
# match '/local_import/:id/run', to: 'local_issue_relations_importer#run', :via => [:get, :post], as: 'local_issue_relations_import_run'

# get '/blocs_closing_time', to: 'bloc_closing_times_importer#index', as: 'new_import_bloc_closing_times'
# post '/blocs_closing_time', to: 'bloc_closing_times_importer#import_bloc_closing_times', as: 'create_imports_bloc_closing_times'
# match '/blocs_closing_time_import/:id/bloc_closing_times_settings', to: 'bloc_closing_times_importer#settings', :via => [:get, :post], as: 'bloc_closing_times_import_settings'
# match '/blocs_closing_time_import/:id/mapping', to: 'bloc_closing_times_importer#mapping', :via => [:get, :post], as: 'bloc_closing_times_import_mapping'
# match '/blocs_closing_time_import/:id/run', to: 'bloc_closing_times_importer#run', :via => [:get, :post], as: 'bloc_closing_times_import_run'

# match '/relation_display_antecedents', to: 'easy_smp_display_relations#display_antecedents', :via => [:get, :post], as: 'easy_smp_relations_display_antecedents'
# match '/relation_display_consequents', to: 'easy_smp_display_relations#display_consequents', :via => [:get, :post], as: 'easy_smp_relations_display_consequents'

# resources :easy_smp_issue_relations_rules
# resources :easy_smp_local_issue_relations_rules
# resources :easy_smp_bloc_closing_times

# get 'download_model_lt', :to => 'easy_smp_local_issue_relations_rules#download', as: 'download_easy_smp_local_issue_relations_rules'
# get 'download_model_rg', :to => 'easy_smp_issue_relations_rules#download', as: 'download_easy_smp_issue_relations_rules'
# get 'download_model_bloc', :to => 'easy_smp_bloc_closing_times#download', as: 'download_easy_smp_bloc_closing_times'

# get 'modop_lt', :to => 'easy_smp_local_issue_relations_rules#modop', as: 'modop_easy_smp_local_issue_relations_rules'
# get 'modop_rg', :to => 'easy_smp_issue_relations_rules#modop', as: 'modop_easy_smp_issue_relations_rules'
# get 'modop_bloc', :to => 'easy_smp_bloc_closing_times#modop', as: 'modop_easy_smp_bloc_closing_times'


