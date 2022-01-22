class EasyRisk < ActiveRecord::Base
  include Redmine::SafeAttributes

  belongs_to :project
  belongs_to :author, class_name: 'User'
  belongs_to :assigned_to, class_name: 'User'
  belongs_to :closed_by, class_name: 'User'
  belongs_to :status, class_name: 'EasyRiskStatus'
  belongs_to :probability, class_name: 'EasyRiskProbability'
  belongs_to :impact, class_name: 'EasyRiskImpact'
  belongs_to :response, class_name: 'EasyRiskResponse'
  belongs_to :category, class_name: 'EasyRiskCategory'
  belongs_to :severity, class_name: 'EasyRiskSeverity'

  has_one :enumeration_impact_value, ->{ where(enumeration_type: 'EasyRiskImpact') }, primary_key: :impact_id, foreign_key: :enumeration_id, class_name: 'EasyRiskEnumerationValue'
  has_one :enumeration_probability_value, ->{ where(enumeration_type: 'EasyRiskProbability') }, primary_key: :probability_id, foreign_key: :enumeration_id, class_name: 'EasyRiskEnumerationValue'

  has_one :enumeration_severity_range_value, ->{ where(enumeration_type: 'EasyRiskSeverity') }, primary_key: :severity_id, foreign_key: :enumeration_id, class_name: 'EasyRiskEnumerationRange'

  has_many :easy_entity_assignments, as: :entity_from
  has_many :issues, through: :easy_entity_assignments, source: :entity_to, source_type: 'Issue'

  attr_reader :current_journal
  delegate :notes, :notes=, :private_notes, :private_notes=, to: :current_journal, allow_nil: true

  before_validation :set_default_values
  before_save :close!, if: proc { |r| r.status_id_changed? && EasyRiskStatus.closed_status_ids.include?(r.status_id) }
  before_save :change_severity, if: proc { |r| r.probability_id_changed? || r.impact_id_changed? }

  after_save :create_journal

  validates :name,
    :project,
    :author,
    presence: true
  validates :name, length: 0..255

  html_fragment :description, scrub: :strip
  html_fragment :solution,    scrub: :strip

  safe_attributes 'name',
                  'description',
                  'solution',
                  'project_id',
                  'assigned_to_id',
                  'status_id',
                  'probability_id',
                  'impact_id',
                  'response_id',
                  'category_id',
                  'issue_ids',
                  'custom_field_values',
                  'custom_fields',
                  'notes', if: proc { |easy_risk, user| easy_risk.new_record? || easy_risk.editable?(user) }

  acts_as_customizable
  acts_as_easy_journalized format_detail_reflection_columns: %w[probability_id impact_id response_id severity_id closed_by_id]

  acts_as_event title: proc { |o| "#{l(:project_module_easy_risk_management)} - #{o.name}"},
    url: proc {|o| {controller: 'easy_risks', action: 'show', id: o, project_id: o.project}},
    datetime: :created_at

  acts_as_searchable columns: ["#{table_name}.name", "#{table_name}.description"],
                     preload: [:assigned_to],
                     date_column: :created_at,
                     scope: ->(options) { visible }

  acts_as_attachable

  scope :like, ->(arg) {
    if arg.present?
      pattern = "%#{arg.to_s.strip}%"
      where(Redmine::Database.like("#{table_name}.name", ':p'), { p: pattern })
    end
  }
  scope :sorted, -> { order(:name) }

  scope :visible, ->(*args) {
    options = args.extract_options!
    user = args.shift || User.current
    options[:skip_pre_condition] = true
    joins(project: :enabled_modules).where(EasyRisk.visible_condition(user, options)).where(enabled_modules: {name: 'easy_risk_management'})
  }

  def self.visible_condition(user, options={})
    return Project.allowed_to_condition(user, :view_easy_risks, options) if user.admin?

    Project.allowed_to_condition(user, :view_easy_risks, options) do |role, user|
      if role.easy_risks_visibility == 'all'
        '1=1'
      elsif role.easy_risks_visibility == 'own' && user.id && user.logged?
        user_ids = [user.id] + user.group_ids
        "(#{table_name}.author_id = #{user.id} OR #{table_name}.assigned_to_id IN (#{user_ids.join(',')}))"
      else
        '1=0'
      end
    end
  end

  def assignable_users
    @assignable_users ||= User.active.non_system_flag.easy_type_internal.sorted.to_a
  end

  def css_classes(user = nil, options = {})
    user ||= User.current
    css = []
    if user.logged?
      css << 'multieditable-container'
    end
    if enumeration_severity_range_value
      css << enumeration_severity_range_value.color.to_s
    end
    css.join(' ')
  end

  def editable?(user = nil)
    user ||= User.current
    user.allowed_to?(:manage_easy_risks, project) ||
      (
        user.allowed_to?(:manage_own_easy_risks, project) && [author_id, assigned_to_id].include?(user.id)
      )
  end

  def visible?(user = nil)
    user ||= User.current
    user.allowed_to?(:view_easy_risks, project) do |role, user|
      if role.easy_risks_visibility == 'all'
        true
      elsif role.easy_risks_visibility == 'own'
        author == user || user.is_or_belongs_to?(assigned_to)
      else
        false
      end
    end
  end

  def deletable?(user = nil)
    user ||= User.current
    user.allowed_to?(:delete_easy_risks, project)
  end

  def probability_value
    enumeration_probability_value&.value || 0.0
  end

  def impact_value
    enumeration_impact_value&.value || 0.0
  end

  def severity_value
    probability_value * impact_value
  end

  def is_closed
    status&.easy_is_closed?
  end

  def to_s
    name
  end

  def set_default_values
    self.status ||= EasyRiskStatus.default
    self.probability ||= EasyRiskProbability.default
    self.impact ||= EasyRiskImpact.default
    self.response ||= EasyRiskResponse.default
    self.category ||= EasyRiskCategory.default
    self.severity ||= EasyRiskSeverity.default
  end

  private

  def close!
    self.closed_by = User.current
    self.closed_at = Time.now
  end

  def change_severity
    range = EasyRiskEnumerationRange.all.detect{|r| r.range.cover?(severity_value) }
    self.severity = range&.enumeration
  end
end
