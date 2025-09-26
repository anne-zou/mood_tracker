import { useState, useEffect } from 'react'
import './App.css'
import EventTypeManager from './components/EventTypeManager'
import EventManager from './components/EventManager'
import Timeline from './components/Timeline'

function App() {
  const [eventTypes, setEventTypes] = useState([])
  const [events, setEvents] = useState([])
  const [activeTab, setActiveTab] = useState('timeline')

  // Initialize localStorage with defaults if empty, then load data
  useEffect(() => {
    console.log('Initializing app...')
    
    // Check if localStorage has eventTypes and if it's empty
    const savedEventTypes = localStorage.getItem('eventTypes')
    const parsedEventTypes = savedEventTypes ? JSON.parse(savedEventTypes) : []
    
    // Initialize default event types in localStorage if not present or empty
    if (!savedEventTypes || parsedEventTypes.length === 0) {
      console.log('No eventTypes or empty array in localStorage, setting defaults...')
      const defaultEventTypes = [
        { eventType: 'Mood', color: '#582F0E' }, // Dark Brown
        { eventType: 'Food', color: '#936639' }, // Golden Brown
        { eventType: 'Sleep', color: '#656D4A' }, // Forest Green
        { eventType: 'Exercise', color: '#A4AC86' }, // Olive Green
        { eventType: 'Meds', color: '#7F4F24' } // Medium Brown
      ]
      localStorage.setItem('eventTypes', JSON.stringify(defaultEventTypes))
      console.log('Default event types saved to localStorage:', defaultEventTypes)
      setEventTypes(defaultEventTypes)
    } else {
      console.log('Found existing eventTypes in localStorage:', parsedEventTypes)
      setEventTypes(parsedEventTypes)
    }

    // Load events from localStorage
    const savedEvents = localStorage.getItem('events')
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    console.log('Saving eventTypes to localStorage:', eventTypes)
    localStorage.setItem('eventTypes', JSON.stringify(eventTypes))
  }, [eventTypes])

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  return (
    <div className="app">
      <main className="app-main">
        {activeTab === 'timeline' && (
          <Timeline 
            events={events} 
            eventTypes={eventTypes}
            setEvents={setEvents}
          />
        )}
        {activeTab === 'event-types' && (
          <EventTypeManager 
            eventTypes={eventTypes} 
            setEventTypes={setEventTypes}
            events={events}
            setEvents={setEvents}
          />
        )}
      </main>

      <footer className="app-footer">
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'timeline' ? 'active' : ''}
            onClick={() => setActiveTab('timeline')}
            title="Timeline"
          >
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            </span>
            <span className="nav-label">Timeline</span>
          </button>
          <button 
            className={activeTab === 'event-types' ? 'active' : ''}
            onClick={() => setActiveTab('event-types')}
            title="Event Types"
          >
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </span>
            <span className="nav-label">Event Types</span>
          </button>
        </nav>
      </footer>
    </div>
  )
}

export default App
