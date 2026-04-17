const sendSuccess = (res, data = null, message = "OK", status = 200, meta = {}) => {
  return res.status(status).json({
    success: true,
    data,
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || null,
      message,
      ...meta
    }
  });
};

module.exports = { sendSuccess };
