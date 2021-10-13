import React, {useState, useRef, useEffect} from 'react'
import {useMainContext} from '../services/Context'

function Search() {
    const {eventData,  setSelectedEvent,  setReRenderMarkers} = useMainContext()
    const searchBox = useRef()
    const optionBox = useRef()

    const [matchEvent, setMatchEvent] = useState(eventData)
    const [sortSelection, setSortSelection] = useState("All")

    const sortData = eventData => {
        let filteredData = [...eventData]
        if (sortSelection !== "All") {
            filteredData = filteredData.filter(event => event.categories[0].title === sortSelection)
        }
        return filteredData
    }

    const onSearch = (searchQry, eventData) => {
        let eventMatch = []
        let sortedData = sortData(eventData)
        if(searchQry.length > 0 && sortedData) {
            for(const event in eventData) {
                let eventTitle = sortedData[event].title.toLowerCase()
                if(eventTitle.indexOf(searchQry) !== -1) {
                    eventMatch.push(sortedData[event]);
                }
            }
            
            if(eventMatch.length === 0) {
                eventMatch = [{title: "No Event Found", categories: [{title: ""}]}]
            }
            setMatchEvent(eventMatch)
        } else {
            setMatchEvent(sortedData)
            
        }
    }
    
    useEffect(() => {
        let sortedData = sortData(eventData)
        setReRenderMarkers(sortedData)
        onSearch(searchBox.current.value.toLowerCase(), sortedData)
    }, [sortSelection])

    const getFirstWord = (string) => {
        let words = string.split(' ')[0].toLowerCase().toString();
        if(words === 'wildfire') {
            let cutFirst = string.split(words)
            return removeFirstWord(cutFirst);
        } else {
            return string;
            
        }

    };
    function removeFirstWord(array) {
        return array.map(item => {
          return item.split('-').slice(1);
        }).join(' ');
      }

    return (
        <div className="search-main-container">
        <div className="header">
            <h1> Geologic Hazards Tracker (Powered by NASA)</h1>
            <section className="search-options">
                <h3>Sort Events</h3>
                <select ref={optionBox} onChange={() => {setSortSelection(optionBox.current.value)}}>
                    <option value="All">All</option>
                    <option value="Wildfires">Wildfires</option>
                    <option value="Severe Storms">Severe Storms</option>
                    <option value="Volcanoes">Volcanoes</option>
                    <option value="Sea and Lake Ice">Sea and Lake Ice</option>
                </select>
            </section>
            <section className="search-options">
                <h3>Search Events</h3>
                <input type="text" onKeyUp={() => {let searchQry = searchBox.current.value.toLowerCase()
                        setTimeout(() => {
                            if(searchQry === searchBox.current.value.toLowerCase()) {
                                onSearch(searchQry, eventData)
                            }
                        }, 300)
                    }} ref={searchBox}/>
            </section>
        </div> 

        <div className="main-sidebar">

            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {matchEvent.map((ev, idx) => {
                        return <tr className="table-row" key={idx} onClick={() => setSelectedEvent(ev)}>
                        <td className={ev.categories[0].title.toLowerCase().split(' ').join('')}>{ev.categories[0].title}</td>
                        <td>{getFirstWord(ev.title)}</td>
                        </tr>
                    })}

                </tbody>
            </table>
        </div>
        </div>
    )
}

export default Search