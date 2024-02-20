import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Card, Input } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content } = Layout;

const Home = () => {
  const [events, setEvents] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [newComments, setNewComments] = useState({}); // Use an object to store new comments for each event
  const jwtToken = localStorage.getItem('jwtToken');

  // Function to fetch events from the API
  const fetchEvents = async () => {
    try {
      const response = await fetch('https://eventmanagementapi.azurewebsites.net/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Failed to fetch events:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Function to fetch comments for all events
  const fetchCommentsForEvents = async () => {
    const comments = {};
    for (const event of events) {
      try {
        const response = await fetch(`https://eventmanagementapi.azurewebsites.net/events/${event.eventId}/comments`);
        if (response.ok) {
          const data = await response.json();
          comments[event.eventId] = data;
        } else {
          console.error(`Failed to fetch comments for event ${event.eventId}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error fetching comments for event ${event.eventId}:`, error);
      }
    }
    setCommentsMap(comments);
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch comments for events once events are fetched
  useEffect(() => {
    if (events.length > 0) {
      fetchCommentsForEvents();
    }
  }, [events]);

  // Function to handle comment input change for a specific event
  const handleCommentChange = (eventId, e) => {
    setNewComments({
      ...newComments,
      [eventId]: e.target.value, // Update the new comment for the specific event
    });
  };

  // Function to handle adding a new comment for a specific event
  const handleAddComment = async (eventId) => {
    const user = localStorage.getItem('user');
    const timestamp = new Date().toISOString(); // Use current timestamp
    try {
      const response = await fetch(`https://eventmanagementapi.azurewebsites.net/events/${eventId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          user,
          content: newComments[eventId], // Use the new comment for the specific event
          timestamp
        })
      });
      if (response.ok) {
        // Reset the new comment for the specific event
        setNewComments({
          ...newComments,
          [eventId]: '',
        });
        // Refetch comments for the updated event
        fetchCommentsForEvents();
      } else {
        console.error(`Failed to add comment for event ${eventId}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error adding comment for event ${eventId}:`, error);
    }
  };

  // Function to handle sign out
  const handleSignOut = () => {
    // Remove jwtToken and user from local storage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Layout>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* Check if jwtToken exists in local storage */}
          {jwtToken ? (
            <>
              <Menu.Item>
                <Link to="/manage-events">
                  <Button type="primary">Manage Your Events</Button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/create-event">
                  <Button type="primary">Create Event</Button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Button type="primary" onClick={handleSignOut}>Sign out</Button>
              </Menu.Item>
            </>
          ) : (
            <Menu.Item>
              <Link to="/login">
                <Button type="primary">Login</Button>
              </Link>
            </Menu.Item>
          )}
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <h1>Welcome to Event Management</h1>
          <p>Organize and manage your events with ease!</p>
          <p>Explore a wide range of features to plan, create, and manage events seamlessly.</p>
          <h2>Upcoming Events:</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {events.map(event => (
              <Card key={event._id} title={event.title} style={{ width: 300, margin: '16px' }}>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p>{event.description}</p>
                <h3>Comments:</h3>
                <div>
                  {/* Render comments for this event */}
                  {commentsMap[event.eventId] &&
                    commentsMap[event.eventId].map(comment => (
                      <div key={comment._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <p><strong>User:</strong> {comment.user}</p>
                        <p><strong>Content:</strong> {comment.content}</p>
                        <p><strong>Timestamp:</strong> {new Date(comment.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                </div>
                {jwtToken && (
                  <div style={{ marginTop: '16px' }}>
                    <Input.TextArea
                      rows={1}
                      value={newComments[event.eventId] || ''} // Use the new comment for the specific event
                      onChange={(e) => handleCommentChange(event.eventId, e)} // Pass the event ID to handleCommentChange
                    />
                    <Button
                      type="primary"
                      style={{ marginTop: '8px' }}
                      onClick={() => handleAddComment(event.eventId)} // Pass the event ID to handleAddComment
                    >
                      Add Comment
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
