# p5.js Sketch Switcher

A Node.js server that automatically rotates between multiple p5.js sketches using Socket.IO.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Start the server:

   ```
   npm start
   ```

3. Open your browser to http://localhost:3333

## Project Structure

```
public/              # Static assets served by Express
  index.html         # Main controller page with iframe
  sketches/          # All p5.js sketches
    sketch1/         # First sketch
      index.html
      style.css
      sketch.js
    sketch2/         # Second sketch
      ...
    sketch3/         # Third sketch
      ...
server.js            # Node.js server with Socket.IO
config.json          # Configuration for sketches and timing
```

## How it works

- Each sketch is in its own directory with index.html, style.css, and sketch.js
- Main page (index.html) contains an iframe that displays the current sketch
- The server rotates between sketches every 5 seconds (configurable)
- Socket.IO is used to send messages from server to client when it's time to switch
- The client receives these messages and updates the iframe source accordingly

## Configuration

The `config.json` file controls the server settings and sketch rotation:

```json
{
  "port": 3333,
  "switchInterval": 5000,
  "sketches": [
    {
      "path": "sketches/sketch1",
      "name": "First Last",
      "title": "Rotating Square"
    }
  ]
}
```

- `port`: Server port number
- `switchInterval`: Time in milliseconds between sketch rotations
- `sketches`: Array of sketch objects, each with:
  - `path`: Path to the sketch folder, relative to the public directory
  - `name`: Creator's name (e.g., "First Last")
  - `title`: Title of the sketch (e.g., "Bouncing Circles")

## Adding New Sketches

1. Create a new directory in `public/sketches/` with your sketch files
2. Add the sketch information to the `sketches` array in `config.json`
