/* @flow weak */

import React, { PureComponent } from 'react';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

export default class RenderMarkers extends PureComponent {
  render() {
    const { markers, icon, color } = this.props;

    console.log('aqui');

    return (
      <>
        {markers.map(({ latitude, longitude, id }) => (
          <Marker
            key={String(id)}
            coordinate={{ latitude, longitude }}
            tracksViewChanges={false}
          >
            <Icon name={icon} size={32} color={color} />
          </Marker>
        ))}
      </>
    );
  }
}
