import React, { Component, PropTypes, Navigator, Text } from 'react-native';
import { Provider, connect } from 'react-redux/native';
import {Router as RouterLib, Route, Schema, Animations, TabBar} from 'react-native-router-flux'

import TabView from '../../components/TabView';
import configureStore from '../configStore';

import Today from './Today';

const Router = connect()(RouterLib);

class TabIcon extends Component {
  render(){
    return (
      <Text style={{color: this.props.selected ? 'red' :'black'}}>{this.props.title}</Text>
    );
  }
}

export default class App extends Component{
  render(){
    return (
      <Provider store={ configureStore() }>
        {() => (
          <Router hideNavBar={true} name="root">
            <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
            <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
            <Schema name="withoutAnimation"/>
            <Schema name="tab" type="switch" icon={TabIcon} />

            <Route name="today" component={Today} wrapRouter={true} title="Today"/>
            <Route name="tabbar" initial={true}>
              <Router showNavigationBar={false}>
                <Route name="Today" schema="tab" title="Today" initial={true}>
                  <Router onPop={()=>{console.log("onPop is called!"); return true} }>
                    <Route name="today" component={Today} initial={true} wrapRouter={true}/>
                    <Route name="tab1_2" component={TabView} title="Tab #1_2" />
                  </Router>
                </Route>
              </Router>
            </Route>
          </Router>
        )}
      </Provider>
    );
  }
}
