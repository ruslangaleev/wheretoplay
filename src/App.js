import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';
import List from './panels/List';
import firebase from './Firebase';
import Menu from './panels/Menu';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'home',
			fetchedUser: null,
			cards: []
		};		
	}

	componentDidMount() {
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					this.setState({ fetchedUser: e.detail.data });
					break;
				default:
					console.log(e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});

		// firebase
		const sportEventRef = firebase.database().ref().child('cards');
		
		sportEventRef.on('value', snapshot => {
			let cards = snapshot.val();
			console.log(cards);
			let newState = [];
			for (let card in cards) {
				newState.push({
					id: card,
					title: cards[card].title,
					description: cards[card].description
				});
			}
			this.setState({
				cards: newState
			});
		})
	}

	go = (e) => {
		this.setState({ activePanel: e.currentTarget.dataset.to })
	};

	render() {
		console.log(this.state.cards)
		return (
			<View activePanel={this.state.activePanel}>
				<Home id="home" fetchedUser={this.state.fetchedUser} go={this.go} />
				<Persik id="persik" go={this.go} />
				<List id="list" cards={this.state.cards} go={this.go} />
				<Menu id="menu" go={this.go} user={this.state.fetchedUser} />
			</View>
		);
	}
}

export default App;
