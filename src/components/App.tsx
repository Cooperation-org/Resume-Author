import '../styles/App.css';
import Resume from './Resume';
import { Provider } from 'react-redux';
import store from '../redux/store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Resume />
      </div>
    </Provider>
  );
}

export default App;
