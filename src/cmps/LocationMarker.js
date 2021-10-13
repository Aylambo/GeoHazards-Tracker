import React from 'react';
import {Icon} from '@iconify/react';
import fireAlert from '@iconify/icons-mdi/fire-alert'
import volcanoIcon from '@iconify/icons-emojione/volcano';
import thunderstormSevere from '@iconify/icons-carbon/thunderstorm-severe';
import iceIcon from '@iconify/icons-emojione/snowflake';


const LocationMarker = ({lat, lng, onClick, id}) => {
    let icon = null;
    let iconClassName = null;

    if(id === 8) {
        icon = fireAlert
        iconClassName = 'icon-size fire-alert'
    } else if(id === 10) {
        icon = thunderstormSevere
        iconClassName = 'icon-size thunder-storm'
    } else if(id === 12) {
        icon = volcanoIcon
        iconClassName = 'icon-size volcano-icon'
    } else if(id === 15) {
        icon = iceIcon
        iconClassName = 'icon-size ice-icon'
    } 

    return (
        <div className="location-marker" onClick={onClick}>
            <Icon icon={icon} className={iconClassName}/>
        </div>
    )
}

export default LocationMarker
