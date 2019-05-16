import React from 'react';
import { Button, Cell, Group, Avatar } from '@vkontakte/vkui';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

export default class Item extends React.Component {
    render() {
        const { kindSport, startDateTime, fullAddress, avatar } = this.props.item;
        var imageName = require('../images/' + avatar)
        return(
            <Group title={moment(startDateTime).format('Do MMM, dddd')}>
              <Cell
                photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                description={kindSport}
                bottomContent={
                  <div style={{ display: 'flex' }}>
                    <Button size="m" onClick={this.props.go}>Подробнее</Button>
                  </div>
                }                
                before={<Avatar src={ imageName } size={80}/>}
                size="l"
                asideContent={moment.utc(startDateTime).format('HH:mm')}                
              >
                {fullAddress}
              </Cell>
            </Group>            
        );
    }
}