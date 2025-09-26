import { useState } from 'react'

const EventTypeManager = ({ eventTypes, setEventTypes, events, setEvents }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [formData, setFormData] = useState({
    eventType: '',
    color: '#582F0E' // Dark Brown
  })

  const colorPalette = [
    { name: 'Dark Brown', value: '#582F0E' },
    { name: 'Medium Brown', value: '#7F4F24' },
    { name: 'Golden Brown', value: '#936639' },
    { name: 'Light Brown', value: '#B6AD90' },
    { name: 'Sage Green', value: '#C2C5AA' },
    { name: 'Olive Green', value: '#A4AC86' },
    { name: 'Forest Green', value: '#656D4A' },
    { name: 'Dark Olive', value: '#414833' },
    { name: 'Deep Forest', value: '#333D29' }
  ]

  const handleCreateEdit = () => {
    if (!formData.eventType.trim()) return

    const newEventType = {
      eventType: formData.eventType.trim(),
      color: formData.color
    }

    if (editingType) {
      // Update existing event type
      setEventTypes(prev => prev.map(type => 
        type.eventType === editingType.eventType ? newEventType : type
      ))
      setEditingType(null)
    } else {
      // Create new event type
      setEventTypes(prev => [...prev, newEventType])
    }

    setFormData({ eventType: '', color: '#582F0E' })
    setIsCreating(false)
  }

  const handleDelete = (eventTypeToDelete) => {
    if (window.confirm(`Delete "${eventTypeToDelete}" and all associated events?`)) {
      // Delete event type
      setEventTypes(prev => prev.filter(type => type.eventType !== eventTypeToDelete))
      
      // Delete all events with this event type
      setEvents(prev => prev.filter(event => event.eventType !== eventTypeToDelete))
    }
  }

  const handleEdit = (eventType) => {
    const type = eventTypes.find(t => t.eventType === eventType)
    if (type) {
      setFormData({
        eventType: type.eventType,
        color: type.color
      })
      setEditingType(type)
      setIsCreating(true)
    }
  }


  return (
    <div className="event-type-manager">

      {isCreating && (
        <div className="event-form-overlay">
          <div className="event-form-card">
            <div className="event-form-header">
              <h3>{editingType ? 'Edit' : 'Create'} Event Type</h3>
              <button 
                className="event-form-close"
                onClick={() => {
    setIsCreating(false)
    setEditingType(null)
    setFormData({ eventType: '', color: '#3B82F6' })
                }}
                title="Close"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          <div className="form-group">
            <label>Event Type Name:</label>
            <input
              type="text"
              value={formData.eventType}
              onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
              placeholder="e.g., Mood, Exercise, Sleep"
            />
          </div>
          
          <div className="form-group">
            <label>Color:</label>
            <div className="color-palette">
              {colorPalette.map((color) => (
                <button
                  key={color.value}
                  className={`color-option ${formData.color === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  title={color.name}
                />
              ))}
            </div>
          </div>


          <div className="form-actions">
            <button className="btn btn-primary btn-full-width" onClick={handleCreateEdit}>
              {editingType ? 'Update' : 'Create'}
            </button>
          </div>
          </div>
        </div>
      )}

      <div className="event-types-list">
        {eventTypes.length === 0 ? (
          <p>No event types yet. Create an event type to get started!</p>
        ) : (
          eventTypes.map((type) => (
          <div 
            key={type.eventType} 
            className="event-type-card"
            style={{ backgroundColor: type.color }}
          >
            <div className="event-type-header">
              <p>{type.eventType}</p>
              <div className="event-type-actions">
                <button 
                  className="event-type-action-btn edit-btn"
                  onClick={() => handleEdit(type.eventType)}
                  title="Edit"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button 
                  className="event-type-action-btn delete-btn"
                  onClick={() => handleDelete(type.eventType)}
                  title="Delete"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Floating Create Event Type Button */}
      <button 
        className="floating-create-btn"
        onClick={() => {
          setIsCreating(true)
          setEditingType(null)
          setFormData({ eventType: '', color: '#3B82F6', detailsSchema: {} })
        }}
        title="Create Event Type"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </button>
    </div>
  )
}

export default EventTypeManager
