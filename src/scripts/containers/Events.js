import React, { Component, View, Text, StyleSheet } from 'react-native';
import Button from 'react-native-button'
import {Actions} from 'react-native-router-flux'
import MapView from 'react-native-maps';
import { connect } from 'react-redux/native';
import moment from 'moment';

import TimeSlider from '../../components/TimeSlider';

import firebase from '../utils/firebase';
import { parseDate, formatDate, sortByDate } from '../utils/numberedDate';
import { addChild } from '../reducers/events';

class Events extends Component {
  watchID = (null: ?number)

  state = {
    initialPosition: null,
    lastPosition: 'unknown',
    selectedDate: moment()
  }

  componentDidMount() {
    this.getEvents();

    navigator.geolocation.getCurrentPosition(
      (initialPosition) => {
        this.setState({initialPosition});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({lastPosition});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  getEvents() {
    const { dispatch } = this.props;
    const { selectedDate } = this.state;

    firebase
      .child('events')
      .orderByChild('startTime')
      .startAt(parseDate(selectedDate))
      .endAt(parseDate(selectedDate.clone().add(1, 'days')))
      .on('child_added', (snapshot) => dispatch(addChild(snapshot.val())));
  }

  eventsArray() {
    const { events } = this.props;
    const { selectedDate } = this.state;

    if (!events) {
      return [];
    }

    const filteredEvents = Object.keys(events).reduce((array, eventId) => {
      const event = events[eventId];

      if (event.startTime < parseDate(selectedDate) || event.startTime > parseDate(selectedDate.clone().add(1, 'days'))) {
        // The user clicked around and now we have events that should not be on the screen
        return array;
      }

      return array.concat(event);
    }, []);

    return sortByDate(filteredEvents, 'asc');
  }

  renderSlider() {
    const { selectedDate } = this.state;

    return (
      <TimeSlider
        style={styles.slider}
        selectedDate={selectedDate}
        onChange={(momentTime) => this.setState({selectedDate: momentTime})} />
    );
  }

  renderMap() {
    const { initialPosition } = this.state;
    const { events } = this.props;

    if (!initialPosition) {
      return false;
    }

    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: initialPosition.coords.latitude,
          longitude: initialPosition.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0821
        }}>
        {this.eventsArray().map(event => {
          return (
            <MapView.Marker
              key={eventId}
              coordinate={{latitude: event.latitude, longitude: event.longitude}}
              title={`${event.category}: ${formatDate((event.startTime)).format('ddd hh:mmA')}`}>
              <View style={{height: 20, borderRadius: 50, width: 20, backgroundColor: '#e74c3c'}} />
            </MapView.Marker>
          );
        })}
      </MapView>
    );
  }

  render() {
    return (
      <View/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default connect(
  state => ({events: state.events})
)(Events);
