/* @flow weak */

import React, { PureComponent } from 'react';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

export default class RenderMarkers extends PureComponent {
  render() {
    const { markers } = this.props;

    console.log('aqui');

    return (
      <>
        {markers.map(({ latitude, longitude, id }) => (
          <Marker
            key={String(id)}
            coordinate={{ latitude, longitude }}
            tracksViewChanges={false}
          >
            <Icon name="ios-business" size={32} color="#088" />
          </Marker>
        ))}
      </>
    );
  }
}
