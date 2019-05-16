import React from 'react';
import {View, Panel, PanelHeader, HeaderButton, platform, IOS, Group, Root, CellButton,
        List, Cell, Input, InfoRow} from '@vkontakte/vkui';
import firebase from './../Firebase';
import Card from './Detail';
import Edit from './Edit';
import Item from './Item';

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
          activeView: props.id,
          //user: props.user
      }
    }

    componentDidMount() {
		const ref = firebase.database().ref().child('cards');
        ref.orderByChild('user/id').equalTo(this.props.user.id).on("value", snapshot => {
            // console.log("cards - user");
            // console.log(snapshot);
            // console.log(snapshot.val());
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
                        user: cards[card].user
                      });
                  }
            this.setState({
                publishCards: publishCards
            });            
        });
    }

    render() {
        console.log(this.state.publishCards);
        return (
            <Root activeView={this.state.activeView}>
                <View id="profile" activePanel="profile">
                    <Panel id="profile">
                        <PanelHeader>
                            Профиль
                        </PanelHeader>                  
                        <Group title="Мои опубликованные">
                            {this.state.publishCards.map((card, index) =>
                                // <CellButton key={index} onClick={() => this.setState({ activeView: 'edit', currentCard: card })}>
                                //     {card.title}
                                // </CellButton>
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