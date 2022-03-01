class MemberAvatar extends React.Component {
  render() {
    const avatarClassName = "rounded-circle member-avatar member-avatar-" + (this.props.attrs.id % 5);
    const initials = this.props.attrs.first_name.split("")[0] + this.props.attrs.last_name.split("")[0];
    return(
      <div className={avatarClassName}>{initials}</div>
    )
  }
}

class MemberTableRow extends React.Component {
  removeMember() {
    if(confirm("Are you sure you want to remove this member?")){
      const that = this;
      $.ajax({
        url: SPRINT.rootUrl + "/projects/" + this.props.parentId + "/members/" + this.props.attrs.id,
        method: "DELETE",
        contentType: "application/json",
        dataType: "json",
        success: function(results){
          window.location = SPRINT.rootUrl + "/projects/" + that.props.parentId;
        }
      });
    }
  }

  render() {
    const memberUrl = SPRINT.rootUrl + "/members/" + this.props.attrs.id;
    let address1 = "";
    if (this.props.attrs.city && this.props.attrs.city.length > 0) address1 += this.props.attrs.city;
    if (this.props.attrs.state && this.props.attrs.state.length > 0) address1 += ", " + this.props.attrs.state;
    const address2 = (this.props.attrs.country && this.props.attrs.country.length > 0) ? this.props.attrs.country : "";

    const deleteButton = this.props.showDeleteButton ? <button onClick={() => this.removeMember()} className="pull-right btn btn-danger"><i className="fa fa-close"></i>&nbsp;Remove</button> : <span></span>;


    return(
      <tr>
        <td>
          <div className="row">
            <div className="col-md-2">
              <a href={memberUrl} className="avatarLink">
                <MemberAvatar attrs={this.props.attrs} />
              </a>
            </div>
            <div className="col-md-10 no-pad-left">
              <div className="row g-0 card">
                <div className="col-md-12">
                  <div className="card-body">
                    {deleteButton}

                    <a href={memberUrl}>
                      <h6 className="card-title" style={{display: "inline-block"}}>
                        {this.props.attrs.first_name} {this.props.attrs.last_name}
                      </h6>
                    </a>

                    <address className="card-text">
                      <small className="text-muted">
                        {address1}<br />
                        {address2}
                      </small>
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}
