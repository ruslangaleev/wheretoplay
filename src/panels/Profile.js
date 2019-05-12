import React from 'react';
import {Panel, PanelHeader, Group, ListItem, Avatar, View} from '@vkontakte/vkui';

import Card from './Card';

const Profile = props => (
  <View id="profile" activePanel="profile">
  <Panel id={props.id}>
    <PanelHeader>
        Профиль
    </PanelHeader>

    {props.fetchedUser &&
    <Group title="User Data Fetched with VK Connect">
        <ListItem
            before={props.fetchedUser.photo_200 ? <Avatar src={props.fetchedUser.photo_200}/> : null}
            description={props.fetchedUser.city && props.fetchedUser.city.title ? props.fetchedUser.city.title : ''}
        >
            {`${props.fetchedUser.first_name} ${props.fetchedUser.last_name}`}
        </ListItem>
    </Group>}

    <Group title="Мои опубликованные события">
      {props.myCards.map((card) => 
        <Card card={card} go={props.go} />
      )}
    </Group>

    <Group title="События, на которые я подписался">
      {/* {props.cardsSubscripted.map((card) =>
        <Card card={card} />
      )} */}
    </Group>
  </Panel>
  <Panel id="detail">
    <PanelHeader>
        Подробно
    </PanelHeader>
  </Panel>
  </View>
);
export default Profile;