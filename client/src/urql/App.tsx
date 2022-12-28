import { Provider } from "urql";
import { BrowserRouter } from "react-router-dom";

import { client } from "./lib/graphql";
import { Users } from "./Users";

export const UrqlApp = () => {
  return (
    <Provider value={client}>
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    </Provider>
  );
};
