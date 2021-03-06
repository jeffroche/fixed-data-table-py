var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};
var TableControls = React.createClass({
  render: function() {
    return (
      React.createElement("div", null,
        React.createElement("ul", null,
          React.createElement(FilterControl, {
            onFilterChange: this.props.onFilterChange,
            placeholder: this.props.filterPlaceholder}
          ),
          React.createElement(ExportButton, {clickHandler: this.props.exportHandler})
        )
      )
    );
  }
});
var FilterControl = React.createClass({
  render: function() {
    return (
      React.createElement("li", null,
        React.createElement("input", {
          onChange: this.props.onFilterChange, placeholder: this.props.placeholder}
        )
      )
    );
  }
});

var ExportButton = React.createClass({
  render: function() {
    return (
      React.createElement("li", null,
        React.createElement("button", {onClick: this.props.clickHandler},
          React.createElement("a", null, "Export"))
      )
    );
  }
});
var FixedDataTablePy = React.createClass({
  getInitialState: function() {
    return {
      rows: this.props.rows,
      filteredRows: null,
      filterBy: null,
      sortBy: null,
      sortDir: null,
    };
  },
  componentWillMount: function() {
    this._filterRowsBy(this.state.filterBy);
  },
  _rowGetter: function(rowIndex) {
    return this.state.filteredRows[rowIndex];
  },
  _onFilterChange: function(e) {
    this._filterRowsBy(e.target.value);
  },
  _filterRowsBy: function(filterBy) {
    var rows = this.state.rows;
    var filterKey = this.props.filterKey;
    var filteredRows = filterBy ? rows.filter(function(row){
      var filterField = row[filterKey];
      return filterField.toLowerCase().indexOf(filterBy.toLowerCase()) >= 0;
    }) : rows;
    this.setState({filteredRows: filteredRows, filterBy: filterBy});
  },
  _sortRowsBy: function(cellDataKey) {
    var sortDir = this.state.sortDir;
    var sortBy = cellDataKey;
    if (sortBy === this.state.sortBy) {
      sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC;
    }
    else {
      sortDir = SortTypes.DESC;
    }
    var rows = this.state.rows.slice();
    rows.sort(function(a, b) {
      var sortVal = 0;
      if (a[sortBy] > b[sortBy]) {
        sortVal = 1;
      }
      if (a[sortBy] < b[sortBy]) {
        sortVal = -1;
      }
      if (sortDir === SortTypes.DESC) {
        sortVal = sortVal * -1;
      }
      return sortVal;
    });
    this.setState({
      filteredRows: rows,
      sortDir: sortDir,
      sortBy: sortBy,
    });
  },
  _renderHeader: function(label, cellDataKey) {
    return(
      React.createElement("a", {
        onClick: this._sortRowsBy.bind(null, cellDataKey)}, label)
    );
  },
  _renderPct: function(/*object*/ cellData) {
    return React.createElement("span", null, numeral(cellData).format('0.0%'));
  },
  _renderDecimal: function(/*object*/ cellData) {
    return React.createElement("span", null, numeral(cellData).format('0,0.0'));
  },
  _renderCell: function(cellData, cellDataKey, rowData, rowIndex, columnData) {
    if (columnData.numFormat){
      return React.createElement("span", null, numeral(cellData).format(columnData.numFormat));
    }
    else {
      return React.createElement("span", null, cellData);
    }
  },
  _buildColumns: function(pyCols) {
    var cols = [];
    for (var i=0; i < pyCols.length; i++) {
      var colProps = pyCols[i];
      colProps.headerRenderer = this._renderHeader;
      colProps.cellRenderer = this._renderCell;
      colProps.key = pyCols[i].dataKey;
      cols[i] = colProps;
    }
    return cols;
  },
  _xlsExport: function() {
    console.log("EXPORT TO XLS");
    var data = [
      [1,2,3],
      [true, false, null, "sheetjs"],
      ["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"],
      ["baz", null, "qux"]
    ];
    var ws_name = "SheetJS";
    var wb = new Workbook(), ws = sheet_from_rows_columns(
      this.props.rows, this.props.columnParams);
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
    var fileName = 'DataTableExport.xlsx';
    if (this.props.exportFileName)
      fileName = this.props.exportFileName;
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName);
  },
  _prepXLSData: function() {

  },
  render: function() {
    var sortDirArrow = '';
    if (this.state.sortDir !== null) {
      sortDirArrow = this.state.sortDir == SortTypes.DESC ? ' ↓' : ' ↑';
    }
    // Build table
    var columnProps = this._buildColumns(this.props.columnParams);
    var columns = [];
    for (var i=0; i < columnProps.length; i++) {
      columns[i] = React.createElement(Column, columnProps[i]);
    }
    var tbl = React.createElement(Table, {
      rowHeight: 50,
      rowGetter: this._rowGetter,
      rowsCount: this.props.rows.length,
      width: this.props.width,
      height: this.props.height,
      headerHeight: 50},
      columns
    );
    // Build table controls if specified
    if (this.props.filterControl || this.props.exportControl) {
      return (
        React.createElement("div", null,
          React.createElement(TableControls, {
            onFilterChange: this._onFilterChange,
            filterPlaceholder: this.props.filterPlaceholder,
            exportHandler: this._xlsExport
          }),
          tbl
        )
      );
    }
    else {
      return (
        React.createElement("div", null, tbl)
      );
    }
  }
});