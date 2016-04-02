/// BACKEND API ///
import {trigger} from './events.js';

/**
 * The MDM API.
 * These functions are called by MDM from the outside,
 * so they need to be declared in global scope.
 * They should ONLY be called by MDM itself.
 */

// Called by MDM to show a message (usually "Please enter your username")
window.mdm_msg = function(message) {
  if (message) trigger("message", message);
};

// Called by MDM to show a timed login countdown
window.mdm_timed = function(message) {
  trigger("timedMessage", message);
  trigger("loginCountdown", +message.match(/[0-9]+/)[0]);
};

// Called by MDM to set the welcome message
window.set_welcome_message = function(message) {
  if (message) trigger("welcomeMessage", message);
};

// Called by MDM to update the clock
window.set_clock = function(message) {
  trigger("clockUpdate", message);
};
