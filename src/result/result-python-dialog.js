/**
 * This file is part of VILLASweb.
 *
 * VILLASweb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

import React from 'react';
import { Button } from 'react-bootstrap';
import Icon from '../common/icon';
import Dialog from '../common/dialogs/dialog';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';


class ResultPythonDialog extends React.Component {
  villasDataProcessingUrl = 'https://pypi.org/project/villas-dataprocessing/';

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (this.props.resultId !== prevProps.resultId) {
      const result = this.props.results[this.props.resultId];
      const output = this.getJupyterNotebook(result);
      const blob = new Blob([JSON.stringify(output)], {
        'type': 'application/x-ipynb+json'
      });
      const url = URL.createObjectURL(blob);

      this.setState({ fileDownloadUrl: url })
    }
  }

  downloadJupyterNotebook() {
    const result = this.props.results[this.props.resultId];
    const output = this.getJupyterNotebook(result);
    const blob = new Blob([JSON.stringify(output)], {
      'type': 'application/x-ipynb+json'
    });
    var url = window.URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.style = 'display: none';
    a.href = url;
    a.download = `villas_web_result_${result.id}.ipynb`;
    document.body.appendChild(a);

    a.click();

    setTimeout(function(){
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
  }

  getPythonDependencies() {
    return `pip install villas-dataprocessing`
  }

  getPythonSnippet(result) {
    let token = localStorage.getItem('token');

    let files = [];
    let hasCSV = false;
    for (let file of this.props.files) {
      if (result.resultFileIDs.includes(file.id)) {
        files.push(file);
        if (file.type == 'text/csv')
          hasCSV = true;
      }
    }

    let code = '';

    if (hasCSV)
      code += 'import pandas\n';

    code += `from villas.web.result import Result

r = Result(${result.id}, '${token}')

# print(r)                               # result details
# print(r.files)                         # list of files of this result set

# f = r.files[0]                         # first file
# f = r.get_files_by_type('text/csv')[0] # first CSV file
# f = r.get_file_by_name('result.csv')   # by filename`;

    for (let file of files) {
      console.log(file);
      code += `\n\nf${file.id} = r.get_file_by_name('${file.name}')`;

      switch (file.type) {
        case 'application/zip':
          code += `\nwith f${file.id}.open_zip('testdata.csv') as f:
  data = pandas.read_csv(f)`;
          break;

        case 'text/csv':
          code += `\nwith f${file.id}.open() as f:
  data = pandas.read_csv(f)`;
          break;

        default:
          code += `\nwith f${file.id}.open() as f:
  data = f.read()`;
          break;
      }

      code += `
  print(data)`;
    }

    return code;
  }

  /* Generate random cell ids
   *
   * See: https://jupyter.org/enhancement-proposals/62-cell-id/cell-id.html
   */
  getCellId() {
    return Math.round(1000000 * Math.random()).toString();
  }

  getJupyterNotebook(result) {
    let ipynb_cells = [];
    let cells = [
      this.getPythonDependencies(),
      this.getPythonSnippet(result)
    ]

    for (let cell of cells) {
      ipynb_cells.push({
        cell_type: 'code',
        execution_count: null,
        id: this.getCellId(),
        metadata: {},
        outputs: [],
        source: cell.split('\n')
      })
    }

    return {
      cells: ipynb_cells,
      metadata: {
        kernelspec: {
        display_name: 'Python 3',
        language: 'python',
        name: 'python3'
        },
        language_info: {
        codemirror_mode: {
          name: 'ipython',
          version: 3
        },
        file_extension: '.py',
        mimetype: 'text/x-python',
        name: 'python',
        nbconvert_exporter: 'python',
        pygments_lexer: 'ipython3',
        version: '3.9.5'
        }
      },
      nbformat: 4,
      nbformat_minor: 5
    }
  }

  render() {
    let result = this.props.results[this.props.resultId];

    if (!result)
      return null;

    let code = this.getPythonSnippet(result);
    return (
      <Dialog
        show={this.props.show}
        title={'Use Result ' + result.id + ' in Jupyter Notebooks'}
        buttonTitle='Close'
        onClose={(cancelled) => this.props.onClose()}
        valid={true}
        size='lg'
        blendOutCancel={true}
      >
        <p>Use the following Python code-snippet to fetch and load your results as a Pandas dataframe.</p>

        <p><b>1)</b> Please install the <a href={this.villasDataProcessingUrl}>villas-controller</a> Python package:</p>
        <SyntaxHighlighter
          language="bash"
          style={github}>
            {this.getPythonDependencies()}
        </SyntaxHighlighter>

        <p><b>2a)</b> Insert the following snippet your Python code:</p>
        <SyntaxHighlighter
          language="python"
          style={github}>
            {code}
        </SyntaxHighlighter>

        <CopyToClipboard text={code}>
          <Button>
            <Icon style={{color: 'white'}} icon='clipboard'/>&nbsp;
            Copy to Clipboard
          </Button>
        </CopyToClipboard>
        <p style={{marginTop: '2em'}}><b>2b)</b> Or alternatively, download the following generated Jupyter notebook to get started:</p>
        <Button onClick={(e) => this.downloadJupyterNotebook(e)}>
          <Icon style={{color: 'white'}} icon='download'/>&nbsp;
          Download Jupyter Notebook
        </Button>
      </Dialog>
    );
  }
}

export default ResultPythonDialog;
