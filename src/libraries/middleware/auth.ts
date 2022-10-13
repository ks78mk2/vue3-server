import { decodeToken } from "../util/token";
import ClientError from "../error/clientError";
import { Request, Response, NextFunction, request } from "express";
import url from "url";
import logger from "../util/logger";

export default async (
  request: Request | any,
  response: Response,
  next: NextFunction
) => {
  const free = ["/users/signin"];
  
  let url_parse = url.parse(request.url, true);
  let pathname = url_parse.pathname;
  let include = false;
  
  free.forEach(key => {
    if (pathname.indexOf(key) > -1) {
      include = true;
    }
  });

  if (include) {
    next();
  } else {
    const token: string =
      request.body.token || request.query.token || request.headers["x-access-token"];
      logger.info('token :' + token)
    if (token) {
      decodeToken(token, (err: any, decoded: any) => {
        if (err) {
          const error = new ClientError(request.ip, "0008", 403);
          return response.status(error.statusCode).json({ message: error.message});
        } else {
          request.decoded = decoded;
          next();
        }
      });
    } else {
      const error = new ClientError(request.ip, "0005", 403);
      return response.status(error.statusCode).json({ message: error.message});
    }
  }
};
