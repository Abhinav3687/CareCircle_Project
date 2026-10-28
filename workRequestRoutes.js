import express from "express";

import WorkRequest from "../models/WorkRequest.js";

import { io } from "../server.js";

const router = express.Router();


// CREATE WORK REQUEST
router.post("/create", async (req, res) => {

  try {

    const {

      customerId,
      customerName,
      workType,
      description,
      location,
      date,
      selectedSlots,
      totalPrice,

    } = req.body;

    const newRequest = new WorkRequest({

      customerId,
      customerName,
      workType,
      description,
      location,
      date,
      selectedSlots,
      totalPrice,

    });

    await newRequest.save();

    // REALTIME EVENT
    io.emit(
      "newWorkRequest",
      newRequest
    );

    res.status(201).json({

      message: "Work Request Created",

      data: newRequest,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server Error",

    });
  }
});


// GET ALL REQUESTS
router.get("/", async (req, res) => {

  try {

    const requests = await WorkRequest.find()
      .sort({ createdAt: -1 });

    res.status(200).json(requests);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server Error",

    });
  }
});


// ACCEPT REQUEST
router.put("/accept/:id", async (req, res) => {

  try {

    const request = await WorkRequest.findById(
      req.params.id
    );

    if (!request) {

      return res.status(404).json({

        message: "Request Not Found",

      });
    }

    request.status = "accepted";

    request.assignedWorker =
      req.body.workerName;

    request.workerId =
      req.body.workerId;

    await request.save();

    // REALTIME ACCEPT EVENT
    io.emit(
      "requestAccepted",
      request
    );

    res.status(200).json({

      message: "Request Accepted",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server Error",

    });
  }
});


// REJECT REQUEST
router.put("/reject/:id", async (req, res) => {

  try {

    const request = await WorkRequest.findById(
      req.params.id
    );

    if (!request) {

      return res.status(404).json({

        message: "Request Not Found",

      });
    }

    request.status = "rejected";

    await request.save();

    res.status(200).json({

      message: "Request Rejected",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server Error",

    });
  }
});


// START WORK
router.put("/start-work/:id", async (req, res) => {

  try {

    const request = await WorkRequest.findById(
      req.params.id
    );

    if (!request) {

      return res.status(404).json({
        message: "Request Not Found",
      });
    }

    const startTime = new Date();

    const endTime = new Date(

      startTime.getTime() +

      request.selectedSlots.length *

      60 *

      60 *

      1000
    );

    request.workStarted = true;

    request.status = "ongoing";

    request.startTime = startTime;

    request.endTime = endTime;

    await request.save();

    io.emit(
      "workStarted",
      request
    );

    res.status(200).json({
      message: "Work Started",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// EXTEND WORK
router.put("/extend/:id", async (req, res) => {

  try {

    const request = await WorkRequest.findById(
      req.params.id
    );

    if (!request) {

      return res.status(404).json({
        message: "Request Not Found",
      });
    }

    const updatedEndTime = new Date(

      new Date(request.endTime).getTime()

      +

      60 * 60 * 1000
    );

    request.endTime = updatedEndTime;

    request.totalPrice += 200;

    request.selectedSlots.push(
      "Extended Slot"
    );

    await request.save();

    io.emit(
      "workExtended",
      request
    );

    res.status(200).json({
      message: "Work Extended By 1 Hour",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// COMPLETE WORK
router.put("/complete/:id", async (req, res) => {

  try {

    const request = await WorkRequest.findById(
      req.params.id
    );

    if (!request) {

      return res.status(404).json({
        message: "Request Not Found",
      });
    }

    request.status = "completed";

    await request.save();

    io.emit(
      "workCompleted",
      request
    );

    res.status(200).json({
      message: "Work Completed Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;