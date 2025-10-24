export default class ErrorResponse extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class BusinessException extends Error {
  constructor(message) {
    super();
    this.statusCode = 400;
    this.message = message;
  }
}

export class NotFoundException extends Error {
  constructor(message) {
    super();
    this.statusCode = 404;
    this.message = message;
  }
}

export class ForbiddenException extends Error {
  constructor(message) {
    super();
    this.statusCode = 403;
    this.message = message;
  }
}

export class UnauthorizedException extends Error {
  constructor(message) {
    super();
    this.statusCode = 401;
    this.message = message;
  }
}

export class InternalServerException extends Error {
  constructor(message) {
    super();
    this.statusCode = 500;
    this.message = message;
  }
}

export class BadRequestException extends Error {
  constructor(message) {
    super();
    this.statusCode = 400;
    this.message = message;
  }
}

export class ConflictException extends Error {
  constructor(message) {
    super();
    this.statusCode = 409;
    this.message = message;
  }
}

export class PreconditionFailedException extends Error {
  constructor(message) {
    super();
    this.statusCode = 412;
    this.message = message;
  }
}

export class ServiceUnavailableException extends Error {
  constructor(message) {
    super();
    this.statusCode = 503;
    this.message = message;
  }
}

export class NotImplementedException extends Error {
  constructor(message) {
    super();
    this.statusCode = 501;
    this.message = message;
  }
}

export class GatewayTimeoutException extends Error {
  constructor(message) {
    super();
    this.statusCode = 504;
    this.message = message;
  }
}

export class MethodNotAllowedException extends Error {
  constructor(message) {
    super();
    this.statusCode = 405;
    this.message = message;
  }
}
