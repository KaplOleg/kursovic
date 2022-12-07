import {useNavigate, useParams} from 'react-router';
import useWebRTC, {LOCAL_VIDEO} from '../../hooks/useWebRTC';

import { Container, Header } from "../../components";
import { Button } from "../../components/UI";
import './style.sass';

import camera from "../../img/camera.png";
import micro from "../../img/micro.png";
import leave from "../../img/leave.png";

function Room() {
  const navURL = useNavigate();
  const {id: roomID} = useParams();
  const {clients, provideMediaRef, toogleCamera, toogleAudio} = useWebRTC(roomID);

  return (
    <div>
      <Header/>
      <section className="content">
        <Container className='container'>
          <div className="video-chat">
            {clients.map(client => (
              <video 
                className="video-chat-content"
                key={client}
                ref={instance => {
                  provideMediaRef(client, instance);
                }}
                autoPlay
                playsInline
                muted={client === LOCAL_VIDEO}/>
            ))}
          </div>

          <div className="options">
            <Button className="button_option_camera" onClick={toogleCamera}>
              <img src={camera} alt="camera"/>
            </Button>
            <Button className="button_option_audio" onClick={toogleAudio}>
              <img src={micro} alt="micro"/>
            </Button>
            <Button className="button_option_leave" onClick={() => navURL('/')}>
              <img src={leave} alt="leave"/>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default Room;