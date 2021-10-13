import GoogleMapReact from 'google-map-react'
import LocationMarker from './LocationMarker'
import LoactionInfoBox from './LoactionInfoBox'
import React, { useRef, useEffect, useState } from 'react'
import useSuperCluster from 'use-supercluster'
import {useMainContext} from '../services/Context'


function Map ({eventData, center}) {

    const {selectedEvent} = useMainContext()
    const mapRef = useRef()
    const [locationInfo, setloactionInfo] = useState(null)
    const [bounds, setBounds] = useState(null)
    const [zoom, setZoom] = useState(1)

    const eventDataIdx = {
        8: 'Wildfires',
        10: 'Severe Storms',
        12: 'Volcanoes',
        15: 'Sea and Lake Ice',
    }
    let eventDataIdxNum = Object.keys(eventDataIdx)
    eventDataIdxNum = eventDataIdxNum.map(idx => Number(idx))

    const points = eventData.map(ev =>({
        'type': 'Feature',
        'properties': {
            'cluster': false,
            'eventKey': ev.id, 
            'eventTitle': ev.title, 
            'eventType': ev.categories[0].id
        }, 
        'geometry': {'type': 'Point', 'coordinates': [ev.geometries[0].coordinates[0], ev.geometries[0].coordinates[1]]}
    }))

    const {clusters, supercluster} = useSuperCluster({
        points,
        bounds,
        zoom,
        options: {radius: 75, maxZoom: 20}
    })

    useEffect(() => {
        if(selectedEvent !== null) {
            let lng = selectedEvent.geometries[0].coordinates[0]
            let lat = selectedEvent.geometries[0].coordinates[1]
            mapRef.current.panTo({lat: lat, lng: lng})
            mapRef.current.setZoom(10)
        }
    }, [selectedEvent])
    
    return (
        <div className="map-container">
            <GoogleMapReact 
                bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_API_KEY}}
                center={center}
                zoom={zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map}) => {
                    mapRef.current= map;
                }}
                onChange={({zoom, bounds}) => {
                    setZoom(zoom);
                    setBounds([
                        bounds.nw.lng,
                        bounds.se.lat,
                        bounds.se.lng,
                        bounds.nw.lat,
                    ]);
                }}
                onClick={() => {setloactionInfo(null);}}
                onDrag={() => setloactionInfo(null)}
            >

                {clusters.map(cluster => {
                    const [lng, lat] = cluster.geometry.coordinates
                    const {cluster: isCluster, point_count: pointCount} = cluster.properties
                    const clusterId = cluster.properties.eventType
                    if(isCluster) {
                        return (
                            <section key={cluster.id} lat={lat} lng={lng}>
                                <div className="cluster-marker"  
                                onClick={() => {const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20 )
                                mapRef.current.setZoom(expansionZoom)
                                mapRef.current.panTo({lat: lat, lng: lng})
                                }}>
                                    {pointCount}
                                </div>
                            </section>
                        )
                    }
                    if(eventDataIdxNum.indexOf(clusterId) !== -1 && cluster.geometry.coordinates.length === 2) {
                        return <LocationMarker lat={lat} lng={lng} id={clusterId} key={cluster.properties.eventKey} 
                        onClick={() => {
                            setloactionInfo({id: cluster.properties.eventKey, title: cluster.properties.eventTitle})
                        }}/>
                    } 
                })}
            </GoogleMapReact> 

            {locationInfo && <LoactionInfoBox info={locationInfo}/>}

       </div>
    )
}

Map.defaultProps = {
    center: {  
        lat: 42.3265,
        lng: -122.8756
    },
}
export default Map
 