class ProjectTableRow extends React.Component {
  removeProject() {
    if(confirm("Are you sure you want to remove this project?")){
      const that = this;
      $.ajax({
        url: SPRINT.rootUrl + "/members/" + this.props.parentId + "/projects/" + this.props.attrs.id,
        method: "DELETE",
        contentType: "application/json",
        dataType: "json",
        success: function(results){
          window.location = SPRINT.rootUrl + "/members/" + that.props.parentId;
        }
      });
    }
  }

  render() {
    const projectUrl = SPRINT.rootUrl + "/projects/" + this.props.attrs.id;
    const description = (this.props.attrs.description && this.props.attrs.description.length > 0) ? <div className="text-muted">{this.props.attrs.description}</div> : "";
    const projectDeleteButton = this.props.showDeleteButton ? <button onClick={() => this.removeProject()} className="pull-right btn btn-danger"><i className="fa fa-close"></i>&nbsp;Remove</button> : <span></span>;

    return(
      <tr>
        <td>
          <div className="row">
            <div className="col-md-12">
              <a href={projectUrl} className="avatarLink">
                <strong>{this.props.attrs.name}</strong>
              </a>
              {projectDeleteButton}
              {description}
            </div>
          </div>
        </td>
      </tr>
    )
  }
}
