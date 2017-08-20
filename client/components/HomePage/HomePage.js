import React from 'react';

const HomePage = () => (
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
          <li className="collection-item">
            <div className="collapsible-header black">
              <a href="#!" className="col s12">
                <i className="material-icons brown circle">filter_drama</i>{document.title}
                <span className="btn-large teal white-text badge">AuthorName</span></a>
            </div>
            <div className="collapsible-body background white black-text">
              <p>{document.content}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default HomePage;
