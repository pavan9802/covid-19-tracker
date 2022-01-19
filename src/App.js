import React, {useEffect, useState} from "react"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData,prettyPrintStat, getCurrentDate } from "./util";
import LinkBox from "./LinkBox"
import './App.css';
import "leaflet/dist/leaflet.css";
import numeral from "numeral";



function App() {

  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [date, setDate] = useState();
  const [countryVacs, setCountryVacs] = useState(0);

  const firebaseConfig = {
    apiKey: "AIzaSyBZAX7Iq5i_t5n69P7J7xm6AflGMH1A368",
    authDomain: "covid19-tracker-4e1c2.firebaseapp.com",
    projectId: "covid19-tracker-4e1c2",
    storageBucket: "covid19-tracker-4e1c2.appspot.com",
    messagingSenderId: "655063081856",
    appId: "1:655063081856:web:b4d6d38d8753ccdcb55765",
    measurementId: "G-C95QBMTPS5"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

 
  useEffect(() =>{

    let todaysDate = getCurrentDate();
    setDate(todaysDate);

     fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data);
    })

     fetch("https://disease.sh/v3/covid-19/vaccine/coverage")
    .then(response => response.json())
    .then(data =>{
      console.log(data[date]);
      setCountryVacs(data[date]);
    })


   
  },[])

  useEffect(() =>{
    const getCountriesData = async () => {

      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
    
        });
    };

    getCountriesData();

  }, []);


  
  const onCountryChange = async(event) =>{
    const countryCode = event.target.value;
 

    let url = 
    countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
      
        setInputCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });

      let otherurl = 
      countryCode === "worldwide"
          ? "https://disease.sh/v3/covid-19/vaccine/coverage"
          : `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}`;
      
      await fetch(otherurl)
        .then((response) => response.json())
        .then((data) => {
          countryCode === "worldwide"?
          setCountryVacs(data[date]):
          setCountryVacs(data.timeline[date])
         
        });
   
      
    

  }



  return (
    <div className="app">
      <div className = "app_left">
        <div className="app_header">
            <h1>Covid-19 TRACKER</h1>
            <FormControl className = "app__dropdown">
                <Select variant = "outlined" onChange = {onCountryChange} value = {country}>

                    <MenuItem value = "worldwide">Worldwide</MenuItem>
                    {
                      countries.map(country =>(
                        <MenuItem value = {country.value}> {country.name}</MenuItem>
                      ))
                    }

              </Select> 
            </FormControl>     
        </div>

        <div className = "app_stats">
              <InfoBox 
              onClick={(e) => setCasesType("cases")}
              isRed
              active={casesType === "cases"}
              title = "Coronavirus cases" 
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0.0a")}
              />
              
              <InfoBox 
              onClick={(e) => setCasesType("recovered")}
              active={casesType === "recovered"}
              title = "Number of recovered cases" 
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format("0.0a")}
              />
              <InfoBox 
              onClick={(e) => setCasesType("deaths")}
              isRed
              active={casesType === "deaths"}
              title = "Number of deaths" 
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0.0a")}
              />
               <InfoBox 
              title = "Number of Vaccines Administered" 
              
              cases={numeral(countryVacs).format("0.0a")}
              />

        </div>
        <Map
        countries={mapCountries}
        casesType={casesType}
        center={mapCenter}
        zoom={mapZoom}
        />
      </div>

      <Card className = "app_right">
        <CardContent className = "table">
          <h3>Live Cases by Country</h3>
          <Table countries = {tableData}/>
        </CardContent>
        <CardContent className = "links">
          <LinkBox/>
        </CardContent>
      </Card>  

    </div>
  );
}

export default App;
