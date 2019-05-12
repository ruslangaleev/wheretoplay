import React from 'react';
import {Group, Div, InfoRow, Cell} from '@vkontakte/vkui';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

const Card = props => (
  <Group title={moment(props.card.startDateTime).format('Do MMM, dddd')}> 
  <Cell expandable onClick={props.go}> 
    <Div>
      <InfoRow>
        {moment(props.card.startDateTime).format('HH:mm')}, {props.card.price}р.
      </InfoRow>     
      <InfoRow>
        {props.card.fullAddress}
      </InfoRow>
      <InfoRow>
        Записано: {}
      </InfoRow>
    </Div>
  </Cell>   
  </Group>  
);

export default Card;
