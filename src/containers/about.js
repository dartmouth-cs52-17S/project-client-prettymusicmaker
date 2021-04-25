import React, { Component } from 'react';
import { connect } from 'react-redux';

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /* eslint max-len: ["error", 400] */
  render() {
    return (
      <div className="aboutContainer">
        <div className="aboutHeader">
          <p id="about_para">Pretty Music Maker aims to make producing music accessible, intuitive, and fun. It is easy for anyone - from children to amateur musicians to professional DJs - to save and share creations. The editor even allows collaboration, as long as everyone has an account. We hope you enjoy exploring music through Pretty Music Maker!</p>
        </div>
        <div className="authorContainer">
          <div className="singleAuthor">
            <div className="authorText">
              <p className="author">SeokJun Bing</p>
              <p>{'github.com/seokjunbing'}</p>
            </div>
            <div className="authorImage">
              <img src="https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAm-AAAAJDI1Mzk1YmM2LThhZjUtNDIyMy05YTFlLTYwOTQxM2U5OTc0NQ.jpg" alt="nothing to see here" className="rounded" />
            </div>
          </div>
          <div className="singleAuthor">
            <div className="authorText">
              <p className="author">Ke Deng</p>
              <p>{'github.com/justkdeng'}</p>
            </div>
            <div className="authorImage">
              <img src="https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAANLAAAAJDViYWYxMzhiLTE4MmYtNDA2ZC1hZWVjLWEzM2EzM2JkOTU1ZQ.jpg" alt="nothing to see here" className="rounded" />
            </div>
          </div>
          <div className="singleAuthor">
            <div className="authorText">
              <p className="author">Vanny Nguyen</p>
              <p>{'github.com/vannynguyen'}</p>
            </div>
            <div className="authorImage">
              <img src="https://mir-s3-cdn-cf.behance.net/user/138/4e88a214578195.56b803d1e9149.jpg" alt="nothing to see here" className="rounded" />
            </div>
          </div>
          <div className="singleAuthor">
            <div className="authorText">
              <p className="author">Ödön Örzsik</p>
              <p>{'github.com/orzsikodon'}</p>
            </div>
            <div className="authorImage">
              <img src="https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAWZAAAAJDc5MjJkZDY5LWYyYmEtNDg2ZS1iYTc3LTBlMTJmNWY0NmUxMA.jpg" alt="nothing to see here" className="rounded" />
            </div>
          </div>
          <div className="singleAuthor">
            <div className="authorText">
              <p className="author">Dylan Scandinaro</p>
              <p>{'github.com/dylansc'}</p>
            </div>
            <div className="authorImage">
              <img src="https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAjtAAAAJDNlYmQxYWJhLWQ1NWYtNDdkOS04YzY3LWY3ZDc2NWVlZGE4Zg.jpg" alt="nothing to see here" className="rounded" />
            </div>
          </div>
          <div className="mainButtonContainer">
            <p>Check Pretty Music Maker out on GitHub!</p>
            <div className="buttonContainer">
              <form action="https://github.com/dartmouth-cs52-17S/project-api-prettymusicmaker">
                <button type="submit">API</button>
              </form>
              <form action="https://github.com/dartmouth-cs52-17S/project-client-prettymusicmaker">
                <button type="submit">Client</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, null)(AboutUs);
