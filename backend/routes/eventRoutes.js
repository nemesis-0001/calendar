const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  test
} = require("../controller/EventController");

router.get("/test",test);
router.post("/events", createEvent);
router.get("/getEvents/:userId", getEvents);
router.put("/events/:eventId", updateEvent);
router.delete("/events/:eventId", deleteEvent);

module.exports = router;
