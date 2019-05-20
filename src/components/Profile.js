import React from 'react';
import { View, Panel, PanelHeader, Group, Root } from '@vkontakte/vkui';
import firebase from './../Firebase';
import Item from './Item';

import EditSportEvent from './EditSportEvent';
import SportEventDetail from './SportEventDetail';

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
                        kindSport: cards[card].kindSport,
                        city: cards[card].city,
                        fullAddress: cards[card].fullAddress,
                        startDateTime: cards[card].startDateTime,
                        endDateTime: cards[card].endDateTime,
                        limit: cards[card].limit,
                        description: cards[card].description,
                        price: cards[card].price,
                        levels: cards[card].levels,
                        players: cards[card].players,
                        user: cards[card].user,
                        avatar: cards[card].avatar
                      });
                  }
            this.setState({
                publishCards: publishCards
            });            
        });

        ref.on("value", snapshot => {
            let cards = snapshot.val();
            let subscribeCards = [];
                for (let card in cards) {
                    console.log(cards[card]);
                    for (let player in cards[card].players) {
                        if (cards[card].players[player].id == this.props.user.id) {
                            subscribeCards.push({
                                id: card,
                                kindSport: cards[card].kindSport,
                                city: cards[card].city,
                                fullAddress: cards[card].fullAddress,
                                startDateTime: cards[card].startDateTime,
                                endDateTime: cards[card].endDateTime,
                                limit: cards[card].limit,
                                description: cards[card].description,
                                price: cards[card].price,
                                levels: cards[card].levels,
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
                                <Item item={card} go={() => this.setState({ activeView: "edit", currentCard: card })} goBack={() => this.setState({ activeView: "itemList" })} />
                            )}
                        </Group>
                        <Group title="Мои подписанные">
                            {this.state.subscribeCards.map((card, index) =>
                                <Item item={card} go={() => this.setState({ activeView: "detail", currentCard: card })} goBack={() => this.setState({ activeView: "itemList" })} />
                            )}
                        </Group>                        
                    </Panel>
                </View>
                <EditSportEvent id="edit" card={this.state.currentCard} go={() => this.setState({ activeView: "profile" })} />                
                <SportEventDetail id="detail" card={this.state.currentCard} goBack={() => this.setState({ activeView: "profile" })} user={this.props.user} />
            </Root>
        );
    }
}