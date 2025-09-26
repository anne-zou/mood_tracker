import { useState } from 'react'

const EventManager = ({ events, setEvents, eventTypes }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    eventType: '',
    eventTime: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM format
    eventDetails: {},
    detailToDisplay: ''
  })

  const handleCreateEdit = () => {
    if (!formData.eventType || !formData.eventTime) return

    const eventType = eventTypes.find(type => type.eventType === formData.eventType)
    if (!eventType) return

    // Validate eventDetails against schema
    const isValid = Object.entries(eventType.detailsSchema).every(([fieldName, fieldType]) => {
      const value = formData.eventDetails[fieldName]
      if (fieldType === 'string') return typeof value === 'string'
      if (fieldType === 'number') return typeof value === 'number' && !isNaN(value)
      if (fieldType === 'boolean') return typeof value === 'boolean'
      return true
    })

    if (!isValid) {
      alert('Please fill in all required fields with correct data types')
      return
    }

    const newEvent = {
      eventID: editingEvent ? editingEvent.eventID : `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventType: formData.eventType,
      eventTime: new Date(formData.eventTime).toISOString(), // User-provided time when event occurred
      createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString(), // Immutable creation time
      eventDetails: formData.eventDetails,
      detailToDisplay: formData.detailToDisplay || Object.values(formData.eventDetails)[0] || ''
    }

    if (editingEvent) {
      // Update existing event
      setEvents(prev => prev.map(event => 
        event.eventID === editingEvent.eventID ? newEvent : event
      ))
      setEditingEvent(null)
    } else {
      // Create new event
      setEvents(prev => [newEvent, ...prev])
    }

    setFormData({
      eventType: '',
      eventTime: new Date().toISOString().slice(0, 16),
      eventDetails: {},
      detailToDisplay: ''
    })
    setIsCreating(false)
  }

  const handleDelete = (eventID) => {
    if (window.confirm('Delete this event?')) {
      setEvents(prev => prev.filter(event => event.eventID !== eventID))
    }
  }

  const handleEdit = (event) => {
    setFormData({
      eventType: event.eventType,
      eventTime: new Date(event.eventTime).toISOString().slice(0, 16),
      eventDetails: event.eventDetails,
      detailToDisplay: event.detailToDisplay
    })
    setEditingEvent(event)
    setIsCreating(true)
  }

  const updateEventDetail = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        [fieldName]: value
      }
    }))
  }

  const getEventTypeColor = (eventType) => {
    const type = eventTypes.find(t => t.eventType === eventType)
    return type ? type.color : '#6B7280'
  }

  const getEventTypeSchema = (eventType) => {
    const type = eventTypes.find(t => t.eventType === eventType)
    return type ? type.detailsSchema : {}
  }

  return (
    <div className="event-manager">
      {!isCreating && (
        <div className="section-header">
          <button 
            className="btn btn-primary"
            onClick={() => {
              setIsCreating(true)
              setEditingEvent(null)
              setFormData({
                eventType: '',
                eventTime: new Date().toISOString().slice(0, 16),
                eventDetails: {},
                detailToDisplay: ''
              })
            }}
          >
            Create Event
          </button>
        </div>
      )}

      {isCreating && (
        <div className="event-form-direct">
          <h3>{editingEvent ? 'Edit' : 'Create'} Event</h3>
          
          <div className="form-group">
            <label>Event Type:</label>
            <select
              value={formData.eventType}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  eventType: e.target.value,
                  eventDetails: {} // Reset details when type changes
                }))
              }}
            >
              <option value="">Select event type</option>
              {eventTypes.map(type => (
                <option key={type.eventType} value={type.eventType}>
                  {type.eventType}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>When did this event occur?</label>
            <input
              type="datetime-local"
              value={formData.eventTime}
              onChange={(e) => setFormData(prev => ({ ...prev, eventTime: e.target.value }))}
            />
            <small className="form-help">
              This is when the event actually happened (you can set it to any time in the past or future)
            </small>
          </div>

          {formData.eventType && (
            <>
              <div className="form-group">
                <label>Event Details:</label>
                <div className="event-details">
                  {Object.entries(getEventTypeSchema(formData.eventType)).map(([fieldName, fieldType]) => (
                    <div key={fieldName} className="detail-field">
                      <label>{fieldName} ({fieldType}):</label>
                      {fieldType === 'string' && (
                        <input
                          type="text"
                          value={formData.eventDetails[fieldName] || ''}
                          onChange={(e) => updateEventDetail(fieldName, e.target.value)}
                          placeholder={`Enter ${fieldName}`}
                        />
                      )}
                      {fieldType === 'number' && (
                        <input
                          type="number"
                          value={formData.eventDetails[fieldName] || ''}
                          onChange={(e) => updateEventDetail(fieldName, parseFloat(e.target.value) || 0)}
                          placeholder={`Enter ${fieldName}`}
                        />
                      )}
                      {fieldType === 'boolean' && (
                        <select
                          value={formData.eventDetails[fieldName] || ''}
                          onChange={(e) => updateEventDetail(fieldName, e.target.value === 'true')}
                        >
                          <option value="">Select...</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Event Details:</label>
                <input
                  type="text"
                  value={formData.detailToDisplay}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailToDisplay: e.target.value }))}
                  placeholder="Text to display for event"
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button className="btn btn-primary btn-full-width" onClick={handleCreateEdit}>
              {editingEvent ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventManager
