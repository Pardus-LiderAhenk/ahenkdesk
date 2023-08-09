// Import the required 'dbus-next' module
let dbus = require("dbus-next");

// Declare variables to store the dbus object, bus, ahenk interface, and message
let probject, bus, ahenk, message;

// Function to get the dbus object
async function getObject() {
  // Get the session bus
  bus = dbus.sessionBus();
  // Get the proxy object for the "org.ahenkdesk.dbus.Daemon" interface at the given object path
  probject = await bus.getProxyObject("org.ahenkdesk.dbus.Daemon", "/org/ahenkdesk/dbus/Daemon");
  // Get the interface for the "org.ahenkdesk.dbus.Daemon"
  ahenk = probject.getInterface("org.ahenkdesk.dbus.Daemon");
}

// Function to introduce a delay
function delay(waitTime) {
  return new Promise((resolve) => setTimeout(function () { resolve(); }, waitTime));
}

// Function to continuously get the incoming message
async function getMessage() {
  // Run an infinite loop to keep checking for incoming messages
  while (true) {
    // Check if the 'ahenk' object is defined
    if (ahenk !== undefined) {
      // If it is defined, get the incoming message using the 'messageIncome' method of the 'ahenk' interface
      message = await ahenk.messageIncome();
    }
    // Introduce a delay of 3000 milliseconds (3 seconds) before checking for the message again
    await delay(3000);
  }
}

// Export the functions and the 'message' variable so that they can be used in other modules
module.exports = { getObject, getMessage, message };
