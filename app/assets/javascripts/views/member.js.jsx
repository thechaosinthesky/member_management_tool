class MemberForm extends React.Component {
  constructor(props) {
    super(props);
    let saveUrl = SPRINT.rootUrl + "/members";
    if(props.attrs.id) saveUrl += "/" + props.attrs.id;
    const method = props.attrs.id ? "PUT" : "POST";
    this.state = {
      valid: true,
      id: props.attrs.id,
      first_name: props.attrs.first_name,
      last_name: props.attrs.last_name,
      city: props.attrs.city,
      state: props.attrs.state,
      country: props.attrs.country,
      team_id: props.attrs.team_id,
      team_name: props.attrs.team_name,
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
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        city: this.state.city,
        state: this.state.state,
        country: this.state.country,
        team_id: this.state.team_id
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
    let isValid = true;
    let checkName = "";

    if(this.state.first_name) checkName = $.trim(this.state.first_name);
    isValid = (isValid && (checkName.length > 0));

    if(this.state.last_name) checkName = $.trim(this.state.last_name);
    isValid = (isValid && (checkName.length > 0));

    this.setState({valid: isValid});
    return isValid;
  }

  handleFirstNameChange(event) {
    this.setState({first_name: event.target.value});
  }

  handleLastNameChange(event) {
    this.setState({last_name: event.target.value});
  }

  handleCityChange(event) {
    this.setState({city: event.target.value});
  }

  handleStateChange(event) {
    this.setState({state: event.target.value});
  }

  handleCountryChange(event) {
    this.setState({country: event.target.value});
  }

  handleTeamChange(event) {
    this.setState({team_id: event.target.value});
  }

  render() {
    const formClassName = this.state.valid ? "" : "was-validated";
    const requiredInputClassName = this.state.valid ? "form-control" : "form-control is-invalid";
    const header = this.state.id ? <h2 className="page-header">Edit Member</h2> : <h2 className="page-header">New Member</h2>;
    return (
      <div>
        {header}
        <form ref={this.formRef} className={formClassName}>
          <div className="row mb-3 mt-3">
            <div className="col-10 offset-1">

              <div className="row mb-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input required className={requiredInputClassName} id="firstName" value={this.state.first_name} onChange={(e) => {this.handleFirstNameChange(e)}} />
                  <div className="invalid-feedback">
                    Please enter a first name.
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input required className={requiredInputClassName} id="lastName" value={this.state.last_name} onChange={(e) => {this.handleLastNameChange(e)}} />
                  <div className="invalid-feedback">
                    Please enter a last name.
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-4">
                  <label htmlFor="city" className="col-sm-2 form-label">City</label>
                  <input className="form-control" value={this.state.city} onChange={(e) => {this.handleCityChange(e)}} />
                </div>

                <div className="col-sm-4">
                  <label htmlFor="city" className="col-sm-2 form-label">State</label>
                  <input className="form-control" value={this.state.state} onChange={(e) => {this.handleStateChange(e)}} />
                </div>

                <div className="col-sm-4">
                  <label htmlFor="country" className="col-sm-2 form-label">Country</label>
                  <input className="form-control" value={this.state.country} onChange={(e) => {this.handleCountryChange(e)}} />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-12">
                  <label htmlFor="teamName" className="form-label">Team</label>
                  <AjaxSelect required value={this.state.team_id} uriPath="/teams.json" onSelectChange={(e) => this.handleTeamChange(e)} />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-sm-12">
                  <button className="btn btn-primary" onClick={(e) => this.handleSubmit(e)}>Submit</button>
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>
    )
  }
}

class MemberAddress extends React.Component {
  render() {
    const city = this.props.attrs.city;
    const state = this.props.attrs.state;
    const country = this.props.attrs.country;

    if(city.length > 0 && state.length > 0){
      return(
        <address className="card-text">
          {city}, {state}
          <br />
          {country}
        </address>
      )
    }
    else if(country.length > 0){
      return(
        <address className="card-text">{country}</address>
      )
    }
    else{
      return(
        <address className="card-text"><i>Remote</i></address>
      )
    }
  }
}

class MemberDetails extends React.Component {
  deleteMember() {
    if(confirm("Are you sure you want to delete this member?")){
      $.ajax({
        url: SPRINT.rootUrl + "/members/" + this.props.attrs.id,
        method: "DELETE",
        contentType: "application/json",
        dataType: "json",
        success: function(results){
          window.location = SPRINT.rootUrl + "/members";
        },
        error: function(){
          SPRINT.showAlert("Something went wrong, please try again", "danger");
        }
      });
    }
  }

  render() {
    return(
      <div>
        <div className="card" style={{"position": "relative", "width": "20rem", "margin": "auto"}}>
          <div className="card-header" style={{"position": "relative"}}>
            <div className="btn-group" style={{"position": "absolute", "top": "0", "right": "0"}}>
              <button onClick={this.props.onEditClick} className="btn btn-outline-info btn-sm"><i className="fa fa-pencil"></i>&nbsp;Edit</button>
              <button onClick={() => this.deleteMember()} className="btn btn-outline-info btn-sm"><i className="fa fa-close"></i>&nbsp;Delete</button>
            </div>
            <MemberAvatar attrs={this.props.attrs} />
          </div>
          <div className="card-body">
            <h5 className="card-title">{this.props.attrs.first_name} {this.props.attrs.last_name}</h5>

            <p>
              <strong>Team:</strong>
              {this.props.attrs.team_name}
            </p>

            <MemberAddress attrs={this.props.attrs} />

          </div>
        </div>
      </div>
    )
  }
}

class MemberProjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false
    };
  }

  handleMemberProjectChange(event) {
    this.setState({member_project_id: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    $.ajax({
      url: SPRINT.rootUrl + "/members/" + this.props.memberId + "/projects/" + this.state.member_project_id,
      method: "PATCH",
      contentType: "application/json",
      dataType: "json",
      success: function(results){
        location.reload();
      },
      error: function(){
        location.reload();
      }
    });
  }

  render() {
    if(this.state.editMode){
      return(
        <div className="row g-0">
          <div className="col-8 offset-2">
            <form className="row row-cols-lg-auto g-3 align-items-center">
              <div className="col-12">
                <strong>Add Member Project:</strong>
                </div>
                <div className="col-12">
                <AjaxSelect uriPath="/projects.json" onSelectChange={(e) => this.handleMemberProjectChange(e)} />
              </div>
              <div className="col-12">
                <button className="btn btn-primary" onClick={(e) => this.handleSubmit(e)}>Add</button>
              </div>
              <div className="col-12">
                <button className="btn btn-default" onClick={() => {this.setState({"editMode": false})}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )
    }
    else{
      return(
        <button className="btn btn-primary" onClick={() => {this.setState({"editMode": true})}}>
          <i className="fa fa-plus"></i>&nbsp;&nbsp;Add Project
        </button>
      )
    }
  }
}

class MemberView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      valid: true,
      id: props.attrs.id,
      first_name: props.attrs.first_name,
      last_name: props.attrs.last_name,
      city: props.attrs.city,
      state: props.attrs.state,
      country: props.attrs.country,
      team_id: props.attrs.team_id,
      team_name: props.attrs.team_name
    };
  }

  toggleEditState() {
    this.setState({editMode: !this.state.editMode});
  }

  saveComplete(newAttrs) {
    this.setState({
      editMode: false,
      first_name: newAttrs["first_name"],
      last_name: newAttrs["last_name"],
      city: newAttrs["city"],
      state: newAttrs["state"],
      country: newAttrs["country"],
      team_id: newAttrs["team_id"],
      team_name: newAttrs["team_name"],
    });
  }

  render() {
    const tableHeader = "Member Projects";
    const projectsUri = "/members/" + this.state.id + "/projects.json";

    let memberBody;
    if(this.state.editMode){
      memberBody = <MemberForm attrs={this.state} onSaveComplete={(newAttrs) => this.saveComplete(newAttrs)} />;
    }
    else{
      memberBody = <MemberDetails attrs={this.state} onEditClick={() => {this.toggleEditState()}} />;
    }

    const backButtonDisplay = this.state.editMode ? "block" : "none";

    return (
      <div>
        <div className="row" style={{display: backButtonDisplay}}>
          <div className="col">
            <button onClick={() => {this.toggleEditState()}} className="btn btn-secondary pull-right">
              <span><i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Back</span>
            </button>
          </div>
        </div>

        {memberBody}
        <br />

        <TableList
          rowComponent={ProjectTableRow}
          tableHeader={tableHeader}
          uriPath={projectsUri}
          showDeleteButton={true}
          parentId={this.props.attrs.id}
        />

        <MemberProjectForm memberId={this.props.attrs.id} />
      </div>
    )
  }
}

class MemberCreateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: true,
      id: props.attrs.id
    };
  }

  saveComplete(newAttrs) {
    window.location = SPRINT.rootUrl + "/members/" + newAttrs["id"];
  }

  render() {
    return (
      <div>
        <MemberForm attrs={this.state} onSaveComplete={(newAttrs) => this.saveComplete(newAttrs)} />
      </div>
    )
  }
}

class MemberListView extends React.Component {
  render() {
    const newMemberLink = SPRINT.rootUrl + "/members/new";

    return (
      <div>
        <TableList
          rowComponent={MemberTableRow}
          tableHeader="Members"
          uriPath="/members.json"
        />

        <a href={newMemberLink} className="btn btn-primary">
          <i className="fa fa-plus"></i>&nbsp;&nbsp;Add New Member
        </a>
      </div>
    )
  }
}

SPRINT.VIEWS.member = {
  init: function(memberAttrs){
     ReactDOM.render(
       <MemberView attrs={memberAttrs} />,
       document.getElementById("member")
     );
  }
};

SPRINT.VIEWS.newMember = {
  init: function(memberAttrs){
     ReactDOM.render(
       <MemberCreateView attrs={memberAttrs} />,
       document.getElementById("new-member")
     );
  }
};

SPRINT.VIEWS.memberList = {
  init: function(){
     ReactDOM.render(
       <MemberListView />,
       document.getElementById("member-list")
     );
  }
};
