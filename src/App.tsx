import React, { useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<any>({ started: false, prog: 0});
  const [message, setMessage] = useState<String>();

  function handleFile(event){
    setFile(event.target.files[0])
  }

  function handleSubmit(event){
    if(!file){
      setMessage('No file selected')
      return;
    }
    event.preventDefault()
    const url = 'http://localhost:8080/upload';
    const formData = new FormData();
    formData.append('file', file);

    setMessage('Uploading...')
    setProgress(prevState => {
      return {...prevState, started: true}
    })

    axios.post(url, formData, {
      onUploadProgress: (e) => {
        setProgress(prevState => {
          return {...prevState, prog: e.progress*100}
        })
      },
      headers: {
        'Custom-Header': 'value',
      }
    })
    .then(res => {
      setMessage("Upload success")
      console.log(res.data)
    })
    .catch(err => {
      setMessage("Upload failed")
      console.log(err)
    })
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
          <h1>Upload File</h1>
          <input type="file" onChange={handleFile}/>
          <button type="submit">Upload</button>

          <div>
          { progress.started && <progress max="100" value={progress.prog}></progress>}
          { message }
          </div>
        </form>
    </div>
  );
}

export default App;
