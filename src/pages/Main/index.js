import {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router';
import {v4} from 'uuid';

import socket from '../../socket';
import ACTIONS from '../../socket/actions';

import { Container, Header } from '../../components';
import { Button } from "../../components/UI";
import main_logo from '../../img/main_logo.png';
import './style.sass';

function Main() {
  const navigate = useNavigate();
  const [rooms, updateRooms] = useState([]);
  const rootNode = useRef();

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
      if (rootNode.current) {
        updateRooms(rooms);
      }
    });
  }, []);

  return (
    <div ref={rootNode}>
      <Header/>
      <section className="main">
        <Container className="container container_main">
            <div className="main_content">
                <h1 className="main_title">Бесплатные видеозвонки по всему миру вместе с Kursovic!</h1>
                <div className="main_subtitle">Конференции, с которыми твое общение станет еще интереснее!</div>
            </div>
            <div className="main_image">
                <img src={main_logo} alt="main_logo"/>
            </div>
        </Container>
      </section>
      <section className="rooms_live">
        <Container className="container">
            <div className="rooms_live_header">
                <h2 className="rooms_live_header_title">Комнат онлайн: {rooms.length}</h2>
                <Button 
                    className="button_create"
                    onClick={() => navigate(`/room/${v4()}`)}>Создать комнату</Button>
            </div>
            <div className="rooms_live_line"/>
            <div className="rooms_live_list">
                {rooms.map((room) => (
                    <div className="rooms_live_list_item" key={room}>
                        <div className="rooms_live_list_item_title">Комната</div>
                        <div className="rooms_live_list_item_id">ID:{room}</div>
                        <Button className='button_join' onClick={() => navigate(`/room/${room}`)}>Войти</Button>
                    </div>
                ))}
            </div>
        </Container>
        </section>
    </div>
  );
}

export default Main;