class Project < ApplicationRecord
  has_and_belongs_to_many :members, :join_table => :project_members

  validates :name, presence: true
end
