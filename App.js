/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import RenderMarkers from './RenderMarkers';

function requestCameraPermission() {
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'App needs GPS Permission',
      message: 'App needs access to your fine location ',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }
  )
    .then(granted => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('permission denied');
      }
    })
    .catch(err => {
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
    locations: [],
  };

  componentDidMount() {
    requestCameraPermission();
    console.log('aqui');

    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        console.log(typeof latitude);
        this.setState({
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134,
          },
        });
      },
      error => {
        // See error code charts below.-15.870315, -48.030366
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    // Geolocation.watchPosition(
    //   position => {
    //     console.log('what', position);
    //     // const { latitude, longitude } = position.coords;
    //     // console.log(typeof(latitude));
    //     // this.setState({
    //     //   region: { latitude, longitude, latitudeDelta: 0.0143, longitudeDelta: 0.0134 }
    //     // })
    //   },
    //   error => {
    //     console.log(error.code, error.message);
    //   },
    //   { enableHighAccuracy: true, distanceFilter: 5 }
    // );

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 60000,
      fastestInterval: 5000,
      // fastestInterval: 120000,
      activitiesInterval: 10000,
      // stopOnStillActivity: false,
    });

    BackgroundGeolocation.on('location', location => {
      console.log('on location', location);
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      // BackgroundGeolocation.startTask(taskKey => {
      //   // execute long running task
      //   // eg. ajax post location
      //   // IMPORTANT: task has to be ended by endTask
      //   BackgroundGeolocation.endTask(taskKey);
      // });
    });

    BackgroundGeolocation.on('error', error => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  toglleNavigation = () => {
    BackgroundGeolocation.checkStatus(
      ({ isRunning, locationServicesEnabled, authorization }) => {
        if (isRunning) {
          BackgroundGeolocation.stop();

          BackgroundGeolocation.getLocations(locations => {
            console.log(locations);
            this.setState({ locations });
          });
        } else {
          BackgroundGeolocation.deleteAllLocations();

          BackgroundGeolocation.start();
        }
      }
    );
  };

  addMarker = props => {
    const id = Date.now();
    console.log('aaaa');
    const coordinate = props.nativeEvent.coordinate;
    console.log(coordinate);

    this.setState(prevState => ({
      markers: [...prevState.markers, { id, ...coordinate }],
    }));
  };

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
          <RenderMarkers markers={markers} icon="ios-business" color="#088" />
          <RenderMarkers
            markers={this.state.markers}
            icon="ios-pin"
            color="#880"
          />
          <RenderMarkers
            markers={this.state.locations}
            icon="ios-navigate"
            color="#808"
          />
        </MapView>

        <View style={{ position: 'absolute', bottom: 30, right: 30 }}>
          <Button title="toglle" onPress={this.toglleNavigation} />
        </View>
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
