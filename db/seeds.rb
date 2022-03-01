# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

main_team = Team.find_or_create_by(name: 'Sprint Team')

product_team = Team.where(name: 'Product')
product_team = Team.create(name: 'Product', parent_team: main_team) unless product_team.present?

dev_team = Team.where(name: 'Development')
dev_team = Team.create(name: 'Development', parent_team: main_team) unless dev_team.present?

design_team = Team.where(name: 'Design')
design_team = Team.create(name: 'Design', parent_team: main_team) unless design_team.present?

empire = Project.where(name: 'Empire')
empire = Project.create(name: 'Empire', description: 'New feature development') unless empire.present?

rebellion = Project.where(name: 'Rebellion')
rebellion = Project.create(name: 'Rebellion', description: 'Technical debt and product performance enhancements') unless rebellion.present?
