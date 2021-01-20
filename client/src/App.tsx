import React from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas';
import axios from 'axios';

function App() {
  React.useEffect(() => {
    axios.get(`https://lh3.googleusercontent.com/a-/AOh14Gjykx75Roe3WqWxHQvrOMo9m4AKiEj4aA_zHKYu=s512-c`, { responseType: 'blob' }).then((res) => {
      console.log(res);
    })
  }, []);
  return (
    <div className="App">
      <Canvas />
    </div>
  );
}

export default App;
