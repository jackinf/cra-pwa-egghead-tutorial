import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import backLogo from './back.png';
import AppNavbar from './AppNavbar';

const ITEMS_URL = 'https://192.168.178.21:4568/items.json';

class Profile extends Component {

  state = {
    image: null,
    supportsCamera: 'mediaDevices' in navigator
  };

  changeImage = (e) => {
    this.setState({
      image: URL.createObjectURL(e.target.files[0])
    });
  };

  startChangeImage = () => {
    this.setState({ enableCamera: !this.state.enableCamera });
  };

  takeImage = () => {
    this._canvas.width = this._video.videoWidth;
    this._canvas.height = this._video.videoHeight;

    this._canvas.getContext('2d').drawImage(this._video, 0, 0, this._video.videoWidth, this._video.videoHeight);
    this._video.srcObject.getVideoTracks().forEach(track => { track.stop(); });

    this.setState({
      image: this._canvas.toDataURL(),
      enableCamera: false
    })
  };


  render() {
    return (
      <div>
        <AppNavbar offline={false} title="This is a profile page" logo={backLogo} />

        <div style={{ textAlign: 'center' }}>
          {this.state.image && <img src={this.state.image} alt="profile" style={{ height: 200, marginTop: 50 }} /> }
          <p style={{ color: '#888', fontSize: 20 }}>username</p>
          <br/>

          {
            this.state.enableCamera &&
            <div>
              <video
                ref={c => {
                  this._video = c;
                  if (this._video) {
                    navigator.mediaDevices.getUserMedia({ video: true })
                      .then(stream => this._video.srcObject = stream)
                  }
                }}
                controls={false} autoPlay
                style={{ width: '100%', maxWidth: 300 }}
              />
              <br/>
              <button onClick={this.takeImage}>Take Image</button>

              <canvas ref={c => this._canvas = c} style={{ display: 'none'}} />
            </div>
          }

          <br/>
          {
            this.state.supportsCamera &&
            <button onClick={this.startChangeImage}>Toggle camera</button>
          }

          {/*<input type="file" accept="image/*" onChange={this.changeImage} capture="user" />*/}
        </div>
      </div>
    )

  }
}

class List extends Component {

  state = {
    items: [],
    loading: true,
    todoItem: '',
    offline: !navigator.onLine
  };

  async componentDidMount() {
    const response = await fetch(ITEMS_URL);
    const items = await response.json();
    this.setState({ items, loading: false });

    window.addEventListener('online', this.setOffineStatus);
    window.addEventListener('offline', this.setOffineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.setOffineStatus);
    window.removeEventListener('offline', this.setOffineStatus);
  }

  setOffineStatus = () => {
    this.setState({ offline: !navigator.onLine });
  };

  addItem = async (e) => {
    e.preventDefault();

    const response = await fetch(ITEMS_URL, {
      method: 'POST',
      body: JSON.stringify(({ item: this.state.todoItem })),
      headers: { 'Content-Type': 'application/json' }
    });
    const items = await response.json();
    if (items.error) {
      alert(items.error);
      return;
    }
    this.setState({ items, todoItem: '' });
  };

  deleteItem = async (itemId) => {
    const response = await fetch(ITEMS_URL, {
      method: 'DELETE',
      body: JSON.stringify({ id: itemId }),
      headers: { 'Content-Type': 'application/json' }
    });
    const items = await response.json();
    if (items.error) {
      alert(items.error);
      return;
    }
    this.setState({ items });
  };

  render() {
    return (
      <div className="App">
        <AppNavbar offline={this.state.offline} title="My Todo List" logo={logo} />

        <div className="px-3 py-2">
          <form onSubmit={this.addItem} className="form-inline my-3">
            <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
              <input
                className="form-control col-12"
                placeholder="What do you need to do?"
                value={this.state.todoItem}
                onChange={e => this.setState({ todoItem: e.target.value })}
              />
              <button type="submit" className="btn btn-primary mb-2 col-4 col-sm-2">
                Add
              </button>
            </div>
          </form>

          { this.state.loading && <p>Loading...</p> }

          {
            !this.state.loading && this.state.items.length === 0 &&
            <div className="alert alert-secondary">No items - all done!</div>
          }

          {
            !this.state.loading && this.state.items &&
              <table className="table table-striped">
                <tbody>
                {
                  this.state.items.map((item, i) => {
                    return (
                      <tr key={item.id} className="row">
                        <td className="col-1">{i+1}</td>
                        <td className="col-10">{item.item}</td>
                        <td className="col-1">
                          <button
                            type="button"
                            className="close"
                            aria-label="Close"
                            onClick={() => this.deleteItem(item.id)}
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </table>
          }

        </div>
      </div>
    );
  }
}

export default () =>
  <Router>
    <div>
      <Route path="/" exact component={List} />
      <Route path="/profile" exact={true} component={Profile} />
    </div>
  </Router>
// export default App;
