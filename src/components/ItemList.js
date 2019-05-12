import React from 'react';
import {View, Panel, PanelHeader, HeaderButton, platform, IOS, Group, Root, CellButton,
    List, Cell, Input, InfoRow} from '@vkontakte/vkui';
import Icon24Add from '@vkontakte/icons/dist/24/add';    

import Item from './Item';
import Add from './AddSportEvent';
import Detail from './Detail';
import Edit from './Edit';

export default class ItemList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: props.id,
            currentCard: null
        }      
    }

    render() {
        return (
            <Root activeView={this.state.activeView}>
                <View id="itemList" activePanel="itemList">
                    <Panel id="itemList">
                        <PanelHeader
                            left={<HeaderButton onClick={() => this.setState({ activeView: "add" })}>{<Icon24Add />}</HeaderButton>}
                        >
                            Мероприятия
                        </PanelHeader>

                        {this.props.cards.map((card) => 
                            <Item item={card} go={() => this.setState({ activeView: "detail", currentCard: card })} goBack={() => this.setState({ activeView: "itemList" })} />
                        )}
                    </Panel>
                </View>
                <Add id="add" user={this.props.user} go={() => this.setState({ activeView: "itemList" })} />
                <Detail id="detail" user={this.props.user} card={this.state.currentCard} go={() => this.setState({ activeView: "edit" })} goBack={() => this.setState({ activeView: 'itemList' })} />
                <Edit id="edit" goBack={() => this.setState({ activeView: "detail" })} />
            </Root>
        );
    }    
}