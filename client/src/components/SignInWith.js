import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';
import {
  SignInUser,
  toggleClose,
  toggleOpen,
} from '../redux/actions/actions';

class SignInWith extends Component {
  render() {
    const responseGoogle = (res) => {
      console.log({ res });
      const postData = {
        name: res.profileObj.name,
        provider: 'google',
        email: res.profileObj.email,
        provider_id: res.googleId,
        token: res.accessToken,
        provider_pic: res.profileObj.imageUrl,
      };
      console.log(postData);
      // build our user data
      this.props.SignInUser(postData);
      this.props.toggleClose();
    };
    const responseGoogleFailure = (res) => {
      console.log(res)
    };



    return (
      <div>
        <div data-behavior="overlay" className={this.props.modalMode === true ? 'overlay overlay-hugeinc open' : 'overlay overlay-hugeinc'}>
          <button onClick={this.props.toggleClose} data-behavior="close-overlay" type="button" className="overlay-close"><span className="glyphicon glyphicon-remove" /></button>
          <nav>
            <h2 className="grayed-heading center">Sign In</h2>
            <ul className="omniauth-button-group">

              <li className="omniauth-button google">
                <GoogleLogin
                  className="button google"
                  clientId="643362236301-4agj5cdu68gk0dj8d31mubhq4ev7peqp.apps.googleusercontent.com"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogleFailure}
                >
                  <i className="fa fa-google" />
                  <span> SignIn with Google</span>
                </GoogleLogin>
              </li>

            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  modalMode: state.common.modalMode,
});

export default connect(mapStateToProps, {
  toggleClose,
  toggleOpen,
  SignInUser,
})(SignInWith);
