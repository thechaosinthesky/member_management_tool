namespace :sprint do
  desc "populate the database with test data"
  task generate_data: :environment do
    teams = []
    main_team = Team.find_or_create_by(name: 'Sprint Team')
    teams << main_team

    product_team = Team.where(name: 'Product').first
    product_team = Team.create(name: 'Product', parent_team: main_team) unless product_team.present?
    teams << product_team

    services_team = Team.where(name: 'Support').first
    services_team = Team.create(name: 'Support', parent_team: product_team) unless services_team.present?
    teams << services_team

    dev_team = Team.where(name: 'Development').first
    dev_team = Team.create(name: 'Development', parent_team: main_team) unless dev_team.present?
    teams << dev_team

    tech_debt = Team.where(name: 'Tech Debt').first
    tech_debt = Team.create(name: 'Tech Debt', parent_team: dev_team) unless tech_debt.present?
    teams << tech_debt

    innovate_team = Team.where(name: 'Innov8').first
    innovate_team = Team.create(name: 'Innov8', parent_team: dev_team) unless innovate_team.present?
    teams << innovate_team

    design_team = Team.where(name: 'Design').first
    design_team = Team.create(name: 'Design', parent_team: main_team) unless design_team.present?
    teams << design_team

    projects = []
    empire = Project.where(name: 'Empire').first
    empire = Project.create(name: 'Empire', description: 'New feature development') unless empire.present?
    projects << empire

    rebellion = Project.where(name: 'Rebellion').first
    rebellion = Project.create(name: 'Rebellion', description: 'Technical debt and product performance enhancements') unless rebellion.present?
    projects << rebellion

    10.times do
      proj = Project.create(name: "Project #{Faker::Science.element}", description: Faker::ChuckNorris.fact)
      projects << proj
    end

    100.times do
      # Add member with random team
      team = teams.sample
      member = Member.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name, city: Faker::Address.city, state: Faker::Address.state, country: Faker::Address.country, team: team)
      # add 2 or 3 projects
      max_index = projects.count - 1
      proj_number = rand(2) + 2
      proj_indexes = (0..max_index).to_a.shuffle.take(proj_number)
      proj_indexes.each do |x|
        member.projects << projects[x]
      end
      member.save
    end

  end
end
