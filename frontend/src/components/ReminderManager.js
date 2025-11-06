import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Form, Modal, Badge } from 'react-bootstrap';
import { Plus, Trash } from 'react-bootstrap-icons';
import { api } from '../utils/api';

const ReminderManager = () => {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    category: ''
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await api.get('/api/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/reminders', formData);
      setShowForm(false);
      setFormData({ title: '', dueDate: '', category: '' });
      fetchReminders();
    } catch (error) {
      console.error('Failed to create reminder:', error);
    }
  };

  const toggleReminder = async (id, currentStatus) => {
    try {
      await api.put(`/api/reminders/${id}`, { isCompleted: !currentStatus });
      fetchReminders();
    } catch (error) {
      console.error('Failed to update reminder:', error);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await api.delete(`/api/reminders/${id}`);
      fetchReminders();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
  };

  const categories = ['utilities', 'rent', 'subscriptions', 'insurance', 'other'];

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Bill Reminders</h5>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus /> Add Reminder
        </Button>
      </Card.Header>
      <Card.Body>
        {reminders.length === 0 ? (
          <p className="text-muted text-center">No reminders set</p>
        ) : (
          <ListGroup variant="flush">
            {reminders.map(reminder => (
              <ListGroup.Item
                key={reminder._id}
                className="d-flex justify-content-between align-items-center border-0 px-0"
              >
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    checked={reminder.isCompleted}
                    onChange={() => toggleReminder(reminder._id, reminder.isCompleted)}
                    className="me-3"
                  />
                  <div>
                    <div className={reminder.isCompleted ? 'text-decoration-line-through text-muted' : 'fw-semibold'}>
                      {reminder.title}
                    </div>
                    <small className="text-muted">
                      Due: {new Date(reminder.dueDate).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div>
                  {reminder.category && (
                    <Badge bg="secondary" className="me-2 text-capitalize">
                      {reminder.category}
                    </Badge>
                  )}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteReminder(reminder._id)}
                  >
                    <Trash size={12} />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>

      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Bill Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Electricity Bill"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                Add Reminder
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default ReminderManager;