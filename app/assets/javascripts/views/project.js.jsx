class ProjectForm extends React.Component {
  constructor(props) {
    super(props);
    let saveUrl = SPRINT.rootUrl + "/projects";
    if(props.attrs.id) saveUrl += "/" + props.attrs.id;
    const method = props.attrs.id ? "PUT" : "POST";
    this.state = {
      valid: true,
      id: props.attrs.id,
      name: props.attrs.name,
      description: props.attrs.description,
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
        description: this.state.description
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

  handleDescChange(event) {
    this.setState({description: event.target.value});
  }

  render() {
    const formClassName = this.state.valid ? "" : "was-validated";
    const requiredInputClassName = this.state.valid ? "form-control" : "form-control is-invalid";
    const header = this.state.id ? <h2 className="page-header">Edit Project</h2> : <h2 className="page-header">New Project</h2>;
    return (
      <div>
        {header}
        <br />
        <form ref={this.formRef} className={formClassName}>
          <div className="row mb-3 mt-3">
            <label htmlFor="projectName" className="col-sm-2 form-label">Project Name</label>
            <div className="col-sm-10">
              <input required className={requiredInputClassName} id="projectName" value={this.state.name} onChange={(e) => {this.handleNameChange(e)}} />
              <div className="invalid-feedback">
                Please enter a project name.
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="projectDesc" className="col-sm-2 form-label">Description</label>
            <div className="col-sm-10">
              <textarea className="form-control" id="projectDesc" value={this.state.description} onChange={(e) => {this.handleDescChange(e)}} aria-describedby="projectDesc" />
              <div id="projectDesc" className="form-text">Main goal or function of this project.</div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={(e) => this.handleSubmit(e)}>Submit</button>
        </form>
      </div>
    )
  }
}

class ProjectDetails extends React.Component {
  render() {
    return(
      <div>
        <h2 className="page-header">
          {this.props.attrs.name}
        </h2>
        <p>
          {this.props.attrs.description}
        </p>
      </div>
    )
  }
}

class ProjectMemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false
    };
  }

  handleProjectMemberChange(event) {
    this.setState({project_member_id: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    $.ajax({
      url: SPRINT.rootUrl + "/projects/" + this.props.projectId + "/members/" + this.state.project_member_id,
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
                <strong>Add Project Member:</strong>
                </div>
                <div className="col-12">
                <AjaxSelect uriPath="/members.json" onSelectChange={(e) => this.handleProjectMemberChange(e)} />
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
          <i className="fa fa-plus"></i>&nbsp;&nbsp;Add Member
        </button>
      )
    }
  }
}

class ProjectView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      valid: true,
      id: props.attrs.id,
      name: props.attrs.name,
      description: props.attrs.description
    };
  }

  toggleEditState() {
    this.setState({editMode: !this.state.editMode});
  }

  deleteProject() {
    if(confirm("Are you sure you want to delete this project?")){
      $.ajax({
        url: SPRINT.rootUrl + "/projects/" + this.state.id,
        method: "DELETE",
        contentType: "application/json",
        dataType: "json",
        success: function(){
          window.location = SPRINT.rootUrl + "/projects";
        },
        error: function(){
          SPRINT.showAlert("Something went wrong, please try again", "danger");
        }
      });
    }
  }

  saveComplete(newAttrs) {
    this.setState({
      editMode: false,
      name: newAttrs["name"],
      description: newAttrs["description"]
    });
  }

  render() {
    const tableHeader = "Project Members";
    const membersUri = "/projects/" + this.state.id + "/members.json";

    let projectBody;
    if(this.state.editMode){
      projectBody = <ProjectForm attrs={this.state} onSaveComplete={(newAttrs) => this.saveComplete(newAttrs)} />;
    }
    else{
      projectBody = <ProjectDetails attrs={this.state} />;
    }

    let editButtonContent;
    if(this.state.editMode){
      editButtonContent = <span><i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Back</span>;
    }
    else{
      editButtonContent = <span><i className="fa fa-pencil"></i>&nbsp;&nbsp;Edit</span>;
    }

    return (
      <div>
        <div className="row">
          <div className="col">
            <div className="btn-group pull-right">
              <button onClick={() => {this.toggleEditState()}} className="btn btn-outline-info pull-right">
                {editButtonContent}
              </button>
              <button onClick={() => {this.deleteProject()}} className="btn btn-outline-info pull-right">
                <span><i className="fa fa-trash"></i>&nbsp;&nbsp;Delete</span>
              </button>
            </div>
          </div>
        </div>

        {projectBody}
        <br />

        <TableList
          rowComponent={MemberTableRow}
          tableHeader={tableHeader}
          uriPath={membersUri}
          showDeleteButton={true}
          parentId={this.props.attrs.id}
        />

        <ProjectMemberForm projectId={this.props.attrs.id} />
      </div>
    )
  }
}

class ProjectCreateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: true,
      id: props.attrs.id,
      name: props.attrs.name,
      description: props.attrs.description
    };
  }

  saveComplete(newAttrs) {
    window.location = SPRINT.rootUrl + "/projects/" + newAttrs["id"];
  }

  render() {
    return (
      <div>
        <ProjectForm attrs={this.state} onSaveComplete={(newAttrs) => this.saveComplete(newAttrs)} />
      </div>
    )
  }
}

class ProjectListView extends React.Component {
  render() {
    const newProjectLink = SPRINT.rootUrl + "/projects/new";

    return (
      <div>
        <TableList
          rowComponent={ProjectTableRow}
          tableHeader="Projects"
          uriPath="/projects.json"
        />

        <a href={newProjectLink} className="btn btn-primary">
          <i className="fa fa-plus"></i>&nbsp;&nbsp;Add New Project
        </a>
      </div>
    )
  }
}

SPRINT.VIEWS.project = {
  init: function(projectAttrs){
    ReactDOM.render(
      <ProjectView attrs={projectAttrs} />,
      document.getElementById("project")
    );
  }
};

SPRINT.VIEWS.newProject = {
  init: function(projectAttrs){
    ReactDOM.render(
      <ProjectCreateView attrs={projectAttrs} />,
      document.getElementById("new-project")
    );
  }
};

SPRINT.VIEWS.projectList = {
  init: function(){
     ReactDOM.render(
       <ProjectListView />,
       document.getElementById("project-list")
     );
  }
};
