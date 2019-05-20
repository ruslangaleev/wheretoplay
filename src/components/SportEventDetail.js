import React from 'react';
import {View, Panel, PanelHeader, HeaderButton, platform, IOS, Group,
    List, Cell, InfoRow, Button, Avatar, FormLayout} from '@vkontakte/vkui';
import firebase from '../Firebase'; 

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';   
import Icon24Back from '@vkontakte/icons/dist/24/back';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

const osname = platform();

export default class SportEventDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      card: props.card,
      players: props.card.players,
      limit: props.card.limit
    }
  }

  onClick = (e) => {
    e.preventDefault();
    
    let { id, city, fullAddress, kindSport, avatar, startDateTime, endDateTime, user,
      levels, description } = this.state.card;
    let limit = this.state.limit;

    const sportEventRef = firebase.database().ref().child('cards/' + this.state.card.id);
    
		sportEventRef.once('value', snapshot => {
      let card = snapshot.val();
      if (card.limit == null) {
        limit = 0;
      } else {
        limit = card.limit;
      }
    })

    let players = this.state.players;

    const currentUser = this.props.user;
    if (players == null) {
      let player = {
        id: currentUser.id,
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
        photo: currentUser.photo_200
      }
      players = [ player ]
    } else {
      let player = players.find(t => t.id === currentUser.id);
      if (player == null) {
        if (limit === 0 || players.length < limit) {
          player = {
            id: currentUser.id,
            firstName: currentUser.first_name,
            lastName: currentUser.last_name,
            photo: currentUser.photo_200
          }
          players.push(player);
        }
      } else {
        let index = players.indexOf(player)
        players.splice(index, 1)
      }
    }

    var updates = {};
    updates["/cards/" + id] = {
      city: city,
      fullAddress: fullAddress,
      kindSport: kindSport,
      avatar: avatar,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      user: user,
      levels: levels,
      description: description,
      players: players,
      limit: limit
    };

    firebase
      .database()
      .ref()
      .update(updates); 
      
    this.setState({
      players: players
    })
  }

  render() {
    let button;

    if (this.state.players == null) {
      button = <Button size="xl" onClick={this.onClick}>Записаться</Button>
    } else {
      if (this.state.players.filter(t => t.id === this.props.user.id).length > 0) {
        button = <Button size="xl" onClick={this.onClick}>Отписаться</Button>
      } else if (this.state.limit != this.state.players.length) {
        button = <Button size="xl" onClick={this.onClick}>Записаться</Button>
      }

      if (this.state.limit === this.state.players.length &&
          this.state.players.filter(t => t.id === this.props.user.id).length > 0) {
        button = <Button size="xl" onClick={this.onClick}>Отписаться</Button>
      }      
    }

    if (this.state.card.user.id == this.props.user.id) {
      button = null;
    }

    return (
      <View id="detail" activePanel="detail">
        <Panel id="detail">
            <PanelHeader
              theme="light"
              left={<HeaderButton onClick={this.props.goBack}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
              addon={<HeaderButton onClick={this.props.goBack}>Назад</HeaderButton>}
            >
            Детали</PanelHeader>
            <FormLayout>
              <Group title="Информация о мероприятии">
                <List>
                  <Cell>
                    <InfoRow title="Вид спорта">
                      {this.props.card.kindSport}
                    </InfoRow>    
                  </Cell>                    
                  <Cell>
                    <InfoRow title="Адрес">
                      {this.props.card.fullAddress}
                    </InfoRow>    
                  </Cell>                  
                  <Cell>
                    <InfoRow title="Дата">
                      {moment.utc(this.state.card.startDateTime).format('Do MMM, dddd')}
                    </InfoRow>   
                  </Cell>
                  <Cell>
                    <InfoRow title="Время">
                      {moment.utc(this.state.card.startDateTime).format('HH:mm')}
                    </InfoRow>                                                                               
                  </Cell>                
                  <Cell>
                    <InfoRow title="Продолжительность">
                      {moment.utc(moment(this.state.card.endDateTime).diff(moment(this.state.card.startDateTime))).format("HH:mm")}
                    </InfoRow>                                                                               
                  </Cell>                    
                  <Cell>
                    <InfoRow title="Лимит игроков">
                      {this.state.card.limit == null ? "Неограничено" : this.state.card.limit}
                    </InfoRow>                                                                               
                  </Cell>                   
                  <Cell>
                    <InfoRow title="Уровни игроков">
                      {this.state.card.levels.map((level) => { return level;}).join(', ')}
                    </InfoRow>                                                                               
                  </Cell>
                  {
                    this.state.card.description
                      ?                   
                      <Cell>
                        <InfoRow title="Комментарий">
                          {this.state.card.description}
                        </InfoRow>                                                                               
                      </Cell>  
                      : null
                  }                                                     
                </List>
              </Group>
              <Group title="Организатор">
                <List>
                <Cell before={<Avatar src={this.state.card.user.photo_200} />}>{this.state.card.user.first_name} {this.state.card.user.last_name}</Cell>               
                </List>
              </Group>              
              <Group title="Список участников">
                <List>
                  {(this.state.players != null) ?
                      this.state.players.map((player) =>
                        <Cell before={<Avatar src={player.photo} />}>{player.firstName} {player.lastName}</Cell>
                      ) : null
                  }                 
                </List>
              </Group>
              {button}
            </FormLayout>
        </Panel>
      </View>
    );
  }    
}