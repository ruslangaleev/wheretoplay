import React from 'react';
import { Panel, PanelHeader, View, Input, Select, FormLayout, Textarea, Button, Group, Cell, List, platform, IOS, HeaderButton} from '@vkontakte/vkui';
import firebase from '../Firebase'; 
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';   
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { levels } from '../data/Levels';
import { times } from '../data/Times';
import { sports } from '../data/Sports';
import { cities } from '../data/Cities';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

const osname = platform();

class Add extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        kindSport: null,
        city: 'Уфа',
        fullAddress: '',
        when: '',
        whatTime: '',
        duration: '',
        limit: 0,
        levels: [],
        price: 0,
        description: '',
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
      levels.map(this.createCheckbox)
    )     

    onChange = (e) => {
      const state = this.state
      state[e.target.name] = e.target.value;
      this.setState(state);
    }

    onKindSportChange = (e) => {
      const state = this.state
      const sport = sports[e.target.value];
      state[e.target.name] = sport;
      this.setState(state);
    }    

    onSubmit = (e) => {
      e.preventDefault();
  
      const { kindSport, city, fullAddress, when, whatTime, duration, limit, price, description } = this.state;

      if (kindSport === '' || city === '' || fullAddress === '' || when === '' || whatTime === '')
      {
        return;
      }

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
        kindSport: kindSport.name,
        city: city,
        fullAddress: fullAddress,
        startDateTime: startdate1,
        endDateTime: date3,
        limit: limit,
        levels: Array.from(this.selectedCheckboxes),
        price: price,
        description: description,
        
        user: this.props.user,
        avatar: kindSport.avatars[0]
      };

      firebase
        .database()
        .ref()
        .update(updates);   
        
      this.props.go();
    }    
  
    render() {
      const { kindSport, fullAddress, when, whatTime, duration } = this.state;  
      return (
        <View activePanel={this.props.id}>
          <Panel id={this.props.id} theme="white">
            <PanelHeader
              theme="light"
              left={<HeaderButton onClick={this.props.go}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
              addon={<HeaderButton onClick={this.props.go}>Назад</HeaderButton>}
            >
            Новое мероприятие</PanelHeader>
            <FormLayout onSubmit={this.onSubmit}>
              <Select 
                top="Вид спорта" 
                placeholder="Не выбрано"
                status={kindSport ? 'valid' : 'error'}
                bottom={kindSport ? '' : 'Пожалуйста, укажите вид спорта'}
                onChange={this.onKindSportChange}
                name="kindSport">
                {sports.map((sport, index) =>
                  <option key={index} value={index}>{sport.name}</option>
                )}
              </Select>    

              <Select top="Город" name="city" value="Уфа">
                {cities.map((city, index) =>
                  <option key={index} value={city}>{city}</option>
                )}
              </Select>                            

              <Input 
                top="Адрес" 
                placeholder="Введите улицу, номер здания..."
                status={fullAddress ? 'valid' : 'error'}
                bottom={fullAddress ? '' : 'Пожалуйста, укажите адрес'}
                name="fullAddress" 
                onChange={this.onChange} 
                value={this.state.value} 
              />

              <Select 
                top="Дата" 
                placeholder="Не выбрано" 
                status={when ? 'valid' : 'error'}
                bottom={when ? '' : 'Пожалуйста, выберите дату'}
                onChange={this.onChange} 
                name="when">
                {this.dateList.map((date, index) =>
                  <option key={index} value={date.value}>{date.display}</option>
                )}
              </Select>                   

              <Select 
                top="Время" 
                placeholder="Не выбрано" 
                status={whatTime ? 'valid' : 'error'}
                bottom={whatTime ? '' : 'Пожалуйста, выберите время'}                
                onChange={this.onChange} 
                name="whatTime">
                {times.map((time, index) =>
                  <option key={index} value={time}>{time}</option>
                )}
              </Select>  

              <Select 
                top="Продолжительность" 
                placeholder="Не выбрано" 
                status={duration ? 'valid' : 'error'}
                bottom={duration ? '' : 'Пожалуйста, выберите продолжительность'}                
                onChange={this.onChange} 
                name="duration">
                {times.map((duration, index) =>
                  <option key={index} value={duration}>{duration}</option>
                )}
              </Select>

              <Input top="Лимит игроков" 
                placeholder="Неограничено"
                name="fullAddress" 
                onChange={this.onChange} 
                value={this.state.limit} 
              />                              

              <Group title="Уровень" name="levels" onChange={this.onChange}>
                <List>
                  {this.createCheckboxes()}
                </List>
              </Group>

              <Input top="Цена" name="price" onChange={this.onChange} value={this.state.price}/>              

              <Textarea top="Комментарий" name="description" onChange={this.onChange} />

              <Button size="xl">Опубликовать</Button>
            </FormLayout>
          </Panel>
        </View>
      );
    }
}
  
export default Add;