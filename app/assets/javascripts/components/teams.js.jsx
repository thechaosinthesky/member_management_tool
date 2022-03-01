class TeamTableRow extends React.Component {
  render() {
    const projectUrl = SPRINT.rootUrl + "/teams/" + this.props.attrs.id;

    return(
      <tr>
        <td>
          <div className="row">
            <div className="col-md-12">
              <a href={projectUrl} className="avatarLink">
                <strong>{this.props.attrs.name}</strong>
              </a>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}
