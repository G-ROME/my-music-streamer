import React from 'react';
import ReactPlayer from 'react-player/youtube';

function YTplayer(props){
    return(
        <ReactPlayer
          url = {props.url}
          controls = {true}
          playing = {props.playing}
          loop = {true}
        />

    );
    
}

export default YTplayer;
