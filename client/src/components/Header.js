import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      authorized: false,
      loading: true
    }
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          authorized: false,
          loading: false
        })
      } else {
        this.setState({
          authorized: true,
          loading: false
        })
      }
    })
  }

  render() {
    return (
      <div>
        <div data-react-className="UserOverlay" data-react-props="{}">
          <div className="overlay overlay-hugeinc " data-reactroot="">
            <button className="overlay-close"><span className="glyphicon glyphicon-remove" /></button>
            <nav className="users-overlay">
              <h2 className="grayed-heading center" />
              <ul>
                <li className="pagination-button-group" />
              </ul>
            </nav>
          </div>
        </div>

        <div data-behavior="progress-bar" className="progress-bar" />

        <nav data-behavior="animated-navbar" className="navbar navbar-default navbar-fixed-top is-inView">
          <div className="container-fluid col-md-10 col-md-offset-1">
            <div className="navbar-header">
              <a className="navbar-brand" id="logo" href="/">
                <img alt="Stories" src="/assets/img/stories-logo.svg" height="40" />
              </a>
            </div>
            <ul className="nav navbar-nav filter-links">
              <li><a className="" href="/">Top stories</a></li>
            </ul>

            <div className="folding-nav">
              <ul className="nav navbar-nav navbar-right">
                    {this.state.authorized ? <li className="new-post-button"><a className="button" data-behavior="trigger-overlay" href="/editor">Write a story</a></li> : ''}
                      {this.state.authorized ? <li  className="sign-in-button"><a className="button green-border-button" data-behavior="trigger-overlay" href="/logout">Logout</a></li>: <li className="sign-in-button"><a className="button green-border-button" data-behavior="trigger-overlay" href="/signin">Sign in / Sign up</a></li>}
              
              </ul>
            </div>

          </div>
        </nav>
      </div>
    );
  }
}

/*
const mapStateToProps = (state) => ({
  user: state.authUser.user,
  isAuth: state.authUser.isAuth,
});
const mapDispatchToProps = (dispatch) => ({
  openSignInWith: () => { dispatch({ type: 'TOGGLE_MODAL', modalMode: true }); },
  logout: () => { dispatch({ type: 'SET_USER', user: null }) }
});
connect(mapStateToProps, mapDispatchToProps);
*/
export default Header;
