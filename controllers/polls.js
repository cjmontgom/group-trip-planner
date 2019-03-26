const pollsModel = require("../models/lib/polls.js");
const stageController = require("./stages.js");

exports.savePollToDB = async (req, res) => {
  let stageId = await stageController.saveStageToDB({body:
    { stageName: req.body.type,
      content: `Please fill in the ${req.body.type.toLowerCase()} poll`, // in model, create the content for the reminder
      due_date: req.body.deadline,
      trip_id: req.body.tripId
    }
  })
  pollsModel.savePollToDB(req.body.type, `${req.body.options}`, req.body.deadline, req.body.tripId, stageId);
};

exports.getPolls = async (req, res) => {
    let polls = await pollsModel.getPolls(req.query.tripId);
    res.send(polls)
};

exports.saveVotes = async (req, res) => {
    pollsModel.saveVotes(req.body.tripId, req.body.pollId, req.body.userId, req.body.optionIds);
    res.send('ok')
};

exports.getVotes = async (req, res) => {
    let votes = await pollsModel.getVotes(req.query.tripId);
    res.send(votes)
};
