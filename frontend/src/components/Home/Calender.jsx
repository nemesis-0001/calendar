import React, { useCallback, useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventModal from "../Modal/EventModal";
import { use } from "react";
import auth from "../Login/firebase";

const localizer = momentLocalizer(moment);

export default function MyCalendar({ userId }) {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    title: "",
    start: new Date(),
    end: new Date(),
    desc: "",
  });

  // Fetch events from the database
  const fetchAllEvents = async (userId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/task/getEvents/${userId}`
      );
      const transformedEvents = res.data.map((event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        desc: event.description,
      }));
      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchAllEvents(userId);
  }, [userId]);

  // Open the modal
  const handleOpenModal = (event = null) => {
    if (event) {
      setModalData({ ...event });
    } else {
      setModalData({
        id: null,
        title: "",
        start: new Date(),
        end: new Date(),
        desc: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Save or update event
  const handleSaveEvent = async () => {
  const { id, title, start, end, desc } = modalData;
  const eventToSave = {
    title,
    start: moment(start).format("YYYY-MM-DDTHH:mm:ss"), // Local time
    end: moment(end).format("YYYY-MM-DDTHH:mm:ss"),     // Local time
    description: desc,
    userId,
  };

  if (id) {
    // Update existing event
    await axios
      .put(`${import.meta.env.VITE_REACT_APP_BASE_URL}/task/events/${id}`, eventToSave)
      .then(() => {
        setEvents((prevEvents) =>
          prevEvents.map((evt) =>
            evt.id === id ? { ...evt, ...eventToSave } : evt
          )
        );
        handleCloseModal();
      })
      .catch((error) => console.error("Error updating event:", error));
  } else {
    // Save new event
    await axios
      .post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/task/events`, eventToSave)
      .then((response) => {
        setEvents((prevEvents) => [...prevEvents, response.data]);
        handleCloseModal();
      })
      .catch((error) => console.error("Error saving event:", error));
  }
};

  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    await axios
      .delete(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/task/events/${eventId}`
      )
      .then(() => {
        setEvents((prevEvents) =>
          prevEvents.filter((evt) => evt.id !== eventId)
        );
        window.location.reload();
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  const handleLogOut = async () => {
    try {
      await auth.signOut();
      toast.success("Logout successful");
      window.location.href = "/";
      // window.
    } catch (e) {
      console.log(e, "Error logging out");
    }
  };

  return (
    <div className="h-screen w-screen bg-white shadow-md rounded-lg p-4">
      <button
        className="bg-red-600 hover:bg-red-700  origin-top-right justify-items-end text-white font-bold py-2 px-4 rounded m-2"
        onClick={handleLogOut}
      >
        Logout
      </button>
      <Calendar
        // localizer={localizer}
        localizer={localizer}
        // defaultDate={new Date()}
        // defaultView={Views.MONTH}
        events={events}
        onSelectSlot={({ start, end }) => handleOpenModal({ start, end })}
        onSelectEvent={(event) => handleOpenModal(event)}
        selectable={true}
        dayLayoutAlgorithm="no-overlap"
      />
      <EventModal
        show={showModal}
        onHide={handleCloseModal}
        data={modalData}
        onChange={(field, value) =>
          setModalData((prevData) => ({ ...prevData, [field]: value }))
        }
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
