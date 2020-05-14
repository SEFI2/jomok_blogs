import React, { Component } from 'react';
import Header from './components/Header';
import { Switch, Route } from 'react-router-dom'

import Feed from './components/Feed'
import Profile from './components/Profile'
import ArticleView from './components/ArticleView'
import Editor from './components/Editor'
import requireAuthentication from './utils/requireAuth'
import SignInWith from './components/SignInWith'
import SignIn from './components/SignIn'
import WithAuth from './components/WithAuth'
import Logout from './components/Logout'


//import  from './components'

class App extends Component {
    render() {
        const pathname = window.location.pathname
        return ( 
            <div>
            { !pathname.includes('editor') ? <Header /> : '' }
            <SignInWith />
                <Switch>
                    <Route exact path="/" component={Feed} />
                    <Route path="/signin" component={SignIn} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/profile/:id" component={Profile} />
                    <Route path="/articleview/:id" component={ArticleView} />
                    <Route path="/editor" component={requireAuthentication(Editor)} />
                    <Route path="**" component={Feed} />
                </Switch>
            </div>
        );
    }
}

export default App;
