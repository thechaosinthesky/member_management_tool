class Loader extends React.Component {
  render() {
    let loaderEl;
    if(this.props.small){
      loaderEl = <span className="loader loader-sm"><span>Loading...</span></span>;
    }
    else{
      loaderEl = <div className="loader"><span>Loading...</span></div>;
    }

    return (
      <span>{loaderEl}</span>
    )
  }
}

class TableLoader extends React.Component {
  render() {
    return (
      <tbody>
        <tr>
          <td>
            <div className="loader">
              <span>Loading...</span>
            </div>
          </td>
        </tr>
      </tbody>
    )
  }
}

class TableRow extends React.Component {
  render() {
    return(
      <tr>
        <td>RESULT</td>
      </tr>
    )
  }
}

class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      rowComponent: props.rowComponent || TableRow,
      tableHeader: props.tableHeader || "Results",
      url: SPRINT.rootUrl + props.uriPath,
      results: [],
      showDeleteButton: props.showDeleteButton,
      parentId: props.parentId
    };
  }

  componentDidMount() {
    this.onLoad();
  }

  onLoad() {
    var that = this;
    $.ajax({
      url: this.state.url,
      contentType: "application/json",
      dataType: "json",
      success: function(results){
        that.setState({
          loading: false,
          results: results
        });
      }
    });
  }

  render() {
    const tableClassName = this.state.loading ? "table" : "table table-striped";

    let tableBody;
    if(this.state.loading){
      tableBody = <TableLoader />;
    }
    else{
      const resultList = this.state.results.map((result, index) =>
        <this.state.rowComponent key={index} index={index} attrs={result} showDeleteButton={this.state.showDeleteButton} parentId={this.state.parentId} />
      );
      tableBody = <tbody>{resultList}</tbody>;
    }

    return (
      <table className={ tableClassName }>
        <thead>
          <tr>
            <th>{this.state.tableHeader}</th>
          </tr>
        </thead>

        {tableBody}

      </table>
    );
  }
}

class OptionResult extends React.Component {
  render() {
    const isSelected = (this.props.value + "") == this.props.attrs.id + "";
    const displayName = this.props.attrs.name ? this.props.attrs.name : (this.props.attrs.first_name + " " + this.props.attrs.last_name);
    return(
      <option value={this.props.attrs.id}>
        {displayName}
      </option>
    )
  }
}

class AjaxSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      rowComponent: props.rowComponent || TableRow,
      url: SPRINT.rootUrl + props.uriPath,
      results: [],
      value: props.value
    };
    this.selectRef = React.createRef();
  }

  componentDidMount() {
    this.onLoad();
  }

  onLoad() {
    var that = this;
    $.ajax({
      url: this.state.url,
      contentType: "application/json",
      dataType: "json",
      success: function(results){
        // Set select value to the first entry if needed
        let currentValue = that.state.value;
        if((!currentValue || currentValue == "") && results && results.length > 0){
          currentValue = results[0].id;
        }

        that.setState({
          loading: false,
          results: results,
          value: currentValue
        });

        // Manually trigger a change to bubble the new value up
        setTimeout(function(){
          const event = new Event('change', { bubbles: true });
          that.selectRef.current.dispatchEvent(event);
        }, 0);
      }
    });
  }

  render() {
    const resultList = this.state.results.map((result, index) =>
      <OptionResult key={index} attrs={result} />
    );

    let selectEl;
    if(this.state.loading){
      selectEl = <Loader small={true} />;
    }
    else{
      selectEl = <select ref={this.selectRef} className="form-select" onChange={this.props.onSelectChange} defaultValue={this.state.value}>{resultList}</select>;
    }

    return (
      <span>
        {selectEl}
      </span>
    );
  }
}
