import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import 'tachyons';
import './App.css';
import ParticlesBg from 'particles-bg'
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';

// const USER_ID = 'clarifai'; 
// const APP_ID = 'main';
// const MODEL_ID = 'face-detection';
// const PAT = import.meta.env.VITE_CLARIFAI_PAT; 

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user:
      {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState({
      isSignedIn: false, 
      imageUrl: '', 
      box: {}, 
      route: 'signin'
    });
  } else if (route === 'home') {
    this.setState({isSignedIn: true, route: 'home'});
  } else {
    this.setState({route: route});
  }
}

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

    fetch('http://localhost:3000/imageUrl',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json()) 
      .then(result => {
        console.log(result)
        if (result) {
          fetch('http://localhost:3000/image',{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(res => res.json())
          .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(err => console.log('Error updating count',err))
          let faceBox;
          if(result && result.outputs && data.outputs[0].data.regions){
            faceBox = this.calculateFaceLocation(result)
          }
          if(faceBox){
            this.displayFaceBox(faceBox);
          }
        }
      })
      .catch(error => console.log('error', error));
  }

  render() {
    const { imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        { route === 'home'?
        <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit} 
        />
        <FaceRecognition 
          box={box} 
          imageUrl={imageUrl} 
        />
        </div>
        :( route === 'signin'?
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
        )
        }
        <ParticlesBg type="cobweb" color="#ffffff" num={200} bg={true} />
      </div>
    );
  }
}

export default App;