import React from 'react';
import {View, Panel, PanelHeader, HeaderButton, platform, IOS, Group,
    List, Cell, InfoRow, Button, Avatar} from '@vkontakte/vkui';
import firebase from '../Firebase'; 

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';   
import Icon24Back from '@vkontakte/icons/dist/24/back';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

const osname = platform();

export default class Detail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      card: props.card
    }
  }

  onClick = (e) => {
    e.preventDefault();
    
    let { id, city, fullAddress, kindSport, avatar, startDateTime, endDateTime, price, user, 
            levels, description, players } = this.state.card;

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
        player = {
          id: currentUser.id,
          firstName: currentUser.first_name,
          lastName: currentUser.last_name,
          photo: currentUser.photo_200
        }
        players.push(player);
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
      price: price,
      user: user,
      levels: levels,
      description: description,
      players: players
    };

    firebase
      .database()
      .ref()
      .update(updates);      
  }

  render() {
    let button;
    if (this.state.card.players == null) {
      button = <Button size="xl" onClick={this.onClick}>Записаться</Button>
    } else {
      if (this.state.card.players.filter(t => t.id === this.props.user.id).length > 0) {
        button = <Button size="xl" onClick={this.onClick}>Отписаться</Button>
      } else {
        button = <Button size="xl" onClick={this.onClick}>Записаться</Button>
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
                  <Cell>
                    <InfoRow title="Цена">
                      {this.state.card.price}
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
                  {(this.state.card.players != null) ?
                      this.state.card.players.map((player) =>
                        <Cell before={<Avatar src={this.player.photo} />}>{this.props.user.firstName} {this.props.user.lastName}</Cell>
                      ) :
                      "Нет ни одного записанного игрока"
                  }                 
                </List>
              </Group>
              {button}
        </Panel>
      </View>
    );
  }    
}