import React, {Component} from 'react';
import { Provider } from 'react-redux';
import store from './lib/Store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import WordDragController from './modules/WordDragController';

class App extends Component {
  componentWillMount() {
    store.dispatch({
      type: "UPDATE_BASE_URL",
      payload: this.props.baseUrl
    })
  }

  render() {
    return (
      <Provider store={store}>
        <ToastContainer
          className="ewp-toast-container"
          position={toast.POSITION.TOP_CENTER}
        />
        <div className="App">
          <WordDragController />
        </div>
      </Provider>
    );
  }
}

export default App;
