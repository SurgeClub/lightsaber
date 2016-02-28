import React, { View, Text, SliderIOS, StyleSheet, Dimensions, Component, PropTypes } from 'react-native';
import moment from 'moment';

export default class TimeSlider extends Component {
  static propTypes = {
    selectedDate: PropTypes.object,
    onChange: PropTypes.func
  }

  constructor() {
    super(...arguments);

    const selectedTime = parseInt(this.props.selectedDate.format('HHmm'), 10);

    this.state = {
      selectedTime: parseInt(
        selectedTime.toString().slice(0, 2) + parseInt(selectedTime.toString().slice(2), 10) * 100 / 60, 10
      )
    };
  }

  render() {
    const { selectedDate, onChange } = this.props;
    const { selectedTime } = this.state;

    const slicedMinute = selectedTime.toString().slice(2);
    const roundedMinute = Math.floor(slicedMinute / 100 * 60).toString();
    const selectedMinute = roundedMinute.length > 1 ? roundedMinute : `0${roundedMinute}`;
    const momentTime = moment(`${selectedDate.format('YYYYMMDD')}T${selectedTime.toString().slice(0, 2)}${selectedMinute}`);
    const selectedDateStartOfDay = selectedDate.clone().startOf('day');
    const isToday = selectedDateStartOfDay.isSame(moment().startOf('day'));
    const minValue = isToday ? parseInt(moment().format('HHmm'), 10) : parseInt(selectedDateStartOfDay.format('HHmm'), 10);
    console.log(minValue, parseInt(selectedDate.clone().endOf('day').format('HHmm'), 10));
    return (
      <View style={styles.sliderContainer}>
        <SliderIOS
          style={styles.slider}
          step={1}
          value={selectedTime}
          minimumValue={minValue}
          maximumValue={parseInt(selectedDate.clone().endOf('day').format('HHmm'), 10)}
          onValueChange={(value) => this.setState({selectedTime: value})}
          onSlidingComplete={() => onChange(momentTime)} />
        <Text style={styles.text}>{momentTime.format('h:mmA')}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sliderContainer: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(255, 255, 255, 0.75)'
  },
  slider: {
    width: Dimensions.get('window').width
  },
  text: {
    textAlign: 'center'
  }
});
