import React from 'react';
import {View, Panel, PanelHeader, HeaderButton, platform, IOS, Group,
    List, Cell, InfoRow, Button, Avatar} from '@vkontakte/vkui';
import firebase from '../Firebase'; 

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';   
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osname = platform();

export default class Detail extends React.Component {
  onClick = (e) => {
    e.preventDefault();
    
    let { id, city, fullAddress, kindSport, avatar, startDateTime, endDateTime, price, user, 
            levels, description, players } = this.props.card;

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
                    <InfoRow title="Заголовок">
                      {this.props.card.title}
                    </InfoRow>
                  </Cell>
                  <Cell>
                    <InfoRow title="Описание">
                      {this.props.card.description}
                    </InfoRow>   
                  </Cell>
                  <Cell>
                    <InfoRow title="Адрес">
                      {this.props.card.fullAddress}
                    </InfoRow>    
                  </Cell>
                  <Cell>
                    <InfoRow title="Цена">
                      {this.props.card.price}
                    </InfoRow>                                                                               
                  </Cell>                
                </List>
              </Group>
              <Group title="Список участников">
                <List>
                  {(this.props.card.players != null) ?
                      this.props.card.players.map((id) =>
                        <Cell before={<Avatar src={this.props.user.photo_200} />}>{this.props.user.first_name} {this.props.user.last_name}</Cell>
                      ) :
                      "Нет ни одного записанного игрока"
                  }                 
                </List>
              </Group>
              { (this.props.user.id === this.props.card.userId) ?
                 <Button size="xl">Редактировать</Button> :
                 <Button size="xl" onClick={this.onClick}>Записаться</Button>}     
        </Panel>
      </View>
    );
  }    
}