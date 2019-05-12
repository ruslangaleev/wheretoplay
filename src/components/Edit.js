import React from 'react';
import {View, Panel, PanelHeader, FormLayout, Input, Textarea, Select, HeaderButton, IOS, platform, Button,
        Cell, Group, List} from '@vkontakte/vkui';
import firebase from '../Firebase'; 

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';   
import Icon24Back from '@vkontakte/icons/dist/24/back';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

const osname = platform();

const dateList = [
    { 
      value: moment().format('YYYY-MM-DD'), 
      display: moment().calendar().split(' ')[0] + " " + moment().format('dddd') },
    {  
      value: moment().add(1, 'days').format('YYYY-MM-DD'),
      display: moment().add(1, 'days').calendar().split(' ')[0] + " " + moment().add(1, 'days').format('dddd') 
    },
    {
      value: moment().add(2, 'days').format('YYYY-MM-DD'),
      display: moment().add(2, 'days').format('Do MMM, dddd')
    },
    {
      value: moment().add(3, 'days').format('YYYY-MM-DD'),
      display: moment().add(3, 'days').format('Do MMM, dddd')
    },
    {
      value: moment().add(4, 'days').format('YYYY-MM-DD'),
      display: moment().add(4, 'days').format('Do MMM, dddd')
    },
    {
      value: moment().add(5, 'days').format('YYYY-MM-DD'),
      display: moment().add(5, 'days').format('Do MMM, dddd')
    }
]

const levels = [
    'Лайт',
    'Лайт+',
    'Медиум'
]

const durations = [
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
  
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
  
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
  
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30'
]

export default class Edit extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        id: props.card.id,
        title: props.card.title,
        description: props.card.description,
        startDateTime: props.card.startDateTime,
        endDateTime: props.card.endDateTime,
        price: props.card.price,
        fullAddress: props.card.fullAddress,
        levels: props.card.levels,
        limit: props.card.limit,
        //players: props.card.players,
        when: moment(props.card.startDateTime).format('YYYY-MM-DD'),
        whatTime: moment.utc(props.card.startDateTime).format('HH:mm'),
        duration: moment.utc(moment(props.card.endDateTime).diff(moment(props.card.startDateTime))).format("HH:mm"),
        userId: props.card.userId
      }
    }

    componentDidMount() {
    }

    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    onSubmit = (e) => {
        e.preventDefault();
    
        const { id, title, description, when, whatTime, duration, price, fullAddress, userId, levels } = this.state;
        let date2 = when + " " + whatTime + ":00";
        let startdate1 = moment.utc(date2).format();
  
        var momentDuration = moment.duration(duration);
        var date3 = moment.utc(startdate1).add(momentDuration._milliseconds, 'milliseconds').format();
  
        var updates = {};
        updates["/cards/" + id] = {
            id: id,
            title: title,
            description: description,
            startDateTime: startdate1,
            endDateTime: date3,
            levels: levels,
            //: Array.from(this.selectedCheckboxes),
            price: price,
            fullAddress: fullAddress,
            userId: userId
        };
  
        firebase
          .database()
          .ref()
          .update(updates);   
          
        this.props.go();
    }  
    
    componentWillMount = () => {
        this.selectedCheckboxes = new Set();
    }
  
    toggleCheckbox = label => {
        const levels = this.state.levels
        let index
        let value = label.target.value

        if (levels.indexOf(value) === -1)
        {
            levels.push(value)
        } else {
            index = levels.indexOf(value)
            levels.splice(index, 1)
        }

        this.setState({ levels: levels })    
    }   
      
    createCheckbox = label => (
        <Cell selectable
            checked={this.state.levels.indexOf(label) > -1}
            label={label}
            onChange={this.toggleCheckbox}
            key={label}
            value={label}
        >{label}</Cell>
    )   
      
    createCheckboxes = () => (
        levels.map(this.createCheckbox)
    )     

    render() {
        return(
            <View id="edit" activePanel="edit">
                <Panel id="edit">
                    <PanelHeader
                        theme="light"
                        left={<HeaderButton onClick={this.props.go}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                        addon={<HeaderButton onClick={this.props.go}>Назад</HeaderButton>}
                    >
                        Редактирование
                    </PanelHeader>
                    <FormLayout onSubmit={this.onSubmit}>
                        <Input top="Заголовок" name="title" onChange={this.onChange} value={this.state.title} />
                        <Textarea top="Описание" name="description" onChange={this.onChange} value={this.state.description} />
                        <Input top="Адрес" name="fullAddress" onChange={this.onChange} value={this.state.fullAddress} />

                        <Select top="Дата" placeholder="Не выбрано" onChange={this.onChange} name="when" value={this.state.when}>
                            {dateList.map((date, index) =>
                                <option key={index} value={date.value} >{date.display}</option>
                            )}
                        </Select>

                        <Select top="Время" placeholder="Не выбрано" onChange={this.onChange} name="whatTime" value={this.state.whatTime}>
                            {durations.map((duration, index) =>
                                <option key={index} value={duration}>{duration}</option>
                            )}
                        </Select> 

                        <Select top="Продолжительность" placeholder="Не выбрано" onChange={this.onChange} name="duration" value={this.state.duration}>
                            {durations.map((duration, index) =>
                            <option key={index} value={duration}>{duration}</option>
                            )}
                        </Select>

                        <Group title="Уровень" name="level" onChange={this.onChange}>
                            <List>
                                {this.createCheckboxes()}
                            </List>
                        </Group>                         
                        <Button size="xl">Сохранить</Button>                          
                    </FormLayout>
                </Panel>             
            </View>
        );
    }
}