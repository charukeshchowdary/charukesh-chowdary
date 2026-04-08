const sendEmail = async ({ to, subject, body }) => {
  console.log('Email mock sent:', { to, subject, body });
  return true;
};

module.exports = { sendEmail };
