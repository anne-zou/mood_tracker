import { useState, useEffect, useRef } from 'react'
import ActionButtons from './ActionButtons'

const Timeline = ({ events, eventTypes, setEvents }) => {
  console.log('Timeline component rendered with eventTypes:', eventTypes)
  
  // Helper function to get current local time in datetime-local format
  const getCurrentLocalTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const [selectedTypes, setSelectedTypes] = useState([])
  const [sortOrder, setSortOrder] = useState('newest')
  
  // Initialize with all event types selected
  useEffect(() => {
    if (eventTypes.length > 0) {
      setSelectedTypes(eventTypes.map(type => type.eventType))
    }
  }, [eventTypes])
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showEventTypeDropdown, setShowEventTypeDropdown] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const filterDropdownRef = useRef(null)
  const sortDropdownRef = useRef(null)
  const eventTypeDropdownRef = useRef(null)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    eventType: '',
    eventTime: getCurrentLocalTime(),
    eventDetails: {},
    detailToDisplay: ''
  })

  const getEventTypeColor = (eventType) => {
    const type = eventTypes.find(t => t.eventType === eventType)
    return type ? type.color : '#6B7280'
  }

  const handleTypeToggle = (eventType) => {
    setSelectedTypes(prev => 
      prev.includes(eventType) 
        ? prev.filter(type => type !== eventType)
        : [...prev, eventType]
    )
  }

  const handleSelectAll = () => {
    if (selectedTypes.length === eventTypes.length) {
      // If all are selected, deselect all
      setSelectedTypes([])
    } else {
      // If not all are selected, select all
      setSelectedTypes(eventTypes.map(type => type.eventType))
    }
  }

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown)
    if (!showFilterDropdown) {
      setShowSortDropdown(false)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      try {
        if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
          setShowFilterDropdown(false)
        }
        if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
          setShowSortDropdown(false)
        }
        if (eventTypeDropdownRef.current && !eventTypeDropdownRef.current.contains(event.target)) {
          setShowEventTypeDropdown(false)
        }
      } catch (error) {
        console.error('Error in outside click handler:', error)
      }
    }

    if (showFilterDropdown || showSortDropdown || showEventTypeDropdown) {
      // Use a small delay to allow click events to process first
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [showFilterDropdown, showSortDropdown, showEventTypeDropdown])

  const getEventTypeSchema = (eventType) => {
    try {
      if (!eventTypes || !Array.isArray(eventTypes)) {
        return {}
      }
      const type = eventTypes.find(t => t && t.eventType === eventType)
      return type ? (type.detailsSchema || {}) : {}
    } catch (error) {
      console.error('Error getting event type schema:', error)
      return {}
    }
  }

  const handleCreateEdit = () => {
    if (!formData.eventType) {
      alert('Please select an event type')
      return
    }

    const newEvent = {
      eventID: editingEvent ? editingEvent.eventID : Date.now().toString(),
      eventType: formData.eventType,
      eventTime: formData.eventTime,
      createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString(),
      lastModified: new Date().toISOString(),
      eventDetails: formData.eventDetails,
      detailToDisplay: formData.detailToDisplay
    }

    if (editingEvent) {
      setEvents(prev => prev.map(event => 
        event.eventID === editingEvent.eventID ? newEvent : event
      ))
    } else {
      setEvents(prev => [...prev, newEvent])
    }

    setIsCreating(false)
    setEditingEvent(null)
    setFormData({
      eventType: '',
      eventTime: new Date().toISOString().slice(0, 16),
      eventDetails: {},
      detailToDisplay: ''
    })
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setIsCreating(true)
    setFormData({
      eventType: event.eventType,
      eventTime: new Date(event.eventTime).toISOString().slice(0, 16),
      eventDetails: event.eventDetails,
      detailToDisplay: event.detailToDisplay
    })
  }

  const handleDelete = (eventID) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.eventID !== eventID))
    }
  }

  const filteredAndSortedEvents = events
    .filter(event => selectedTypes.length === 0 || selectedTypes.includes(event.eventType))
    .sort((a, b) => {
      const timeA = new Date(a.eventTime).getTime()
      const timeB = new Date(b.eventTime).getTime()
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })

  const groupEventsByDate = (events) => {
    const groups = {}
    events.forEach(event => {
      const date = new Date(event.eventTime).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(event)
    })
    return groups
  }

  const groupedEvents = groupEventsByDate(filteredAndSortedEvents)

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="timeline-controls">
          <div className="filter-dropdown-container" ref={filterDropdownRef}>
            <button 
              className="filter-dropdown-button"
              onClick={toggleFilterDropdown}
            >
              Filter by event type
              <span className="dropdown-arrow">▼</span>
            </button>
            {showFilterDropdown && (
              <div className="filter-dropdown-content">
                <label className="checkbox-label select-all-label">
                  <input
                    type="checkbox"
                    checked={selectedTypes.length === eventTypes.length}
                    onChange={handleSelectAll}
                  />
                  <span className="checkbox-text">Select All</span>
                </label>
                <div className="checkbox-divider"></div>
                {eventTypes.map(type => (
                  <label key={type.eventType} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.eventType)}
                      onChange={() => handleTypeToggle(type.eventType)}
                    />
                    <span className="checkbox-text">{type.eventType}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          <div className="sort-dropdown-container" ref={sortDropdownRef}>
            <button 
              className="sort-dropdown-button"
              onClick={() => {
                setShowSortDropdown(!showSortDropdown)
                if (!showSortDropdown) {
                  setShowFilterDropdown(false)
                }
              }}
            >
              {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
              <span className="dropdown-arrow">▼</span>
            </button>
            {showSortDropdown && (
              <div className="sort-dropdown-content">
                <button 
                  className={`sort-option ${sortOrder === 'newest' ? 'active' : ''}`}
                  onClick={() => {
                    setSortOrder('newest')
                    setShowSortDropdown(false)
                  }}
                >
                  Newest first
                </button>
                <button 
                  className={`sort-option ${sortOrder === 'oldest' ? 'active' : ''}`}
                  onClick={() => {
                    setSortOrder('oldest')
                    setShowSortDropdown(false)
                  }}
                >
                  Oldest first
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCreating && (
        <div className="event-form-overlay">
          <div className="event-form-card">
            <div className="event-form-header">
              <h3>{editingEvent ? 'Edit' : 'Create'} Event</h3>
              <button 
                className="event-form-close"
                onClick={() => {
                  setIsCreating(false)
                  setEditingEvent(null)
                  setFormData({
                    eventType: '',
                    eventTime: new Date().toISOString().slice(0, 16),
                    eventDetails: {},
                    detailToDisplay: ''
                  })
                }}
                title="Close"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          
          <div className="form-group">
            <label>Event Type:</label>
            <div className="form-dropdown-container" ref={eventTypeDropdownRef}>
              <button 
                className="form-dropdown-button"
                onClick={() => setShowEventTypeDropdown(!showEventTypeDropdown)}
              >
                {formData.eventType || 'Select event type'}
                <span className="dropdown-arrow">▼</span>
              </button>
              {showEventTypeDropdown && (
                <div className="form-dropdown-content">
                  {eventTypes && eventTypes.length > 0 ? eventTypes.map(type => (
                    <button 
                      key={type.eventType}
                      className={`form-dropdown-option ${formData.eventType === type.eventType ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        try {
                          setFormData(prev => ({
                            ...prev,
                            eventType: type.eventType,
                            eventDetails: {} // Reset details when type changes
                          }))
                          setShowEventTypeDropdown(false)
                        } catch (error) {
                          console.error('Error updating form data:', error)
                        }
                      }}
                    >
                      {type.eventType}
                    </button>
                  )) : (
                    <div className="form-dropdown-option">No event types available</div>
                  )}
                </div>
              )}
            </div>
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

          <div className="form-group">
            <label>Event Details:</label>
            <input
              type="text"
              value={formData.detailToDisplay}
              onChange={(e) => setFormData(prev => ({ ...prev, detailToDisplay: e.target.value }))}
              placeholder="Text to display for event"
            />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary btn-full-width" onClick={handleCreateEdit}>
              {editingEvent ? 'Update' : 'Create'}
            </button>
          </div>
          </div>
        </div>
      )}

      {Object.keys(groupedEvents).length === 0 ? (
        <div className="empty-timeline">
          <p>No events to display.</p>
          <p>Create an event to see it here!</p>
        </div>
      ) : (
        <div className="timeline-content">
          {Object.entries(groupedEvents).map(([date, dayEvents]) => (
            <div key={date} className="timeline-day">
              <p className="timeline-date-header">
                {formatDate(dayEvents[0].eventTime)}
              </p>
              
              <div className="timeline-events">
                {dayEvents.map((event, index) => (
                  <div 
                    key={event.eventID} 
                    className="timeline-event"
                    style={{ backgroundColor: getEventTypeColor(event.eventType) }}
                  >
                    <div className="timeline-event-marker">
                      {index < dayEvents.length - 1 && (
                        <div className="timeline-event-line"></div>
                      )}
                    </div>
                    
                    <div className="timeline-event-content">
                      <div className="timeline-event-header">
                        <div className="timeline-event-main">
                          <div className="timeline-event-title-row">
                            <h4>{event.eventType}</h4>
                            {event.detailToDisplay && (
                              <span className="timeline-event-display">
                                {event.detailToDisplay}
                              </span>
                            )}
                          </div>
                          <div className="timeline-event-times">
                            <span className="timeline-event-time">
                              {formatTime(event.eventTime)}
                            </span>
                            {event.lastModified && event.lastModified !== event.createdAt ? (
                              <span className="timeline-event-modified">
                                (edited {formatTime(event.lastModified)})
                              </span>
                            ) : event.createdAt !== event.eventTime && (
                              <span className="timeline-event-created">
                                (recorded {formatTime(event.createdAt)})
                              </span>
                            )}
                          </div>
                        </div>
                        <ActionButtons 
                          onEdit={() => handleEdit(event)}
                          onDelete={() => handleDelete(event.eventID)}
                        />
                      </div>
                      
                      {Object.keys(event.eventDetails).length > 0 && (
                        <div className="timeline-event-details">
                          {Object.entries(event.eventDetails).map(([key, value]) => (
                            <div key={key} className="timeline-detail-item">
                              <strong>{key}:</strong> {String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Create Event Button */}
      <button 
        className="floating-create-btn"
        onClick={() => {
          setIsCreating(true)
          setEditingEvent(null)
          setFormData({
            eventType: '',
            eventTime: getCurrentLocalTime(),
            eventDetails: {},
            detailToDisplay: ''
          })
        }}
        title="Create Event"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </button>

    </div>
  )
}

export default Timeline
