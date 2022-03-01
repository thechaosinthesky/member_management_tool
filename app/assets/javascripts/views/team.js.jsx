class TeamForm extends React.Component {
  constructor(props) {
    super(props);
    let saveUrl = SPRINT.rootUrl + "/teams";
    if(props.attrs.id) saveUrl += "/" + props.attrs.id;
    const method = props.attrs.id ? "PUT" : "POST";
    this.state = {
      valid: true,
      id: props.attrs.id,
      name: props.attrs.name,
      parent_team_id: props.attrs.parent_team_id,
      url: saveUrl,
      method: method
    };
    this.formRef = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();
    const isValid = this.validate();
    this.formRef.current.checkValidity();
    if(isValid){
      const obj = {
        id: this.props.id,
        name: this.state.name,
        parent_team_id: this.state.parent_team_id
      };
      const that = this;
      $.ajax({
        url: this.state.url,
        method: this.state.method,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(obj),
        success: function(results){
          that.props.onSaveComplete(results);
        },
        error: function(){
          SPRINT.showAlert("Something went wrong, please try again", "danger");
        }
      });
    }
  }

  validate() {
    let checkName = "";
    if(this.state.name) checkName = $.trim(this.state.name);
    const isValid = (checkName.length > 0);
    this.setState({valid: isValid});
    return isValid;
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleParentTeamChange(event) {
    this.setState({parent_team_id: event.target.value});
  }

  render() {
    const formClassName = this.state.valid ? "" : "was-validated";
    const requiredInputClassName = this.state.valid ? "form-control" : "form-control is-invalid";
    const header = this.state.id ? <h2 className="page-header">Edit Team</h2> : <h2 className="page-header">New Team</h2>;
    return (
      <div>
        {header}
        <form ref={this.formRef} className={formClassName}>
          <div className="row mb-3 mt-3">
            <label htmlFor="teamName" className="col-sm-2 form-label">Team Name</label>
            <div className="col-sm-10">
              <input required className={requiredInputClassName} id="teamName" value={this.state.name} onChange={(e) => {this.handleNameChange(e)}} />
              <div className="invalid-feedback">
                Please enter a team name.
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="teamName" className="col-sm-2 form-label">Parent Team</label>
            <div className="col-sm-10">
              <AjaxSelect uriPath="/teams.json" onSelectChange={(e) => this.handleParentTeamChange(e)} />
            </div>
          </div>

          <button className="btn btn-primary" onClick={(e) => this.handleSubmit(e)}>Submit</button>
        </form>
      </div>
    )
  }
}

class TeamDetails extends React.Component {
  render() {
    const parentTeamName = this.props.attrs.parent_team_id ? this.props.attrs.parent_team_name : "N/A";
    return(
      <div>
        <h2 className="page-header">
          {this.props.attrs.name}
        </h2>
        <div>
          <i>Parent Team:</i> {parentTeamName}
        </div>
      </div>
    )
  }
}

class TeamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      valid: true,
      id: props.attrs.id,
      name: props.attrs.name,
      parent_team_id: props.attrs.parent_team_id,
      parent_team_name: props.attrs.parent_team_name
    };
  }

  deleteTeam() {
    if(confirm("Are you sure you want to delete this team?")){
      $.ajax({
        url: SPRINT.rootUrl + "/teams/" + this.state.id,
        method: "DELETE",
        contentType: "application/json",
        dataType: "json",
        success: function(results){
          window.location = SPRINT.rootUrl + "/teams";
        },
        error: function(){
          location.reload();
        }
      });
    }
  }

  toggleEditState() {
    this.setState({editMode: !this.state.editMode});
  }

  saveComplete(newAttrs) {
    this.setState({
      editMode: false,
      name: newAttrs["name"],
      parent_team_id: newAttrs["parent_team_id"],
      parent_team_name: newAttrs["parent_team_name"],
    });
  }

  render() {
    const tableHeader = "Team Members";
    const membersUri = "/teams/" + this.state.id + "/members.json";

    let projectBody;
    if(this.state.editMode){
      teamBody = <TeamForm attrs={this.state} onSaveComplete={(newAttrs) => this.saveComplete(newAttrs)} />;
    }
    else{
      teamBody = <TeamDetails attrs={this.state} />;
    }

    let editButtonContent;
    if(this.state.editMode){
      editButtonContent = <span><i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Back</span>;
    }
    else{
      editButtonContent = <span><i className="fa fa-pencil"></i>&nbsp;&nbsp;Edit</span>;
    }

    const newMemberLink = SPRINT.rootUrl + "/members/new";

    return (
      <div>
        <div className="row">
          <div className="col">
            <div className="btn-group pull-right">
              <button onClick={() => {this.toggleEditState()}} className="btn btn-outline-info pull-right">
                {editButtonContent}
              </button>
              <button onClick={() => {this.deleteTeam()}} className="btn btn-outline-info pull-right">
                <span><i className="fa fa-trash"></i>&nbsp;&nbsp;Delete</span>
              </button>
            </div>
          </div>
        </div>

        {teamBody}
        <br />

        <TableList
          rowComponent={MemberTableRow}
          tableHeader={tableHeader}
          uriPath={membersUri}
        />

        <a href={newMemberLink} className="btn btn-primary">
          <i className="fa fa-plus"></i>&nbsp;&nbsp;Add New Member
        </a>
      </div>
    )
  }
}

class TeamCreateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: true,
      id: props.attrs.id,
      name: props.attrs.name
    };
  }

  saveComplete(newAttrs) {
    window.location = SPRINT.rootUrl + "/teams/" + newAttrs["id"];
  }

  render() {
    return (
      <div>
        <TeamForm attrs={this.state} onSaveComplete={(newAttrs) => this.saveComplete(newAttrs)} />
      </div>
    )
  }
}

class TeamListView extends React.Component {
  render() {
    const newTeamLink = SPRINT.rootUrl + "/teams/new";

    return (
      <div>
        <TableList
          rowComponent={TeamTableRow}
          tableHeader="Teams"
          uriPath="/teams.json"
        />

        <a href={newTeamLink} className="btn btn-primary">
          <i className="fa fa-plus"></i>&nbsp;&nbsp;Add New Team
        </a>
      </div>
    )
  }
}

SPRINT.VIEWS.team = {
  init: function(teamAttrs){
     ReactDOM.render(
       <TeamView attrs={teamAttrs} />,
       document.getElementById("team")
     );
  }
};

SPRINT.VIEWS.newTeam = {
  init: function(teamAttrs){
     ReactDOM.render(
       <TeamCreateView attrs={teamAttrs} />,
       document.getElementById("new-team")
     );
  }
};

SPRINT.VIEWS.teamList = {
  init: function(){
     ReactDOM.render(
       <TeamListView />,
       document.getElementById("team-list")
     );
  }
};
