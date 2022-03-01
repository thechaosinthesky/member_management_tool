class CreateMembers < ActiveRecord::Migration[5.2]
  def change
    create_table :members do |t|
      t.string :first_name, :null => false
      t.string :last_name, :null => false
      t.string :city
      t.string :state
      t.string :country
      t.string :team_id, :null => false, :index => true

      t.timestamps
    end
  end
end
