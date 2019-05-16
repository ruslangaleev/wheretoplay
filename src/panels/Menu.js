import React from 'react';
import connect from '@vkontakte/vkui-connect';
import VKConnect from '@vkontakte/vkui-connect-mock';

import {Panel, PanelHeader, View, Epic, TabbarItem, Tabbar, Root, HeaderButton} from '@vkontakte/vkui';
import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28Messages from '@vkontakte/icons/dist/28/messages';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28More from '@vkontakte/icons/dist/28/more';
import Icon28Search from '@vkontakte/icons/dist/28/search';
import Icon28User from '@vkontakte/icons/dist/28/user';
import firebase from './../Firebase';
import Icon24Add from '@vkontakte/icons/dist/24/add';

import List from '../components/ItemList';
import Profile from '../components/Profile';
import Detail from './Detail';

class Menu extends React.Component {
    constructor (props) {
      super(props);
  
      this.state = {
        activeStory: 'itemList',
        cards: [],
        myCards: [],
        fetchedUser: null,
        activePanel: 'itemList',
        activeView: 'main'
      };
      this.onStoryChange = this.onStoryChange.bind(this);
      this.goAdd = this.goAdd.bind(this);
    }
  
	componentDidMount() {

    VKConnect.subscribe((e) => {
    if (e.detail.type === 'VKWebAppGetUserInfoResult') { 
          this.setState({ fetchedUser: e.detail.data });
          this.user = e.detail.data.id;
        } 
    }); 
      
    VKConnect.send('VKWebAppGetUserInfo', {});

		// connect.subscribe((e) => {
		// 	switch (e.detail.type) {
		// 		case 'VKWebAppGetUserInfoResult':
    //       this.setState({ fetchedUser: e.detail.data });
    //       this.user = e.detail.data.id;
		// 			break;
		// 		default:
		// 			console.log(e.detail.type);
		// 	}
		// });
    // connect.send('VKWebAppGetUserInfo', {});    
    
		// firebase
		const sportEventRef = firebase.database().ref().child('cards');
    
		sportEventRef.on('value', snapshot => {
      let cards = snapshot.val();
      let newState = [];
			for (let card in cards) {
				newState.push({
					id: card,
					title: cards[card].title,
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
    
    sportEventRef.orderByChild("userId").equalTo(this.user).on("value", snapshot => {
      let cards = snapshot.val();
      let newState = [];
			for (let card in cards) {
				newState.push({
					id: card,
					title: cards[card].title,
          description: cards[card].description,
          startDateTime: cards[card].startDateTime,
          endDateTime: cards[card].endDateTime,
          price: cards[card].price,
          fullAddress: cards[card].fullAddress,
          city: cards[card].city,
          kindSport: cards[card].kindSport
				});
			}
			this.setState({
				myCards: newState
			});
    });
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