import React from 'react';
import { View, Panel, PanelHeader, Group, Root } from '@vkontakte/vkui';
import firebase from './../Firebase';
import Edit from './Edit';
import Item from './Item';

export default class Profile extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
          publishCards: [],
          subscribeCards: [],
          currentCard: null,
          activeView: props.id
      }
    }

    componentDidMount() {
		const ref = firebase.database().ref().child('cards');
        ref.orderByChild('user/id').equalTo(this.props.user.id).on("value", snapshot => {
            let cards = snapshot.val();
            let publishCards = [];
                for (let card in cards) {
                    publishCards.push({
                        id: card,
                        title: cards[card].title,
                        description: cards[card].description,
                        startDateTime: cards[card].startDateTime,
                        endDateTime: cards[card].endDateTime,
                        price: cards[card].price,
                        fullAddress: cards[card].fullAddress,
                        levels: cards[card].levels,
                        limit: cards[card].limit,
                        players: cards[card].players,
                        user: cards[card].user,
                        avatar: cards[card].avatar
                      });
                  }
            this.setState({
                publishCards: publishCards
            });            
        });

        //ref.orderBy('players').orderByChild('id').equalTo(9999999999).on("value", snapshot => {
        ref.on("value", snapshot => {
            console.log('profile-players');
            console.log(snapshot.val());

            let cards = snapshot.val();
            let subscribeCards = [];
                for (let card in cards) {
                    console.log(cards[card]);
                    for (let player in cards[card].players) {
                        if (cards[card].players[player].id == this.props.user.id) {
                            subscribeCards.push({
                                id: card,
                                title: cards[card].title,
                                description: cards[card].description,
                                startDateTime: cards[card].startDateTime,
                                endDateTime: cards[card].endDateTime,
                                price: cards[card].price,
                                fullAddress: cards[card].fullAddress,
                                levels: cards[card].levels,
                                limit: cards[card].limit,
                                players: cards[card].players,
                                user: cards[card].user,
                                avatar: cards[card].avatar
                            });
                        }
                    }
                  }
            this.setState({
                subscribeCards: subscribeCards
            });            
        });        
    }

    render() {
        return (
            <Root activeView={this.state.activeView}>
                <View id="profile" activePanel="profile">
                    <Panel id="profile">
                        <PanelHeader>
                            Профиль
                        </PanelHeader>                  
                        <Group title="Мои опубликованные">
                            {this.state.publishCards.map((card, index) =>
                                <Item item={card} go={() => this.setState({ activeView: "detail", currentCard: card })} goBack={() => this.setState({ activeView: "itemList" })} />
                            )}
                        </Group>
                        <Group title="Мои подписанные">
                            {this.state.subscribeCards.map((card, index) =>
                                <Item item={card} go={() => this.setState({ activeView: "detail", currentCard: card })} goBack={() => this.setState({ activeView: "itemList" })} />
                            )}
                        </Group>                        
                    </Panel>
                </View>
                <Edit id="edit" card={this.state.currentCard} go={() => this.setState({ activeView: "profile" })} />                
            </Root>
        );
    }
}