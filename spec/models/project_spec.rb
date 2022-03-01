require 'rails_helper'

RSpec.describe Project, type: :model do
  subject {
    described_class.new(name: "Great Project", description: "the best project")
  }

  let(:main_team) { Team.first }
  let(:member1) { Member.create(first_name: "Bob", last_name: "Smith", city: "Seattle", state: "WA", country: "USA", team: main_team) }
  let(:member2) { Member.create(first_name: "Jane", last_name: "Doe", city: "Pittsburgh", state: "PA", country: "USA", team: main_team) }

  it 'success with valid attributes' do
    expect(subject).to be_valid
  end

  it "is valid without description" do
    subject.description = nil
    expect(subject).to be_valid
  end

  it "is not valid without a name" do
    subject.name = nil
    expect(subject).to_not be_valid
  end

  it "can add members to a project and retrieve them" do
    subject.members << member1
    subject.members << member2
    subject.save
    expect(subject).to be_valid
    expect(subject.members.all.count).to eq(2)
  end

end
