import React, { useState, useEffect } from 'react';
import { Table, Button, message, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content } = Layout;

const ManageYourEvents = () => {
  const [events, setEvents] = useState([]);

  // Function to fetch events owned by the user
  const fetchOwnedEvents = async () => {
    try {
      // Retrieve JWT token from local storage
      const jwtToken = localStorage.getItem('jwtToken');

      // Make GET request to fetch owned events
      const response = await fetch('https://eventmanagementapi.azurewebsites.net/ownedEvents', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        throw new Error('Failed to fetch owned events');
      }
    } catch (error) {
      console.error('Error fetching owned events:', error);
      message.error(error.message || 'Failed to fetch owned events');
    }
  };

  // Function to handle delete event
  const handleDeleteEvent = async (eventId) => {
    try {
      // Retrieve JWT token from local storage
      const jwtToken = localStorage.getItem('jwtToken');

      // Make DELETE request to delete the event
      const response = await fetch(`https://eventmanagementapi.azurewebsites.net/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (response.ok) {
        message.success('Event deleted successfully!');
        // Remove the deleted event from the events state
        setEvents(events.filter(event => event.eventId !== eventId));
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      message.error(error.message || 'Failed to delete event');
    }
  };

  // Fetch owned events on component mount
  useEffect(() => {
    fetchOwnedEvents();
  }, []);

  // Define columns for the table
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="danger" onClick={() => handleDeleteEvent(record.eventId)}>Delete</Button>
      )
    }
  ];

  return (
    <Layout>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Menu.Item>
            <Link to="/">
              <Button type="primary">Home</Button>
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <h1>Manage Your Events</h1>
          <Table dataSource={events} columns={columns} rowKey="eventId" />
        </div>
      </Content>
    </Layout>
  );
};

export default ManageYourEvents;
