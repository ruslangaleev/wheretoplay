import React from 'react';
import { View, Panel, PanelHeader, Group, Root, CellButton } from '@vkontakte/vkui';
import firebase from './../Firebase';
import Edit from './Edit';

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
        this.user = 14624192;
		const ref = firebase.database().ref().child('cards');
        ref.orderByChild("user").equalTo(this.user).on("value", snapshot => {
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
                        userId: cards[card].userId
                      });
                  }
            this.setState({
                publishCards: publishCards
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
                                <CellButton key={index} onClick={() => this.setState({ activeView: 'edit', currentCard: card })}>
                                    {card.title}
                                </CellButton>
                            )}
                        </Group>
                    </Panel>
                </View>
                <Edit id="edit" card={this.state.currentCard} go={() => this.setState({ activeView: "profile" })} />                
            </Root>
        );
    }
}