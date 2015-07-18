from flask import Flask, render_template
from fixed_data_table import Table, Column


app = Flask(__name__)


@app.route('/')
def index():
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
    tbl = Table(row_height=50, width=300, height=500, columns=cols, rows=rows)
    return render_template('index.html', data_table=tbl)


if __name__ == '__main__':
    app.run(debug=True)
