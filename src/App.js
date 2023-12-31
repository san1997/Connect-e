import logo from './logo.svg';
import './App.css';
import {LoginPage} from  './pages/loginPage';
import { HomePage } from './pages/homePage';
import { Routes, Route, Link } from 'react-router-dom';

function App() {

  return <div className="App">
      <header className="App-header">
        <div className='top-header'>Connect-e-dil</div>
        <div className='main-container'>
          <Routes>
            <Route index element={<LoginPage/>}/>
            <Route path='/home' element={<HomePage/>}/>
          </Routes>
        </div>
      </header>
    </div>
}

export default App;
