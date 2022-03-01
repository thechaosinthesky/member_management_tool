class AddProjectMembers < ActiveRecord::Migration[5.2]
  def change
    create_table :project_members do |t|
      t.references :project, index: true
      t.references :member, index: true

      t.timestamps
    end
  end
end
