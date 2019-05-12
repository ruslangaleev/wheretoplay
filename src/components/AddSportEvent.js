import React from 'react';
import {Panel, PanelHeader, View, Input, Select, FormLayoutGroup, FormLayout, Radio, Textarea,
    Checkbox, Link, Button, Group, Cell, List, Slider, platform, IOS, HeaderButton} from '@vkontakte/vkui';
import firebase from '../Firebase'; 
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';   
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { Levels } from '..//data/levels';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

const osname = platform();

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

class Add extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        title: '',
        description: '',
        when: '',
        whatTime: '',
        duration: '',
        levels: [],
        fullAddress: '',
        limit: 0,
        price: 0,
        city: '',
        kindSport: '',
        user: null,
        players: [],
        avatar: ''
      }

      this.dateList = [
        { 
          value: moment.utc().format('YYYY-MM-DD'), 
          display: moment().calendar().split(' ')[0] + " " + moment().format('dddd') },
        {  
          value: moment.utc().add(1, 'days').format('YYYY-MM-DD'),
          display: moment().add(1, 'days').calendar().split(' ')[0] + " " + moment().add(1, 'days').format('dddd') 
        },
        {
          value: moment.utc().add(2, 'days').format('YYYY-MM-DD'),
          display: moment().add(2, 'days').format('Do MMM, dddd')
        },
        {
          value: moment.utc().add(3, 'days').format('YYYY-MM-DD'),
          display: moment().add(3, 'days').format('Do MMM, dddd')
        },
        {
          value: moment.utc().add(4, 'days').format('YYYY-MM-DD'),
          display: moment().add(4, 'days').format('Do MMM, dddd')
        },
        {
          value: moment.utc().add(5, 'days').format('YYYY-MM-DD'),
          display: moment().add(5, 'days').format('Do MMM, dddd')
        }
      ]

      this.onChange = this.onChange.bind(this);
    }

    componentWillMount = () => {
      this.selectedCheckboxes = new Set();
    }

    toggleCheckbox = label => {
      if (this.selectedCheckboxes.has(label.target.value)) {
        this.selectedCheckboxes.delete(label.target.value);
      } else {
        this.selectedCheckboxes.add(label.target.value);
      }
    }   
    
    createCheckbox = label => (
      <Cell selectable
              label={label}
              onChange={this.toggleCheckbox}
              key={label}
              value={label}
      >{label}</Cell>
    )   
    
    createCheckboxes = () => (
      Levels.map(this.createCheckbox)
    )     

    onChange = (e) => {
      const state = this.state
      state[e.target.name] = e.target.value;
      this.setState(state);
    }

    onSubmit = (e) => {
      e.preventDefault();
  
      const { title, description, when, whatTime, duration, price, fullAddress, levels, city, 
              limit, kindSport, avatar } = this.state;
      let date2 = when + " " + whatTime + ":00";
      let startdate1 = moment.utc(date2).format();

      var momentDuration = moment.duration(duration);
      var date3 = moment.utc(startdate1).add(momentDuration._milliseconds, 'milliseconds').format();

      var newPostKey = firebase
        .database()
        .ref()
        .child("cards")
        .push().key;

      var updates = {};
      updates["/cards/" + newPostKey] = {
        title: title,
        description: description,
        startDateTime: startdate1,
        endDateTime: date3,
        levels: Array.from(this.selectedCheckboxes),
        price: price,
        fullAddress: fullAddress,
        city: city,
        players: [],
        limit: limit,
        kindSport: kindSport,
        user: this.props.user,
        avatar: avatar
      };

      firebase
        .database()
        .ref()
        .update(updates);   
        
      this.props.go();
    }    
  
    render() {
      const { email, purpose } = this.state;
  
      return (
        <View activePanel={this.props.id}>
          <Panel id={this.props.id} theme="white">
            <PanelHeader
              theme="light"
              left={<HeaderButton onClick={this.props.go}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
              addon={<HeaderButton onClick={this.props.go}>Назад</HeaderButton>}
            >
            Новое событие</PanelHeader>
            <FormLayout onSubmit={this.onSubmit}>  
              <Input top="Заголовок" name="title" onChange={this.onChange} value={this.state.value} />
              <Textarea top="Описание" name="description" onChange={this.onChange} />

              <Input top="Адрес" name="fullAddress" onChange={this.onChange} value={this.state.value} />
              {/* <FormLayoutGroup top="Видимость мероприятия">
                <Radio name="type" defaultChecked>Виден для всех</Radio>
              </FormLayoutGroup> */}
  
              <Select top="Дата" placeholder="Не выбрано" onChange={this.onChange} name="when">
                {this.dateList.map((date, index) =>
                  <option key={index} value={date.value}>{date.display}</option>
                )}
              </Select>           

              <Select top="Время" placeholder="Не выбрано" onChange={this.onChange} name="whatTime">
                {durations.map((duration, index) =>
                  <option key={index} value={duration}>{duration}</option>
                )}
              </Select>  

              <Select top="Продолжительность" placeholder="Не выбрано" onChange={this.onChange} name="duration">
                {durations.map((duration, index) =>
                  <option key={index} value={duration}>{duration}</option>
                )}
              </Select>                  

              <Group title="Уровень" name="levels" onChange={this.onChange}>
                <List>
                  {this.createCheckboxes()}
                </List>
              </Group>

              <Input top="Цена" name="price" onChange={this.onChange} value={this.state.value} />

              {/* <Input top="Тренер" name="trainer" onChange={this.onChange} value={this.state.value} /> */}
  
              {/* <Select
                top="Цель поездки"
                placeholder="Выберите цель поездки"
                status={purpose ? 'valid' : 'error'}
                bottom={purpose ? '' : 'Пожалуйста, укажите цель поездки'}
                onChange={this.onChange}
                value={purpose}
                name="purpose"
              >
                <option value="0">Бизнес или работа</option>
                <option value="1">Индивидуальный туризм</option>
                <option value="2">Посещение близких родственников</option>
              </Select> */}
              
              {/* <Checkbox>Согласен со всем <Link>этим</Link></Checkbox> */}
              <Button size="xl">Опубликовать</Button>
            </FormLayout>
          </Panel>
        </View>
      );
    }
}
  
export default Add;