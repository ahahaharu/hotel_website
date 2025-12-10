const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const path = require('path');

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const projectId = process.env.DIALOGFLOW_PROJECT_ID;

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: path.join(__dirname, '../', 'google-credentials.json'),
});

exports.textQuery = async (req, res) => {
  const { text, sessionId } = req.body;

  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId || uuid.v4()
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: 'ru-RU',
      },
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;

    res.json({
      text: result.fulfillmentText,
      intent: result.intent.displayName,
      sessionId: sessionId,
    });
  } catch (err) {
    console.error('Dialogflow Error:', err);
    res.status(500).send('Error connecting to Dialogflow');
  }
};
