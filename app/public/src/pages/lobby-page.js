import { WORDS, XP_TABLE } from "../../../models/enum";

class LobbyPage {
  constructor(args) {
    this.room = args.room;
    this.allRooms = [];
    this.langage = 'esp';
    if(window._client.auth.lang){
      this.langage = window._client.auth.lang;
    }
    this.initializeRoom();

    this.render();
    this.addEventListeners();
  }
  
  addMessage(message){
    //console.log(message);
    if(document.getElementById('messages')){
      let messageHTML = document.createElement('li');
      let nameHTML = document.createElement('p');
      let messageContentHTML = document.createElement('p');
  
      messageContentHTML.textContent = message.payload;
      const timeOfMessage = new Date(message.time);
      nameHTML.style.color = 'black';
      nameHTML.style.fontWeight = 'bold';
      nameHTML.textContent = `${timeOfMessage.toUTCString()} - ${message.name} :`;
      
      if(message.avatar){
        let imageHTML = document.createElement('img');
        imageHTML.src = `assets/avatar/${message.avatar}.png`;
        imageHTML.style.width = '50px';
        imageHTML.style.height = '50px';
        messageHTML.appendChild(imageHTML);
      }
      
      messageHTML.appendChild(nameHTML);
      messageHTML.appendChild(messageContentHTML);
      messageHTML.style.display = 'flex';
      document.getElementById('messages').appendChild(messageHTML);
      messageHTML.scrollIntoView();
    }
  }

  initializeRoom(){
    this.room.onLeave((client, consent) => {

      if (consent) {
        // sessionStorage.setItem('PAC_Room_ID', this.room.id);
        // sessionStorage.setItem('PAC_Session_ID', this.room.sessionId);
      }
    });
    let self = this;
    this.room.state.messages.onAdd = (message, index) => {
      self.addMessage(message);
    };

    this.room.onMessage('rooms', (rooms) => {
      // console.log(rooms);
      this.allRooms = rooms;
      this.handleRoomListChange();
    });

    this.room.onMessage('to-lobby', ()=>{
      this.room.leave();
      _client.auth.logout();
      window.dispatchEvent(new CustomEvent('render-home'));
    });

    this.room.onMessage('+', ([roomId, room]) => {
      const roomIndex = this.allRooms.findIndex((room) => room.roomId === roomId);
      if (roomIndex !== -1) {
        this.allRooms[roomIndex] = room;
      } else {
        this.allRooms.push(room);
      }
      this.handleRoomListChange();
    });

    this.room.onMessage('-', (roomId) => {
      this.allRooms = this.allRooms.filter((room) => room.roomId !== roomId);
      this.handleRoomListChange();
    });
  }

  render() {
    let self = this;
    const content = document.createElement('div');
    content.setAttribute('id', 'lobby');
    content.innerHTML = `
  <header>
    <h1>${WORDS.GAME_LOBBY[this.langage]}</h1>
  </header>

  
  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
        <div style="display:flex;flex-flow:row;">
          <img style="width:50px;" src='assets/avatar/${_client.auth.metadata.avatar}.png'></img>
          <h4>${_client.auth.email}</h4>
        </div>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <h4>Level ${_client.auth.metadata.level}</h4>
          <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="${_client.auth.metadata.exp}" aria-valuemin="0" aria-valuemax="${XP_TABLE[_client.auth.metadata.level]}" style="width: ${_client.auth.metadata.exp * 100 / XP_TABLE[_client.auth.metadata.level]}%">${_client.auth.metadata.exp}/${XP_TABLE[_client.auth.metadata.level]} XP</div>
          </div>
          <h4>Wins</h4>
          <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="${_client.auth.metadata.wins}" aria-valuemin="0" aria-valuemax="500" style="width: ${_client.auth.metadata.wins * 100 / 500}%">${_client.auth.metadata.wins}/500 Wins</div>
          </div>
          <h4>Frosty Forest</h4>
          <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-dark" role="progressbar" aria-valuenow="${_client.auth.metadata.mapWin.ICE}" aria-valuemin="0" aria-valuemax="100" style="width: ${_client.auth.metadata.mapWin.ICE * 100 / 100}%">${_client.auth.metadata.mapWin.ICE}/100 Wins</div>
          </div>
          <h4>Glimmer Desert</h4>
          <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-valuenow="${_client.auth.metadata.mapWin.GROUND}" aria-valuemin="0" aria-valuemax="100" style="width: ${_client.auth.metadata.mapWin.GROUND * 100 / 100}%">${_client.auth.metadata.mapWin.GROUND}/100 Wins</div>
          </div>
          <h4>Hidden Highland</h4>
          <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" aria-valuenow="${_client.auth.metadata.mapWin.GRASS}" aria-valuemin="0" aria-valuemax="100" style="width: ${_client.auth.metadata.mapWin.GRASS * 100 / 100}%">${_client.auth.metadata.mapWin.GRASS}/100 Wins</div>
          </div>
          <h4>Magma Cavern</h4>
          <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" aria-valuenow="${_client.auth.metadata.mapWin.FIRE}" aria-valuemin="0" aria-valuemax="100" style="width: ${_client.auth.metadata.mapWin.FIRE * 100 / 100}%">${_client.auth.metadata.mapWin.FIRE}/100 Wins</div>
          </div>
          <h4>Tiny Woods</h4>
          <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" aria-valuenow="${_client.auth.metadata.mapWin.NORMAL}" aria-valuemin="0" aria-valuemax="100" style="width: ${_client.auth.metadata.mapWin.NORMAL * 100 / 100}%">${_client.auth.metadata.mapWin.NORMAL}/100 Wins</div>
          </div>
          <h4>Stormy Sea</h4>
          <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-cyan" role="progressbar" aria-valuenow="${_client.auth.metadata.mapWin.WATER}" aria-valuemin="0" aria-valuemax="100" style="width: ${_client.auth.metadata.mapWin.WATER * 100 / 100}%">${_client.auth.metadata.mapWin.WATER}/100 Wins</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">${WORDS.CLOSE[this.langage]}</button>
          <button type="button" class="btn btn-primary">${WORDS.SAVE[this.langage]}</button>
        </div>
      </div>
    </div>
  </div>

  <div style="display:flex; justify-content:space-between;"> 
  
    <button type="button" class="btn btn-secondary" id="button-home">${WORDS.HOME[this.langage]}</button>
    <div class="dropdown">

    <!-- Button trigger modal -->
    <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">
      Profile
    </button>

    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <img src="assets/flags/${this.langage}.png"/>  
    ${WORDS.CHANGE_LANGAGE[this.langage]}
    </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#" id ="eng-button">
        <img src="assets/flags/eng.png"/>
        English</a>
        <a class="dropdown-item" href="#" id ="esp-button">
        <img src="assets/flags/esp.png"/>
        Español</a>
      </div>
    </div>
  </div>
  <div style="display:flex; height:80%;"> 

    <div style="width:50%; height:100%;">      
      <ul id="messages" style="height:100%; overflow: scroll; display:flex; flex-flow:column;">
      </ul>
    </div>

    <div style="display:flex; flex-flow:column; justify-content:space-around; align-items:center; width:50%; height:100%;">   
     <div style="display:flex;flex-flow:row;"><img style="width:50px;" src='assets/avatar/${_client.auth.metadata.avatar}.png'></img><p style='margin-left:10px;'>${_client.auth.email}</p></div>
      <h3>${WORDS.AVAILABLE_ROOM_IDS[this.langage]}:</h3>
      <ul id="room-list"></ul>
      <button type="button" class="btn btn-secondary" id="create">${WORDS.CREATE_NEW_ROOM[this.langage]}</button>
    </div>

  </div>

  <div id='chat-container' style="width:50%; display:flex;">
    <input style="width:80%;" id="inputMessage" class="inputMessage" placeholder="${WORDS.TYPE_HERE[this.langage]}..." type="text">
    <button type="button" class="btn btn-secondary" style="width:20%;" id="send">${WORDS.SEND[this.langage]}</button>
  </div>`;
    document.body.innerHTML = '';
    document.body.appendChild(content);
    this.handleRoomListChange();
    this.room.state.messages.forEach((message, index) => {
      self.addMessage(message);
    });

  }

  addEventListeners() {
    //console.log(_client.auth.lang);
    let self = this;

    document.getElementById('button-home').addEventListener('click', (e) => {
      this.room.leave();
      _client.auth.logout();
      window.dispatchEvent(new CustomEvent('render-home'));
    });

    document.getElementById('create').addEventListener('click', (e) => {
      this.createRoom();
    });

    document.getElementById('send').addEventListener('click',function(){
      self.sendMessage();
    });

    document.getElementById('inputMessage').addEventListener('keyup', function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        self.sendMessage();
      }
    });

    document.getElementById('eng-button').addEventListener('click', (e) => {
      window.dispatchEvent(new CustomEvent('switch-lang',{detail: {lang: 'eng', render: 'lobby', room: self.room}}));
    });

    document.getElementById('esp-button').addEventListener('click', (e) => {
      window.dispatchEvent(new CustomEvent('switch-lang',{detail: {lang: 'esp', render: 'lobby', room: self.room}}));
    });


  }

  createRoom() {
    _client.create('room', {/* options */ }).then((room) => {
      this.room.leave();
      window.dispatchEvent(new CustomEvent('render-room', {detail: {room: room}}));
    }).catch((e) => {
      console.error('join error', e);
      alert(e);
    });
  }

  joinRoomById(id) {
    if (id === '') return;
    _client.joinById(id).then((room) => {
      this.room.leave();
      window.dispatchEvent(new CustomEvent('render-room', {detail: {room: room}}));
    }).catch((e) => {
      console.error('join error', e);
      alert(e);
    });
  }

  sendMessage(){
    if(document.getElementById('inputMessage').value != ''){
      this.room.send('new-message', {'name': _client.auth.email, 'payload': document.getElementById('inputMessage').value, 'avatar': _client.auth.metadata.avatar});
      document.getElementById('inputMessage').value = '';
    }
  }

  handleRoomListChange() {
    if (document.getElementById('room-list')) {
      document.getElementById('room-list').innerHTML = '';
      this.allRooms.forEach((room) => {
        if (room.name != 'game') {
          let item = document.createElement('li');
          item.textContent = `Room id : ${room.roomId} (${room.clients}/${room.maxClients})`;
          let button = document.createElement('button');
          button.textContent = 'Join';
          button.classList.add("btn");
          button.classList.add("btn-secondary");
          button.addEventListener('click', () => {
            this.joinRoomById(room.roomId);
          });
          item.appendChild(button);
          document.getElementById('room-list').appendChild(item);
        }
      });
    }
  }
}

export default LobbyPage;
