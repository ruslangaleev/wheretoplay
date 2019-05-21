import React from 'react';
import connect from '@vkontakte/vkui-connect';
import VKConnect from '@vkontakte/vkui-connect-mock';

import {Epic, TabbarItem, Tabbar, Root} from '@vkontakte/vkui';
import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28User from '@vkontakte/icons/dist/28/user';
import firebase from './../Firebase';

import List from '../components/ItemList';
import Profile from '../components/Profile';

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

class Menu extends React.Component {
    constructor (props) {
      super(props);
  
      this.state = {
        activeStory: 'itemList',
        cards: [],
        fetchedUser: null,
        activePanel: 'itemList',
        activeView: 'main'
      };
      this.onStoryChange = this.onStoryChange.bind(this);
      this.goAdd = this.goAdd.bind(this);
    }
  
	componentDidMount() {

		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
          this.setState({ fetchedUser: e.detail.data });
          // this.user = e.detail.data.id;
					break;
				default:
					console.log(e.detail.type);
			}
		});
    connect.send('VKWebAppGetUserInfo', {});  

    if (this.state.fetchedUser == null)
    {
      VKConnect.subscribe((e) => {
      if (e.detail.type === 'VKWebAppGetUserInfoResult') { 
            this.setState({ fetchedUser: e.detail.data });
            // this.user = e.detail.data.id;
          } 
      }); 
      VKConnect.send('VKWebAppGetUserInfo', {});
    }
    
		// firebase
    const sportEventRef = firebase.database().ref().child('cards');
    console.log("Определение с датой");
    const currentDate = moment.utc().format()//moment.utc().unix(); "2019-05-20T22:00:00Z"
    console.log(currentDate);
		sportEventRef.orderByChild('startDateTime').startAt(currentDate).on('value', snapshot => {
      let cards = snapshot.val();
      let newState = [];
			for (let card in cards) {
				newState.push({
					id: card,
          description: cards[card].description,
          startDateTime: cards[card].startDateTime,
          endDateTime: cards[card].endDateTime,
          price: cards[card].price,
          fullAddress: cards[card].fullAddress,
          limit: cards[card].limit,
          levels: cards[card].levels,
          players: cards[card].players,
          city: cards[card].city,
          kindSport: cards[card].kindSport,
          user: cards[card].user,
          avatar: cards[card].avatar
				});
			}
			this.setState({
				cards: newState
			});
    })
	}

    onStoryChange (e) {
      this.setState({ activeStory: e.currentTarget.dataset.story })
      if (e.currentTarget.dataset.story === "profile")
      {
        this.setState({ activePanel: 'profile'})
      }
    }

    goAdd () { 
      this.setState({ activeView: 'add' }); 
    }

    goMain () {
      this.setState({ activeView: 'main' });
    }
  
    render () {
      console.log(this.state.cards);
      return (
        <Root activeView={this.state.activeView}>
          <Epic id="main" activeStory={this.state.activeStory} tabbar={
            <Tabbar>
              <TabbarItem
                onClick={this.onStoryChange}
                selected={this.state.activeStory === 'itemList'}
                data-story="itemList"
                text="Список игр"
              ><Icon28Newsfeed /></TabbarItem>
              <TabbarItem
                onClick={this.onStoryChange}
                selected={this.state.activeStory === 'profile'}
                data-story="profile"
                text="Профиль"
              ><Icon28User /></TabbarItem>
            </Tabbar>
          }>
            <List id="itemList" cards={this.state.cards} user={this.state.fetchedUser} />
            <Profile id="profile" user={this.state.fetchedUser} />
          </Epic>
        </Root>
      )
    }
  }
  export default Menu;