import React from 'react';
import {PanelHeader, Panel, View} from '@vkontakte/vkui';

export default class Detail extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <View id="detail" activePanel="detail">
                <Panel id="detail">
                    <PanelHeader>
                        Persik Test
                    </PanelHeader>
                </Panel>
            </View>
        )
    };
}