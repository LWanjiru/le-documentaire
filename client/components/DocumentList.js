import React, { Component } from 'react';
import Request from 'superagent';

export default class DocumentList extends Component {
  constructor() {
    super();
    this.state = {
      documents: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    // this.setState({ isLoading: true });

    Request.get('http://localhost:8000/documents/public')
      .then((response) => {
        this.setState((Object.assign({}, { documents: response.body.rows })
        ));
      });
    // .catch(() => this.setState({ hasErrored: true }));
  }

  render() {
    return (
      <div className="row col s12">
        <div className="white-text background black darken-4">
          <li className="collection-header"><h4>Public Documents</h4></li>
          <br /> <p>Click on  a document to view its contents.</p>
          <div className="row">
            <ul className="collapsible with-header" data-collapsible="accordion">
              <div className="collection-item collapsible-header bordered">
                <a href="#!" className="col s12 black-text size">
                  <i className="material-icons brown circle">filter_drama</i>Title
                  <span className="btn-large black white-text badge">Author</span></a>
              </div>
              {this.state.documents.map(document => (
                <li className="collection-item" key={document.id}>
                  <div className="collapsible-header black">
                    <a href="#!" className="col s12">
                      <i className="material-icons brown circle">filter_drama</i>{document.title}
                      <span className="btn-large teal white-text badge">{document.owner}</span></a>
                  </div>
                  <div className="collapsible-body background white black-text">
                    <p>{document.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
