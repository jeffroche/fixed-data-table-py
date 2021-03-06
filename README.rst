FixedDataTablePy
================

Python utilities for building and rendering FixedDataTable components that can
easily be sorted, filtered, and exported to Excel.

Installation
------------

Install the python package::

  pip install fixeddatatable

Install the javascript libary with bower::

  bower install fixed-data-table-py

Usage Overview
--------------

1. Build table rows as a list of lists or a list of dicts
2. Build ``Column`` objects with arguments that match the column props in the fixed-data-table `column API`_
3. Create a ``Table`` object and pass the rows and columns as arguments
4. In your template, create the ``FixedDataTablePy`` React component and pass in the ``Table.json`` as the options property.

Other Functionality
-------------------

- number formatting: give the column a ``num_format`` property with a `numeral.js`_ format string
- filtering: pass the ``Table`` constructor the data key to filter by and a placeholder to enable filtering
- exporting: pass the ``Table`` constructor the filename and the table header will include a button to export the table data to a .xlsx file

Example
-------

See the sample_project for a full example of a Flask app.

In your view::

  from fixeddatatable import Table, Column

  rows = [
      {'col1': 'a1', 'col2': 'b1', 'col3': '0.99'},
      {'col1': 'a2', 'col2': 'b2', 'col3': '0.12313'},
      {'col1': 'a3', 'col2': 'b3', 'col3': '1.04'},
  ]
  cols = [
      Column(label='Col 1', key='col1', width=100),
      Column(label='Col 2', key='col2', width=100),
      Column(label='Col 3', key='col3', width=100, num_format='0.0%'),
  ]
  tbl = Table(row_height=50, width=300, height=500, columns=cols, rows=rows,
              filter={'key': 'col2', 'placeholder': 'Filter by Col 2'},
              export_filename='SampleProject.xlsx')


In your template::

  <div id="datatable"></div>

  <script type="text/javascript">
    var tableData = tbl.json|safe;
    React.render(
      React.createElement(FixedDataTablePy, {options: tableData}),
      document.getElementById('yourid')
    );
  </script>


.. _`column API`: https://facebook.github.io/fixed-data-table/api-column.html
.. _`numeral.js`: http://numeraljs.com/

