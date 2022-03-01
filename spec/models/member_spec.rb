require 'rails_helper'

RSpec.describe Member, type: :model do
  let(:main_team) { Team.first }
  subject {
    described_class.new(first_name: "Bob", last_name: "Smith", city: "Seattle", state: "WA", country: "USA", team: main_team)
  }

  it 'success with valid attributes' do
    expect(subject).to be_valid
  end

  it "is valid without city state country" do
    subject.city = nil
    subject.state = nil
    subject.country = nil
    expect(subject).to be_valid
  end

  it "is not valid without a team assigned" do
    subject.team_id = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without first_name" do
    subject.first_name = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without last_name" do
    subject.last_name = nil
    expect(subject).to_not be_valid
  end

end
