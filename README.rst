FixedDataTablePython
====================

Python utilities for building and rendering FixedDataTable components.


In your view::

  from fixed_data_table import Table, Column

  rows = [
      {'Col 1': 'a1', 'Col 2': 'b1', 'Col 3': 'b3'},
      {'Col 1': 'a2', 'Col 2': 'b2', 'Col 3': 'b4'},
      {'Col 1': 'a3', 'Col 2': 'b3', 'Col 3': 'b4'},
  ]
  cols = [
      Column(label='Col 1', key='col1', width='100'),
      Column(label='Col 2', key='col2', width='100'),
      Column(label='Col 3', key='col3', width='100'),
  ]
  tbl = Table(row_height=50, width=5000, height=5000, colums=cols)


In your template::

  var table_data = tbl.json|save;
  var table_component =
  React.render(
    React.createElement(FixedDataTablePy, {options: table_data}),
    document.getElementById('yourid')
  );

