import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

function Controller(){
    return(
        <div className = 'controller'>
            <FontAwesomeIcon 
                icon = {faPlay} 
                onClick = {}
            />
        </div>
    );
}

export default Controller;