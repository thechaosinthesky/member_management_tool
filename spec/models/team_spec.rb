require 'rails_helper'

RSpec.describe Team, type: :model do
  let(:main_team) { Team.first }

  subject {
    described_class.new(name: "Team Awesome", parent_team: main_team)
  }

  let(:team2) { Team.create(name: "Team 2", parent_team: subject) }
  let(:team3) { Team.create(name: "Team 3", parent_team: subject) }

  it 'success with valid attributes' do
    expect(subject).to be_valid
  end

  it 'valid without a parent team' do
    subject.parent_team_id = nil
    expect(subject).to be_valid
  end

  it "is not valid without a name" do
    subject.name = nil
    expect(subject).to_not be_valid
  end

  it "can access parent team" do
    expect(subject.parent_team.id).to eq(main_team.id)
  end

  it "can access child teams" do
    # Create lazy loaded child teams
    team2
    team3
    expect(subject.teams.count).to eq(2)
  end

end
