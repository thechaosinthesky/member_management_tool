json.extract! team, :id, :name, :parent_team_id, :created_at, :updated_at
json.parent_team_name (team.parent_team ? team.parent_team.name : "")
json.url team_url(team, format: :json)
