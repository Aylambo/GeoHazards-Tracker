import React from 'react'

const LoactionInfoBox = ({info}) => {
    return (
        <div className="info">
            <h2>Event Loaction Info</h2>
            <ul>
                <li>ID: <strong>{info?.id}</strong></li>
                <li>Loaction: <strong>{info?.title}</strong></li>    
            </ul> 
            
        </div>
    )
}

export default LoactionInfoBox
