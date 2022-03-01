class Member < ApplicationRecord
  belongs_to :team
  has_and_belongs_to_many :projects, :join_table => :project_members

  validates :first_name, presence: true
  validates :last_name, presence: true
end
