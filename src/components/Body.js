import React,{useState, useEffect} from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faSearch, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons'

import ReactPlayer from 'react-player/youtube';


function Body() {
    const api = 'https://www.googleapis.com/youtube/v3';
        const maxResults = 12;
        const [queryString, setQueryString] = useState('nightcore');
    const params =
    `/search?part=snippet&maxResults=${maxResults}&order=relevance&q=${queryString}&type=video&videoCategoryId=10&key=`;
    const API_KEY_test01= process.env.REACT_APP_API_KEY_test01;
    const apiUrl = api + params + API_KEY_test01;

    const [sauce, setSauce] = useState(null);
    let url = `https://www.youtube.com/watch?v=${sauce}`;

    const [bg, setBg] = useState(null);

    const [music, setMusic] = useState({loading: false, data: null, error:false});

    const [play, setPlay] = useState(false);
    const [playIcon, setPlayICon] = useState(faPlay);

    const [selectedTrack, setSelectedTrack] = useState(null);

    const [bottomPreview, setBottomPreview] = useState('fetching data');

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
        content = 
        music.data.map((music, key) => 
        <div className="channelCard" 
                key = {key}
                onLoad = {() => {
                        if(key === 0 && !sauce){
                            setBottomPreview('select a track');
                            checkAndSetBg(music.id.videoId);
                        }
                        setPlaylist(playList.concat({
                            'key': key,
                            'title': music.snippet.title,
                            'id': music.id.videoId,
                        }))
                        document.getElementsByClassName('channelCard')[key].style.display = 'flex';
                    }
                }
                onClick = {() => {
                    changeMusic(key);
                }
            }
        >
            {/* //TODO --change this part to conserve quota -- update I have no idea how
            //I'll get back to it */}
            <img src={music.snippet.thumbnails.default.url} alt='[img]'></img>
            <p>{music.snippet.title}</p>
        </div>
        );
    }

    function changeMusic(key){
        playList.forEach(music => {
            if(music.key === key){
                setSelectedTrack({
                    'key':music.key,
                    'title': music.title,
                });
                setBottomPreview(<div className = 'flex'>{'Fetching: ' + music.title }<div className='miniLoader'/></div>);
                setSauce(music.id);
                setPlay(true);
            }
        });
    }

    function checkAndSetBg(vidId){
        let image = new Image();
        image.src = `https://i.ytimg.com/vi/${vidId}/maxresdefault.jpg`;
        image.onload = function(){
            if(this.width >120){
                setBg(this.src);
            }else{
                setBg(`https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`)
            }
        }
    }

    if(music.error){
        if(music.error === 'Request failed with status code 403'){
        content = 
            <div className = 'loaderContainer'>
                    we've run out of quota,
                    quotas reset on 3:00pm PST so 
                    come back here after the quota resets
            </div>
        }else{
        content = 
            <div className = 'loaderContainer'>
                {music.error}
            </div>
        }
    }

    

    return(
        <main style={{backgroundImage: `url(${bg})`}}>
            <div className = 'container'>
                <div className='musicList'> 
                    {content}
                </div>
                <div className = 'searchBar'>
                    <input 
                        id = 'searchField' 
                        type = 'text' 
                        placeholder = {queryString}
                        onClick = {() => {
                                document.getElementById('searchField').addEventListener('keyup', function(event){
                                    if(event.keyCode === 13){
                                        setQueryString(this.value);
                                    }
                                });
                            }
                        }
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
                    {bottomPreview}
                </div>
                <div className = 'controller' >
                    <FontAwesomeIcon 
                        icon = { faBackward }
                        onClick = {() => sauce ? selectedTrack.key!==0 ? changeMusic(selectedTrack.key-1) : null : null}
                    />
                    <FontAwesomeIcon 
                        className = 'playPause'
                        icon = { playIcon }
                        onClick = {() => setPlay( sauce ? !play : play)}
                    />
                    <FontAwesomeIcon 
                        icon = { faForward }
                        onClick = {() => sauce ? selectedTrack.key!==maxResults-1 ? changeMusic(selectedTrack.key+1) : null : null}
                    />
                </div>
            </div>
            <ReactPlayer
                className = 'ReactPlayer'
                onStart = {() => {
                    setBottomPreview('Now Playing: '+selectedTrack.title);
                    checkAndSetBg(sauce);
                    }
                }
                onError = {() => setBottomPreview('something went wrong while fetching the data')}
                onPlay = {() => setPlayICon(faPause)}
                onPause = {() => setPlayICon(faPlay)}
                controls = {true}
                url = {url}
                playing = {play}
                loop = {true}
                config = {
                    {
                        youtube: {
                            playerVars: {
                                height : '144px',
                                width: '256px',
                                vq: 'small'
                            }
                        }
                    }
                }
            />
        </main>
    );
}

export default Body;