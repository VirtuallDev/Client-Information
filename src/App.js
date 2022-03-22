import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

  const [token, setToken] = useState("");
  const [fetched, setFetched ] = useState(false);
  const [info, setInfo] = useState({
    username: "",
    avatar: "",
    bio: "",
    id: "",
    email: "",
    guilds: []
  });
  const inputChange = (e) => {
    setToken(e.target.value);
  }

  const clickHandler = () => {

    fetch('https://discord.com/api/v9/users/@me', {
      headers:{ 
        'authorization': token
      }
    }).then(res => res.json()).then(data => {
      let avatar_url = data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}?size=512` : "";
      let guilds = [];
      fetch('https://discord.com/api/v9/users/@me/guilds', {      
      headers:{
        'authorization': token
      }}).then(r => r.json()).then(guilds_ => {
        for(const guild of guilds_) guilds.push({name: guild.name, id: guild.id});
      })
      setInfo({username: `${data.username}#${data.discriminator}`, avatar: avatar_url, id: data.id, bio: data.bio || "", email: data.email, guilds})
      setFetched(true);

    }).catch(() => setFetched(false));

  }

  const informationDiv = () => {
    return (
        <div className='all-inputs'>
          <h1> {info.avatar ? (<img  src={info.avatar} alt={info.username}/>) : ""} {info.username}</h1>
          <div className='information'>
            <div className='piece'>
              <span className='bolded'>ID:</span> {info.id}
            </div>
            <div className='piece'>
              <span className='bolded'>Email:</span> {info.email}
            </div>
            <div className='piece'>
              <span className='bolded'>Guilds:</span>
              {info.guilds.map(guild => {
                return (
                  <div id={guild.id} key={guild.id}>
                    <span className='bolded'>.</span> {guild.name}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
    )
  }

  return (
    <div className="App">
    
      <div className='container'>
        <h1>Discord Client Info</h1>

        <input type="text" name='token' placeholder='Your Token' onChange={inputChange} value={token} />
        <button type='submit' onClick={clickHandler}>Fetch Client Data</button>

      </div>

      {fetched === true ? informationDiv() : ""}
    </div>
  );
}

export default App;
