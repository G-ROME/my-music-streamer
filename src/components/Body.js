import React,{useState, useEffect} from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faSearch, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons'

import ReactPlayer from 'react-player/youtube';

// import Controller from './Controller';


function Body() {
    
    const api = 'https://www.googleapis.com/youtube/v3';
        const maxResults = 12;
        const [queryString, setQueryString] = useState('aviencloud');
    const params =
    `/search?part=snippet&maxResults=${maxResults}&order=relevance&q=${queryString}&type=video&videoCategoryId=10&key=`;
    const API_KEY= 'AIzaSyDEjL14leEAA6ZPe60TppG-bp8CY1VBHLo';
    const API_KEY_testAccount= 'AIzaSyBU16GTxY3WGoI8r6q9TYNZJPO2qbczaSo';
    const apiUrl = api + params + API_KEY_testAccount;

    const [sauce, setSauce] = useState(null);
    let url = `https://www.youtube.com/watch?v=${sauce}`;

    const [bg, setBg] = useState(`http://i.ytimg.com/vi/E3FfwK81OsU/maxresdefault.jpg`);

    const [music, setMusic] = useState({loading: false, data: null, error:false});

    const [play, setPlay] = useState(false);
    const [playIcon, setPlayICon] = useState(faPlay);

    const [selectedTrack, setSelectedTrack] = useState(null);
    const [fetch, setFetch] = useState('select a track');

    const [playList, setPlaylist] = useState([]);

    useEffect(() => {
        setMusic({
            loading:true,
            data: null,
            error:false
        });
        axios.get(apiUrl)
            .then((response) => {
                setMusic({
                    loading: false,
                    data: response.data['items'],
                    error:false
                });
            })  
            .catch(error =>{
                setMusic({
                    loading: false,
                    data: null,
                    error:error.message
                })
            });
    }, [apiUrl]);

    let content = 
        <div className = 'loaderContainer'>
            <div className='loader'/>
        </div>
    if(music.data){
        let playListContainer = [];
        content = 
        music.data.map((music, key) => 
        <div className="channelCard" 
            onLoad = {playListContainer.push(music.id.videoId)}
            key = {key}
            onClick = {() => {
                setPlaylist(playListContainer);
                setSauce(music.id.videoId);
                setBg(`http://i.ytimg.com/vi/${music.id.videoId}/maxresdefault.jpg`);
                setSelectedTrack('Now Playing: '+music.snippet.title);
                setFetch(<div className = 'flex'><div className='miniLoader'/>{'fetching: ' +music.snippet.title+ '   '}</div>);
                setPlay(true);
            }}
        >
            <img src={music.snippet.thumbnails.default.url} alt='[img]'></img>
            <p>{music.snippet.title}</p>
        </div>
        );
    }

    if(music.error){
        content = <div className = 'loaderContainer'>
            {music.error}
            {music.data}
        </div>
    }

    return(
        <main style={{backgroundImage: `url(${bg})`}}>
            <div className = 'container'>
                <div className='musicList'> 
                    {content}
                </div>
                <div className = 'searchBar'>
                    <input id = 'searchField' type = 'text' 
                        placeholder = {queryString}
                    />
                    <FontAwesomeIcon 
                        className = 'searchIcon'
                        icon = {faSearch}
                        onClick = {() => setQueryString(document.getElementById('searchField').value)}
                    />
                </div>
            </div>
            <div className = 'nowPlaying'>
                <div className = 'forMarquee'>
                    {fetch}
                </div>
                <div className = 'controller' >
                    <FontAwesomeIcon 
                        icon = { faBackward}
                    />
                    <FontAwesomeIcon 
                        className = 'playPause'
                        icon = { playIcon }
                        onClick = {() => setPlay( sauce ? !play : play)}
                    />
                    <FontAwesomeIcon 
                        icon = { faForward}
                        onClick = {() => setSauce()}
                    />
                </div>
            </div>
            <ReactPlayer
                className = 'ReactPlayer'
                onStart = {() => setFetch(selectedTrack)}
                onError = {() => setFetch('something went wrong while fetching the data')}
                onPlay = {() => setPlayICon(faPause)}
                onPause = {() => setPlayICon(faPlay)}
                controls = {true}
                url = {url}
                playing = {play}
                loop = {true}
            />
        </main>
    );
}

export default Body;