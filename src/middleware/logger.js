const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;

  console.log(`[${timestamp}] ${method} ${url}`);

  if (Object.keys(req.body).length > 0) {
    console.log('Тело запроса:', req.body);
  }

  if (Object.keys(req.query).length > 0) {
    console.log('Query параметры:', req.query);
  }

  if (Object.keys(req.params).length > 0) {
    console.log('Параметры маршрута:', req.params);
  }

  next();
};

module.exports = logger;