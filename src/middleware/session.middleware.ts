import LocalSession from "telegraf-session-local";

export const sessionMiddleware = () => {
  return new LocalSession({database: 'session_db.json'});
}
