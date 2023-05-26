import "./App.css";
import { AppWrapper } from "./styled/AppWrapper";
import { Provider } from "react-redux";
import store from "./store/index";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { IntroOrMain } from "./introOrmain/introOrMain";

export let persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppWrapper>
          <IntroOrMain></IntroOrMain>
        </AppWrapper>
      </PersistGate>
    </Provider>
  );
}

export default App;
