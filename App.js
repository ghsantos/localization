/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, PermissionsAndroid, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';

import RenderMarkers from './RenderMarkers'

function requestCameraPermission() {
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Cool Photo App Camera Permission',
      message:
        'Cool Photo App needs access to your camera ' +
        'so you can take awesome pictures.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  ).then(granted => {
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
    } else {
      console.log('Camera permission denied');
    }
  }).catch(err => {
    console.warn(err);
  });
}

const markers = [
  { latitude: -15.869388, longitude: -48.030088, id: '1' },
  { latitude: -15.868470, longitude: -48.030705, id: '2' },
  { latitude: -15.869038, longitude: -48.028634, id: '3' },
  { latitude: -15.867459, longitude: -48.031263, id: '4' },
  { latitude: -15.867980, longitude: -48.030448, id: '5' },
  { latitude: -15.867521, longitude: -48.029654, id: '6' },
];

export default class App extends Component {
  state = {
    region: null,
    markers: [],
  }

  componentDidMount() {
    requestCameraPermission();
    console.log('aqui');

    Geolocation.getCurrentPosition(
        (position) => {
            console.log(position);
            const { latitude, longitude } = position.coords;
            console.log(typeof(latitude));
            // this.setState(prevState =>
            //   ({ region: { ...prevState.region, latitude, longitude } }),
            //   () => console.log('setState'),
            // );
            this.setState({
              region: { latitude, longitude, latitudeDelta: 0.0143, longitudeDelta: 0.0134 }
            })
        },
        (error) => {
            // See error code charts below.-15.870315, -48.030366
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  addMarker = (props) => {
    const id = Date.now();
    console.log('aaaa');
    const coordinate = props.nativeEvent.coordinate;
    console.log(coordinate);

    this.setState(prevState =>
      ({ markers: [...prevState.markers, { id, ...coordinate }] })
    );
  }

  render() {
    console.log('render');

    return (
      <View style={styles.container}>
        <MapView
          initialRegion={this.state.region}
          // onRegionChange={region => this.setState(region)}
          showsUserLocation
          loadingEnabled
          style={{ flex: 1 }}
          onPress={this.addMarker}
        >
          <Marker
            coordinate={{
              latitude: -15.868109,
              longitude: -48.025825,
            }}
            >
              <Icon name='ios-bicycle' size={32} color='#880' />
            </Marker>

          <Marker
            coordinate={{
              latitude: -15.869094,
              longitude: -48.027797,
            }}
          >
            <Icon name='ios-bicycle' size={32} color='#808' />
          </Marker>

          <Marker
            coordinate={{
              latitude: -15.868568,
              longitude: -48.026762,
            }}
          >
            <Icon name='ios-bicycle' size={32} color='#088' />
          </Marker>

          <Marker
            coordinate={{
              latitude: -15.868578,
              longitude: -48.026772,
            }}
          >
            <Icon name='ios-bicycle' size={32} color='#088' />
          </Marker>

          <RenderMarkers markers={markers} />
          <RenderMarkers markers={this.state.markers} />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
