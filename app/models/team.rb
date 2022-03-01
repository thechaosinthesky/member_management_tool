class Team < ApplicationRecord
  belongs_to :parent_team, :class_name => 'Team', :optional => true
  has_many :teams, :class_name => 'Team', :foreign_key => 'parent_team_id'

  has_many :members

  validates :name, presence: true
end
