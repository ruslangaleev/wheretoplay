import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, HeaderButton, platform, IOS, View, Group, Cell, InfoRow, Div, Button, Avatar} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Add from '@vkontakte/icons/dist/24/add';

import Item from '../components/Item';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

const osname = platform();

const List = props => (
  <Panel id={props.id}>

    <PanelHeader
      left={<HeaderButton onClick={props.goAdd}>{<Icon24Add />}</HeaderButton>}
    >
      Список игр
    </PanelHeader>

    {props.cards.map((card) => 
        <Item item={card} />
    )}

  </Panel>
);

List.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default List;
