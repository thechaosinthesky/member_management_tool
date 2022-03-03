# Member Management Tool

A dashboard for creating and maintaining teams, projects, members.

* View the Live Demo Here: [https://aqueous-spire-17449.herokuapp.com](https://aqueous-spire-17449.herokuapp.com)

## Features:

* Create teams that can belong to parent teams in a nested structure

* Create team members

* Add multiple projects for members

## Requirements:

* MySQL DB

* Ruby version: 2.7.5 (for version 2.5.3, checkout git branch ruby_2_5_3)

## Getting Started

Install required gems. Execute:
```
bundle install
```
Setup the database. Execute:
```
rake db:create; rake db:migrate
```
Add starter data to the database. Execute:
```
rake db:seed
```

## Load Application with Test Data
```
rake sprint:generate_data
```

## Unit Tests

To run unit tests execute:
```
rspec
```

## Upcoming features

* Pagination of table lists

* Quick Search feature for table lists

* UI tree hierarchy display of teams structure

* Consolidation of React Components under a React App

* Store and display member history of projects and teams in a membership timeline
