import { useState, useEffect } from 'react'
import Map from './cmps/Map'
import {LoadingSpinner} from './cmps/LoadingSpinner'
import Search from './cmps/Search'
import {useMainContext} from './services/Context'

function App() {

  const {setEventData, reRenderMarkers} = useMainContext()
  
  const [renderEvent, setRenderEvent] = useState([])
  const [loading, setLoading] = useState(false) 


  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const res = await fetch('https://eonet.sci.gsfc.nasa.gov/api/v2.1/events')
      const { events } = await res.json()
      
      setEventData(events)
      setLoading(false)
      setRenderEvent(events)
    }

    fetchEvents()
  }, [])

    useEffect(() => {
      if(reRenderMarkers !== null) {
        setRenderEvent(reRenderMarkers)
      }
    }, [reRenderMarkers]);
    
  return (
    <div>
        <div className="main-content">
          { !loading ? <Map eventData={renderEvent} /> : <LoadingSpinner /> }
          {!loading && <Search/>}
        </div>
    </div>
  );
}

export default App;
