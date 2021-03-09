import './App.css';
import React, {useState} from 'react';
import {Form, Container, Button, Card, Alert} from 'react-bootstrap'
import axios from 'axios'

const getPosition =()=> {
  return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
  });
}

const getLatlong =async()=>{
  let lat = ""
  let lon = ""
  try {
    let pos = await getPosition()
    let coords = pos.coords
    lat = coords.latitude
    lon = coords.longitude
  } catch (error) {
    lat = ""
    lon = ""
  }
  
  return {lat, lon}
}

function App() {
  
  const [city, setCity] = useState("")
  const handleInput = e => {
    setCity(e.target.value)
    if(e.target.value === ""){
      setWeather([])
      setCityResult("")
      setWind({})
    }
  }

  const [requesError, setRequesError] = useState(false)
  const apiKey = '9281ce9fa6072cbd884ecde4ebd1cb3c'
  const [weather, setWeather] = useState([])
  const [cityResult, setCityResult] = useState("")
  const [wind, setWind] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorInput, setErrorInput] = useState({status:false, message:""})

  const handleInputClick =()=>{
    setErrorInput({status:false, message:""})
  }

  const getSearchWeather =async()=>{
    if(city === ""){
      setErrorInput({status:true, message:"Masukkan Nama Kota"})
    }else{
      setLoading(true)
      try {
        let response = await axios.get('https://api.openweathermap.org/data/2.5/weather',
          {
            params :{
              q:city,
              appid:apiKey
            }
          }
        )
        console.log(response)
        setWeather(response.data.weather)
        setCityResult(response.data.name)
        setWind(response.data.wind)
      } catch (error) {
        console.log(error)
        setRequesError(true)
      }
      setLoading(false)
    }
  }

  const getCurrentWeather =async()=>{
    setLoading(true)
    let {lat, lon} = await getLatlong()
    console.log(lat+" "+lon)
    try {
      let response = await axios.get('https://api.openweathermap.org/data/2.5/weather',
        {
          params :{
            lat:lat,
            lon:lon,
            appid:apiKey
          }
        }
      )
      console.log(response)
      setWeather(response.data.weather)
      setCityResult(response.data.name)
      setWind(response.data.wind)
    } catch (error) {
      console.log(error.data)
    }
    setLoading(false)
  }

  return (
    <div className="App">
      <Container>
        <Form className='input'>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Search Weather For :</Form.Label>
            <Form.Control 
              value={city} 
              onChange={handleInput} 
              onClick={handleInputClick}
              type="text" 
              placeholder="City" />
            {errorInput.status && 
              <Form.Text className="error-text">
                {errorInput.message}
              </Form.Text>
            }
          </Form.Group>
          <Button variant="primary" onClick={getSearchWeather}>
            {loading ? "Loading..." : "Search"}
          </Button>
          <Button variant="primary" onClick={getCurrentWeather} className='current'>
            {loading ? "Loading..." : "Current Locatin"}
          </Button>
          {requesError &&
            <Alert  variant='danger' className='margin-top' onClose={() => setRequesError(false)} dismissible>
              Kota Tidak Ditemukan
            </Alert>
          }
          {weather.length > 0 &&
            <div>
              {weather.map((cuaca, idx) => (
                <Card className='weather' key={idx}>
                  <Card.Header>{cityResult}</Card.Header>
                  <Card.Body>
                    <Card.Title>{cuaca.main}</Card.Title>
                    <Card.Text>
                      {cuaca.description} 
                    </Card.Text>
                    <footer className="blockquote-footer">
                      Wind Speed : {wind.speed}
                    </footer>
                  </Card.Body>
                </Card>
              ))
              }
            </div>
          }
        </Form>
      </Container>
    </div>
  );
}

export default App;
