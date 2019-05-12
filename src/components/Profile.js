import React from 'react';
import {View, Panel, PanelHeader, HeaderButton, platform, IOS, Group, Root, CellButton,
        List, Cell, Input, InfoRow} from '@vkontakte/vkui';
import firebase from './../Firebase';
import Card from './Detail';
import Edit from './Edit';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';   
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osname = platform();

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
        ref.orderByChild("userId").equalTo(this.user).on("value", snapshot => {
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