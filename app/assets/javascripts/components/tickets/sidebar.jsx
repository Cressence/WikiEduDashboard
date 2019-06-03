import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import TicketStatusHandler from './ticket_status_handler';
import TicketOwnerHandler from './ticket_owner_handler';
import { STATUSES } from './util';

export class Sidebar extends React.Component {
  // This is required because the User Profile is not a React page
  goTo() {
    window.location.pathname = `/users/${this.props.ticket.sender.username}`;
  }

  notifyOwner() {
    const { currentUser, ticket } = this.props;
    this.props.notifyOfMessage({
      message_id: ticket.messages[ticket.messages.length - 1].id,
      sender_id: currentUser.id
    });
  }

  deleteTicket() {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    this.props.deleteTicket(this.props.ticket.id)
      .then(() => this.props.history.push('/tickets/dashboard'));
  }

  render() {
    const { createdAt, currentUser, ticket } = this.props;
    const assignedTo = ticket.owner.id === currentUser.id ? 'You' : ticket.owner.username;
    const status = STATUSES[ticket.status];

    return (
      <section className="sidebar">
        <section className="created-at">Created <time className="bold">{moment(createdAt).fromNow()}</time></section>
        <section className="status">
          Ticket is currently <span className={`${status.toLowerCase()} bold`}>{status}</span>
          <TicketStatusHandler ticket={ticket} />
        </section>
        <section className="owner">
          Assigned to <span className="bold">{assignedTo}</span>
          <TicketOwnerHandler ticket={ticket} />
        </section>
        <section className="course-name">
          {
            ticket.project.id
              ? <Link to={`/courses/${ticket.project.slug}`}>Go to the {ticket.project.title} Course</Link>
              : 'Course Unknown'
          }
        </section>
        <section className="user-record">
          {
            ticket.sender.username
              ? <a onClick={() => this.goTo()}>Go to {`${ticket.sender.real_name || ticket.sender.username}'s`} Account</a>
              : 'Unknown User Record'
          }
        </section>
        <section>
          <button className="button info" onClick={() => this.notifyOwner()}>Email Ticket Owner</button>
        </section>
        <section>
          <button className="button danger" onClick={() => this.deleteTicket()}>Delete Ticket</button>
        </section>
      </section>
    );
  }
}

export default withRouter(Sidebar);
