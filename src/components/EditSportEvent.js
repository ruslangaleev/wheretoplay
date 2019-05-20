import React from 'react';
import { Panel, PanelHeader, View, Input, Select, FormLayout, Textarea, Button, Group, Cell, List, platform, IOS, HeaderButton} from '@vkontakte/vkui';
import firebase from '../Firebase'; 
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';   
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { levels } from '../data/Levels';
import { times } from '../data/Times';
import { sports } from '../data/Sports';
import { cities } from '../data/Cities';
import { limits } from '../data/Limits';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

const osname = platform();

class EditSportEvent extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        id: props.card.id,
        kindSport: props.card.kindSport,
        city: 'Уфа',
        fullAddress: props.card.fullAddress,
        when: moment(props.card.startDateTime).format('YYYY-MM-DD'),
        whatTime: moment.utc(props.card.startDateTime).format('HH:mm'),
        duration: moment.utc(moment(props.card.endDateTime).diff(moment(props.card.startDateTime))).format("HH:mm"),
        limit: props.card.limit,
        levels: props.card.levels,
        description: props.card.description,
        avatar: props.card.avatar,
        user: props.card.user
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

    onChange = (e) => {
      const state = this.state
      state[e.target.name] = e.target.value;
      this.setState(state);
    }

    onKindSportChange = (e) => {
      this.setState({ kindSport: e.target.value });
    }    

    onSubmit = (e) => {
      e.preventDefault();
  
      const { id, kindSport, city, fullAddress, when, whatTime, duration, limit, description, user, 
        avatar, levels } = this.state;

      if (kindSport === '' || city === '' || fullAddress === '' || when === '' || whatTime === '' || levels.length === 0)
      {
        return;
      }

      let date2 = when + " " + whatTime + ":00";
      let startdate1 = moment.utc(date2).format();

      var momentDuration = moment.duration(duration);
      var date3 = moment.utc(startdate1).add(momentDuration._milliseconds, 'milliseconds').format();

      var updates = {};
      updates["/cards/" + id] = {
        kindSport: kindSport,
        city: city,
        fullAddress: fullAddress,
        startDateTime: startdate1,
        endDateTime: date3,
        limit: limit,
        levels: levels,
        description: description,
        user: user,
        avatar: sports.filter(t => t.name === kindSport)[0].avatars[0]
      };

      firebase
        .database()
        .ref()
        .update(updates);   
        
      this.props.go();
    }    
  
    render() {
      const { kindSport, fullAddress, when, whatTime, duration, limit } = this.state;  
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
                name="kindSport"
                value={kindSport}>
                {sports.map((sport, index) =>
                  <option key={index} value={sport.name}>{sport.name}</option>
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
                value={fullAddress} 
              />

              <Select 
                top="Дата" 
                placeholder="Не выбрано" 
                status={when ? 'valid' : 'error'}
                bottom={when ? '' : 'Пожалуйста, выберите дату'}
                onChange={this.onChange} 
                name="when"
                value={when}>
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
                name="whatTime"
                value={whatTime}>
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
                name="duration"
                value={duration}>
                {times.map((duration, index) =>
                  <option key={index} value={duration}>{duration}</option>
                )}
              </Select>

              <Select 
                top="Лимит игроков" 
                placeholder="Неограничено"              
                onChange={this.onChange} 
                name="limit"
                value={limit}>
                {limits.map((time, index) =>
                  <option key={index} value={time}>{time}</option>
                )}
              </Select>                                           

              <Group 
                title="Уровень" 
                name="levels" 
                onChange={this.onChange} 
                status={this.state.levels.length > 0 ? 'valid' : 'error'}
                bottom={this.state.levels.length > 0 ? '' : 'Необходимо указать как минимум 1 уровень'} >
                <List>
                  {this.createCheckboxes()}
                </List>
              </Group>             

              <Textarea top="Комментарий" name="description" onChange={this.onChange} value={this.state.description} />

              <Button size="xl">Опубликовать</Button>
            </FormLayout>
          </Panel>
        </View>
      );
    }
}
  
export default EditSportEvent;