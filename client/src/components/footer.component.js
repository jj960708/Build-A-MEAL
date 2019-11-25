import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './stylesheets/footer.css';
//important links related to the group
export default class Footer extends Component {
  
  render() {
    return (
      <div id="Footer">
  		<a href="https://github.com/jj960708/Build-A-MEAL">GitHub Repository</a>
  		<a href="https://trello.com/b/cZfACP2m/project-schedule-for-team-bam">Trello Workspace</a>
  		<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Contact: kwank2@rpi.edu </a>
	  </div>
    );
  }
}


