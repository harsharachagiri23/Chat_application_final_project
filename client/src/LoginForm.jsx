import { useState } from 'react';
import "./App.css";
import msg from './icons/ChatApp.jpg';

function LoginForm({ onLogin }) {

  const [username, setUsername] = useState('');

  function onChange(e) {
    setUsername(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault(); 
      onLogin(username); 
  }

  return (
    <div className="login-content">
      
      <div className="login-box" >
        <img className="Chatlogo" src ={msg} alt = " msg " height={200} width={200}/>

        <form className="form-login" action="#/login" onSubmit={onSubmit}>
          <label className="input-block">
           {/* <span className='span-content'>Username:</span>*/}
            <input className="btn-submit" placeholder='Enter Username' 
                      value={username} onChange={onChange}/>
          </label>
          <button className="btn-login" type="submit">Login</button>
        </form>
      </div>
    </div>
  );

}

export default LoginForm;