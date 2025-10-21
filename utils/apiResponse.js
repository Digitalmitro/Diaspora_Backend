export const apiSuccessResponse = (res, message, body, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    body,
  });
};

export const apiErrorResponse = (res, message, body, status = 400) => {
  return res.status(status).json({
    success: false,
    message,
    body,
  });
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const HTTP_STATUS_MESSAGE = {
  [HTTP_STATUS.OK]: "Success",
  [HTTP_STATUS.CREATED]: "Created",
  [HTTP_STATUS.BAD_REQUEST]: "Bad Request",
  [HTTP_STATUS.UNAUTHORIZED]: "Unauthorized",
  [HTTP_STATUS.FORBIDDEN]: "Forbidden",
  [HTTP_STATUS.NOT_FOUND]: "Not Found",
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};
