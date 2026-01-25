# WebSocket API Documentation

## Connection

Connect to: `ws://localhost:5001/` (or production URL)

## Message Format

All messages must be valid JSON with the following structure:

### Connection Message (Required First)

Send this immediately after connecting:
```json
{
  "method": "connection",
  "username": "JohnDoe",
  "id": "optional-room-uuid"
}
```

**Fields:**
- `method`: Must be `"connection"`
- `username`: String, 1-50 characters
- `id`: Optional UUID for room/session

**Response:** Server broadcasts to all other clients

### Draw Message

Send when user draws something:
```json
{
  "method": "draw",
  "figure": {
    "type": "brush",
    "color": "#FF0000",
    "stroke": 5,
    "points": [
      { "x": 100, "y": 200 },
      { "x": 101, "y": 201 }
    ]
  }
}
```

**Figure Types:**
- `brush`: Free-form drawing (requires `points`)
- `rect`: Rectangle (requires `width`, `height`, `points[0]` as top-left)
- `circle`: Circle (requires `radius`, `points[0]` as center)
- `eraser`: Eraser (requires `points`)

**Constraints:**
- Color: Hex format `#RRGGBB`
- Stroke: 1-100 pixels
- Points: Max 10,000 points per message
- Radius: Max 5,000 pixels
- Width/Height: Max 10,000 pixels

## Events from Server

### User Connected
```json
{
  "type": "user_connected",
  "timestamp": "2025-01-24T10:00:00.000Z",
  "data": {
    "method": "connection",
    "username": "JohnDoe",
    "id": "room-uuid"
  }
}
```

### User Disconnected
```json
{
  "type": "user_disconnected",
  "timestamp": "2025-01-24T10:05:00.000Z",
  "data": {
    "method": "connection",
    "username": "JohnDoe",
    "id": "room-uuid"
  }
}
```

### Draw Event
```json
{
  "type": "draw",
  "timestamp": "2025-01-24T10:01:00.000Z",
  "data": {
    "method": "draw",
    "username": "JohnDoe",
    "figure": { ... }
  }
}
```

### Error
```json
{
  "type": "error",
  "timestamp": "2025-01-24T10:02:00.000Z",
  "data": {
    "message": "Invalid message format"
  }
}
```

## Error Codes

- `1000`: Normal closure or connection timeout (60s without initialization)
- Invalid JSON → Error event sent to client
- Message > 100KB → Error event sent to client
- Invalid schema → Error event sent to client

## Connection Lifecycle

1. Client connects
2. Client MUST send connection message within 60 seconds
3. Client can send draw messages
4. Server broadcasts to all other clients in same room
5. Client disconnects → Server notifies others

## Monitoring

GET `/ws-stats` - Get WebSocket statistics (requires server access)
