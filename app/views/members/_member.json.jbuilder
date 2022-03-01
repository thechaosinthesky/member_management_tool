json.extract! member, :id, :first_name, :last_name, :city, :state, :country, :team_id, :created_at, :updated_at
json.team_name (member.team ? member.team.name : "")
json.url member_url(member, format: :json)
