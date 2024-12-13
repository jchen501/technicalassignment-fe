import axios from 'axios';
import React, { useState } from 'react';
import './App.css';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function App() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<any>({ started: false, prog: 0});
  const [message, setMessage] = useState<String>();
  const [data, setData] = useState<String[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [filePresent, setFilePresent] = useState(false);
  const url = 'http://localhost:8080/';

  function handleFile(event){
    setFile(event.target.files[0])
  }

  function handleSubmit(event){
    event.preventDefault()
    const formData = new FormData();
    formData.append('file', file);

    setMessage('Uploading...')
    setProgress(prevState => {
      return {...prevState, started: true}
    })

    axios.post(url + 'upload', formData, {
      onUploadProgress: (nativeEvent) => {
        setProgress(prevState => {
          return {...prevState, prog: nativeEvent.loaded!*100}
        })
      },
      headers: {
        'Custom-Header': 'value',
      }
    })
    .then(res => {
      setMessage("Upload success")
      setUploadSuccess(true)
      console.log(res.data)
    })
    .catch(err => {
      setMessage("Upload failed")
      console.log(err)
    })
  }

  function handleList(){
    axios.get(url + 'list', { params: { filename: file?.name} })
      .then(function (response) {
        setData(response.data)
        setFilePresent(true)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.2},
    { field: 'name', headerName: 'Name', flex: 0.5},
    { field: 'email', headerName: 'Email', flex: 0.5},
    { field: 'body', headerName: 'Body', flex: 1},
  ]

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
          <h1>Upload File</h1>
          <input type="file" onChange={handleFile} data-testid='file-input'/>
          <button type="submit" disabled={!file} data-testid="submit-button">Upload</button>
          <div>
          { progress.started && <progress max="100" value={progress.prog}></progress>}
          { message }
          </div>
        </form>
        
        <div>
            <button type="submit" onClick={handleList} disabled={!uploadSuccess} data-testid="list-button">List Data</button>
        </div>
        {
          filePresent ? 
          <div>
            <DataGrid 
              columns={columns}
              rows={data}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10, 20, 30, 50]}
              getRowHeight={() => 'auto'}
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            />
          </div> : null
        }
    </div>
  );
}

export default App;
