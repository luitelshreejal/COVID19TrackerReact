import React from 'react'; //requires when we need to acccess the DOM. 
import './App.css'; //imports CSS files. 
import CountryList from "./components/CountryList/CountryList.js"
import SearchBox from "./components/SearchBox/SearchBox.js"

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      countries: [],
      stats: [],
      searchFilled: ""
    }
  }

  async componentDidMount(){
    const resp = await fetch('https://api.covid19api.com/countries')
    const countries = await resp.json()
    this.setState({countries})
    this.state.countries.forEach(async country => {
      const resp = await fetch(`https://api.covid19api.com/total/country/${country.Slug}`)
      const data = await resp.json()
      if(data.length)
      this.setState(prevState => (
        {stats:prevState.stats.concat({...data[data.length - 1],CountryCode:country.ISO2})}
      ))
    })
  }

  handleChange = (e) =>{
    this.setState({searchFilled:e.target.value})
  }

  render(){
    const {stats,searchFilled} = this.state
    const filteredCountries = stats.filter(country =>(
      country.Country.toLowerCase().includes(searchFilled.toLowerCase())
    ))
    return(
      <div className="App">
        <h1>Covid19 Stats Web App</h1>
        <SearchBox placeholder="Enter country name ..." handleChange={this.handleChange}/>
        <CountryList stats = {filteredCountries}/>
    </div>
    )
  }
}

export default App;
