class CreateTeams < ActiveRecord::Migration[5.2]
  def change
    create_table :teams do |t|
      t.string :name, :null => false
      t.string :parent_team_id, :index => true

      t.timestamps
    end
  end
end
