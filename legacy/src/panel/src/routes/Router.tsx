import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import User from '../pages/User';
import Users from '../pages/Users';
import Groups from '../pages/Groups';
import Group from '../pages/Group';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/groups" exact>
          <Groups />
        </Route>
        <Route path="/group/:id" exact>
          <Group />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/user/:id" exact>
          <User />
        </Route>
        <Redirect to="/users" />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
