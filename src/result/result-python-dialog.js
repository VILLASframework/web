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
    if (this.props.results && this.props.resultId !== prevProps.resultId) {
      const result = this.props.results[this.props.resultId];
      if (result) {
        const output = this.getJupyterNotebook(result);
        const blob = new Blob([JSON.stringify(output)], {
          'type': 'application/x-ipynb+json'
        });
        const url = URL.createObjectURL(blob);

        this.setState({ fileDownloadUrl: url })
      }
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

  getPythonDependencies(notebook) {
    let code = '';
    if (notebook)
      code += `import sys
!{sys.executable} -m `;

    code += `pip install villas-dataprocessing`;

    return code;
  }

  getPythonSnippets(notebook, result) {
    let token = localStorage.getItem('token');

    let files = [];
    for (let file of this.props.files) {
      if (result.resultFileIDs != null) {
        if (result.resultFileIDs.includes(file.id)) {
          files.push(file);
        }
      }
    }

    let code_snippets = [];

    /* Imports */
    let code_imports = '';
    if (notebook)
      code_imports += 'from IPython.display import display\n'

    code_imports += `from villas.web.result import Result\n`
    code_imports += `from pprint import pprint`

    code_snippets.push(code_imports)

    /* Result object */
    code_snippets.push(`r = Result(${result.id}, '${token}')`);

    /* Examples */
    code_snippets.push(`# Get result metadata
print(r)                                 # result details
pprint(r.files)                          # list of files of this result set`);

    code_snippets.push(`f = r.files[0]                           # first file
# f = r.get_files_by_type('text/csv')[0] # first CSV file
# f = r.get_file_by_name('result.csv')   # by filename`);

    code_snippets.push(`# Get file metadata
print('Name: %s' % f.name)
print('Size: %d Bytes' % f.size)
print('Type: ' + f.type)
print('Created at: %s' % f.created_at)
print('Updated at: %s' % f.updated_at)`);

    code_snippets.push(`# Open file as fileobj
# with f.open() as fh:
#   contents = fh.read()

# Load and parse file contents (supports xls, mat, json, h5)
contents = f.load()`);

    for (let file of files) {
      let code = `# Get file by name
f${file.id} = r.get_file_by_name('${file.name}')`;

      if (notebook)
        code += `\n\n# Display contents in Jupyter
display(f${file.id})\n`;

      switch (file.type) {
        case 'application/zip':
          code += `\n# Open a file within the zipped results
with f${file.id}.open_zip('file_in_zip.csv') as f:
  f${file.id} = pandas.read_csv(f)`;
          break;

        case 'text/csv':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/x-hdf5':
        case 'application/x-matlab-data':
          code += `\n# Load tables as Pandas dataframe
f${file.id} = f${file.id}.load()`;
          break;

        case 'application/json':
          code += `\n# Load JSON file as Python dictionary
f${file.id} = f${file.id}.load()`;
          break;

        default:
          code += `\n# Load files as bytes
f${file.id} = f${file.id}.load()`;
          break;
      }

      code_snippets.push(code);
    }

    return code_snippets;
  }

  /* Generate random cell ids
   *
   * See: https://jupyter.org/enhancement-proposals/62-cell-id/cell-id.html
   */
  getCellId() {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for ( var i = 0; i < 8; i++ )
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));

    return result.join('');
  }

  getJupyterNotebook(result) {
    let ipynb_cells = [];
    let cells = [ this.getPythonDependencies(true) ];
    cells = cells.concat(this.getPythonSnippets(true, result));

    for (let cell of cells) {
      let lines = cell.split('\n');

      for (let i = 0; i < lines.length -1; i++)
        lines[i] += '\n'

      ipynb_cells.push({
        cell_type: 'code',
        execution_count: null,
        id: this.getCellId(),
        metadata: {},
        outputs: [],
        source: lines
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

    let snippets = this.getPythonSnippets(true, result);
    let code = snippets.join('\n\n');
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
          {this.getPythonDependencies(false)}
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
        <Button onClick={this.downloadJupyterNotebook.bind(this)}>
          <Icon style={{color: 'white'}} icon='download'/>&nbsp;
          Download Jupyter Notebook
        </Button>
      </Dialog>
    );
  }
}

export default ResultPythonDialog;
