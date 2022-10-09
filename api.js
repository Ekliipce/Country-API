function useDarkMode(){
    const [dark_mode, setDarkMode] = React.useState(false)
    return [dark_mode, setDarkMode]
}

function Header(){
    const [dark_mode, setDarkMode] = useDarkMode()
    const [style, setStyle] = React.useState('style.css')

    const handleClick = () => {
        var res = (dark_mode) ? [false, "dark_style.css"] : [true, "style.css"]
        setDarkMode(res[0])
        setStyle(res[1])
    }

    return (<div id="header-container">
        <link rel="stylesheet" href={style}></link>
        <h1 id="h-title">Where is the world ?</h1>
        <div id="h-right" onClick={handleClick}>
            <span id="h-icone">
                <i className="gg-moon"></i>
            </span>
            <span>Dark mode</span>
        </div> 
    </div>) 
}

// ReactDOM.render(<Header/>, document.getElementById("header"))

function useFetch(url){
    const [res_api, setApi] = React.useState([])
    React.useEffect(() => {
        (async function () {
            const response = await fetch(url)
            const data = await response.json()
            if (response.ok){
                setApi(data)
            }
        })()
    }, [])

    return [res_api, setApi]
}

function useChargeCountryPage(){
    const [countryName, setCharge] = React.useState("")

    return [countryName, setCharge]
}

function handleStrSearch(str){
    if (!str)
        return ''

    var newstr = str[0].toUpperCase()
    newstr += str.substring(1).toLowerCase()
    return newstr;
}

function CountryContainer(props){
    var [countries, setApi] = useFetch('https://restcountries.com/v2/all/')
    const all = React.useMemo(()=>countries.map(t => {
                    return <CountryItem key={t.name} name={t.name} flag={t.flags.png} 
                                        population={t.population} region={t.region} 
                                        capital={t.capital} set_country={props.set_country}/>
    }))
    const [elm_country, setCountry] = React.useState()      
    
    React.useEffect(() => {
        if (props.text_search){
            setCountry(
                countries.filter(elm => elm.name.startsWith(props.text_search))
                        .map(t => {return <CountryItem key={t.name} name={t.name} 
                                        flag={t.flags.png} population={t.population}
                                        region={t.region} capital={t.capital} 
                                        set_country={props.set_country}/> })
            )
        }
    }, [props.text_search])

    React.useEffect(() => {
        if (props.select_search){
            setCountry(
                countries.filter(elm => elm.region == props.select_search)
                        .map(t => {return <CountryItem key={t.name} name={t.name} 
                                        flag={t.flags.png} population={t.population}
                                        region={t.region} capital={t.capital} 
                                        set_country={props.set_country}/> })
            )
        }
    }, [props.select_search])

    const rendered = (props.text_search || props.select_search) ? elm_country : all
    return (<div id="country_container">
        {rendered}
    </div>)
}

function CountryItem(props){
    const chargeCountry = () => {
        props.set_country(props.name)
    }

    return (<div className='country_item'  onClick={chargeCountry}> 
            <div > 
                <img className="country_flag" src={props.flag}/>
            </div>
            
            <div className="country_info"> 
                <span className="country_name">{props.name}</span>
                <span><strong>Population:</strong> {props.population}</span>
                <span><strong>Region:</strong> {props.region}</span>
                <span><strong>Capital:</strong> {props.capital}</span>
            </div>
    </div>)
}

class SearchBar extends React.Component{
    constructor(props){
        super(props)
        this.state = {value: ''}
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e){
        this.setState({value : e.target.value})
        this.props.setText(handleStrSearch(e.target.value)) 
        this.props.setSelect('')
    }
    handleSubmit(e){
        e.preventDefault()
    }

    render(){
        return (<div >
            <form onSubmit={this.handleSubmit}>
                <input id="searchbar" type="text" value={this.state.value} 
                    onChange={this.handleChange} placeholder="Search for a country..."/>
            </form>
        </div>)
    }
}

class SelectBar extends React.Component{
    constructor(props){
        super(props)
        this.state = {value: ''}
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e){    
        this.setState({value: e.target.value})
        this.props.setSelect(e.target.value)
    }
    
    render(){
        return (
        <select id="selectbar" value={this.state.value} 
                onChange={this.handleChange}>
            <option value="">Filter by region</option>
            <option value="Africa">Africa</option>
            <option value="Americas">America</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
        </select>)
    }
    
}

function array_to_string(arr){
    var str = ''
    arr.forEach((elm, i) => {
        str += elm
        if (i < arr.length - 1)
            str += ", "
    })
    return str
}

function InfoPage(props){
    var [countries, setApi] = useFetch('https://restcountries.com/v2/all/')
    const lang = array_to_string(props.lang)
    const curr = (curr) ? array_to_string(props.currencies) : props.currencies
    const border = (props.border_countries) ? props.border_countries.map(elm => {
        console.log(countries)
        const country = countries.map((countr) => {
                if (countr.alpha3Code == elm)
                    return countr.name.split(" ")[0]
            })    
        return <span className='tag' key={elm}>{country}</span>
    }) : 'None'

    return (
        <div id="infopage">
            <div id="image-id-container">
                <img id="image-id" src={props.flag}/>
            </div>

            <div id="info-country">
                <div id="info-title">{props.name}</div>
                <div id="info-info">
                    <div>
                        <span><strong>Native Name:</strong> {props.native}</span>
                        <span><strong>Population:</strong> {props.population}</span>
                        <span><strong>Region:</strong> {props.region}</span>
                        <span><strong>Sub Region:</strong> {props.subregion}</span>
                        <span><strong>Capital:</strong> {props.capital}</span>
                    </div>
                    <div>
                        <span><strong>Top Level Domain:</strong> {props.domain}</span>
                        <span><strong>Currencies:</strong> {curr}</span>
                        <span><strong>Languages:</strong> {lang}</span>
                    </div>
                </div>
                <div id="info-border">
                    <span><strong>Border Countries:</strong></span> 
                    <div id="info-border-border">{border}</div>
                </div>
            </div>
        </div>
    )
}

function MoreInformation(props){
    const url = `https://restcountries.com/v2/name/${props.country}?fullText=true`
    const [country, setCountry] = useFetch(url)
    const [rendu, setRendu] = React.useState([])
    
    const handleClick = () => {
        props.set_country('')
        props.setSelect('')
        props.setText('')
    }

    return country.map(elm => 
    {
        const languages = elm.languages.map(lang => lang.name)
        const currencies = (elm.currencies) ? elm.currencies.map(curr => curr.name) : 'No currency'

        return (<div id="info-div">
            <button id="button_back" onClick={handleClick}>
                <i class="gg-arrow-long-left"></i>Back</button>
            <InfoPage key={elm.name} name={elm.name} flag={elm.flags.png} 
                        native={elm.nativeName} population={elm.population} 
                        region={elm.region} subregion={elm.subregion}
                        capital={elm.capital} domain={elm.topLevelDomain[0]} 
                        currencies={currencies} lang={languages} 
                        border_countries={elm.borders} />
            </div>)
    })
}


function Section(){
    const [text_value, setText] = React.useState('')
    const [select_value, setSelect] = React.useState('')
    const [showInformation, setShow] = React.useState(false)
    const [countryName, setCountry] = useChargeCountryPage()

    React.useEffect(() => {
        var display = (countryName != '') ?  true: false;
        setShow(display)
        console.log(countryName)
    }, [countryName])

    if (!showInformation)
        return (<div>
            <div id="research"> 
                <SearchBar setText={setText} setSelect={setSelect}/>
                <SelectBar setSelect={setSelect}/>
            </div>

            <CountryContainer text_search={text_value} 
                            select_search={select_value}
                            set_country={setCountry}/> 
        </div>)
    else
        return <MoreInformation country={countryName}
                                set_country={setCountry} 
                                setText={setText} 
                                setSelect={setSelect}/>
}

ReactDOM.render(
    <Header/>, 
    document.getElementById("header")
)

ReactDOM.render(
    <Section/>,
    document.getElementById("section")
)

