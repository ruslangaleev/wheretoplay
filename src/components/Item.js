import React from 'react';
import {View, Panel, PanelHeader, FormLayout, Input, Textarea, Select, HeaderButton, IOS, platform, Button,
    Cell, Group, List, Avatar, Div} from '@vkontakte/vkui';

import Edit from './Edit';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

export default class Item extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        const { id, title, description, startDateTime, endDateTime, duration, price, fullAddress, userId, levels, limit, players } = this.props.item;

        return(
            <Group title={moment(startDateTime).format('Do MMM, dddd')}>
              <Cell
                photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                description="Волейбол"
                bottomContent={
                  <div style={{ display: 'flex' }}>
                    <Button size="m" onClick={this.props.go}>Подробнее</Button>
                  </div>
                }                
                before={<Avatar size={80}>
                    <div style={{ color: 'black' }}>{moment.utc(startDateTime).format('HH:mm')}</div>
                  </Avatar>}
                size="l"
              >
                {fullAddress}
              </Cell>
            </Group>            
        );
    }
}