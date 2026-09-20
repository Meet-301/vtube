# 🎬 Vtube

A video platform built from scratch with **Node.js, Express and MongoDB**. It ships a full REST API covering authentication, video uploads, likes, comments, playlists, subscriptions, search and timestamped video notes, with a **React** frontend currently in progress.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socketdotio&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)

**🔗 Live API:** http://vtube-mvnn.onrender.com &nbsp;|&nbsp;

<!-- Add a screenshot or GIF here once the frontend is ready:
![Vtube demo](./docs/demo.gif)
-->

---

## ✨ Features

- **Authentication & account management**
  - Register with avatar upload, login, logout and refresh-token flow (JWT)
  - Email verification with resend, forgot / reset password (Nodemailer)
  - Password hashing with bcrypt, Google sign-in via OAuth 2.0 (Passport.js)
  - Update account details, password, avatar and cover image
- **Videos**
  - Upload video + thumbnail (Multer → Cloudinary), duration extracted automatically
  - Watch, browse all videos, fetch by channel, publish/unpublish, update details and thumbnail, delete
  - Personalised feed from subscribed channels
  - Watch history with per-video removal
- **Engagement**
  - Like / unlike toggle, liked-videos list and like status per video
  - Comments: add, list, edit, delete
  - Subscriptions: toggle, list a channel's subscribers, list subscribed channels
- **Playlists:** create, add / remove videos, custom cover image, delete
- **Search:** search by query and type (e.g. channel), with saved search history
- **Video notes:** timestamped notes on any video (create, list, edit, delete)
- **Efficient data access:** MongoDB aggregation pipelines with pagination

## 🛠️ Tech Stack

| Layer | Technologies |
| --- | --- |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose, mongoose-aggregate-paginate-v2 |
| Auth | JWT, bcrypt, Passport (Google OAuth 2.0), cookie-parser |
| Media | Multer, Cloudinary |
| Real-time / Email | Socket.IO, Nodemailer |
| Frontend | React (in progress) |
| Tooling | Nodemon, Prettier, Postman, Git & GitHub |

## 📁 Project Structure

```
vtube/
├── src/         # Backend (Express API)
├── frontend/    # React client (in progress)
├── docs/        # Postman collection
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or Atlas)
- A Cloudinary account
- Google OAuth credentials (for Google sign-in)
- An email account / SMTP app password (for verification and reset emails)

### Backend

```bash
# 1. Clone the repo
git clone https://github.com/Meet-301/vtube.git
cd vtube

# 2. Install dependencies
npm install

# 3. Create a .env file (see below)

# 4. Run in development
npm run dev
```

### Environment variables

Create a `.env` file in the project root. **Use the exact key names your code reads.**

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📡 API Overview

Import [`docs/vtube.postman_collection.json`](./docs/vtube.postman_collection.json) into Postman and set the `server` variable to your API base URL (for example `http://localhost:8000/api/v1`). Routes below are relative to that base URL; protected routes need a logged-in user.

### Users — `/users`
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/users/register` | Register (multipart: email, password, fullName, username, avatar) |
| POST | `/users/verify-email` | Verify email with token |
| POST | `/users/resend-email` | Resend verification email |
| POST | `/users/login` | Log in |
| POST | `/users/logout` | Log out |
| POST | `/users/refresh-token` | Get a new access token |
| POST | `/users/forgot-password` | Send password reset email |
| PATCH | `/users/reset-password` | Reset password with token |
| PATCH | `/users/update-password` | Change password |
| GET | `/users/current-user` | Get logged-in user |
| GET | `/users/channel/:username` | Get channel profile |
| GET | `/users/watch-history` | Get watch history |
| DELETE | `/users/watch-history/remove?videoId=` | Remove a video from history |
| PATCH | `/users/update-account` | Update account details |
| PATCH | `/users/update-avatar` | Update avatar |
| PATCH | `/users/update-cover` | Update cover image |

### Videos — `/videos`
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/videos/create` | Upload a video (multipart: title, description, video, thumbnail) |
| GET | `/videos/all` | Get all videos |
| GET | `/videos/watch/:videoId` | Watch a video |
| GET | `/videos/id/:videoId` | Get video details |
| GET | `/videos/username/:username` | Get a channel's videos |
| GET | `/videos/feed/subscription` | Feed from subscribed channels |
| PATCH | `/videos/update-details/:videoId` | Update details / publish status |
| PATCH | `/videos/update-thumbnail/:videoId` | Update thumbnail |
| DELETE | `/videos/videoid/:videoId` | Delete a video |

### Likes, Comments, Subscriptions
| Method | Endpoint | Description |
| --- | --- | --- |
| PATCH | `/likes/toggle/:videoId` | Toggle like |
| GET | `/likes/all` | Get liked videos |
| GET | `/likes/status/:videoId` | Get like status |
| POST | `/comments/add/:videoId` | Add a comment |
| GET | `/comments/all/:videoId` | List comments |
| PATCH | `/comments/:commentId` | Edit a comment |
| DELETE | `/comments/:commentId` | Delete a comment |
| POST | `/subscriptions/toggle/:channelId` | Subscribe / unsubscribe |
| GET | `/subscriptions/channel-subscribers/:channelId` | List subscribers |
| GET | `/subscriptions/subscribed-channels/:userId` | List subscribed channels |

### Playlists, Search, Video Notes
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/playlists/create` | Create a playlist |
| GET | `/playlists/:playlistId` | Get a playlist |
| GET | `/playlists/get/user` | Get the user's playlists |
| POST | `/playlists/:playlistId/add-video/:videoId` | Add a video |
| DELETE | `/playlists/remove-video/:playlistId/:videoId` | Remove a video |
| PATCH | `/playlists/:playlistId` | Update playlist cover |
| DELETE | `/playlists/:playlistId` | Delete a playlist |
| GET | `/search?query=&type=` | Search |
| GET | `/search-history` | Get search history |
| DELETE | `/search-history/remove?query=` | Remove a search entry |
| POST | `/video-notes/:videoId` | Add a timestamped note |
| GET | `/video-notes/:videoId` | List notes |
| PATCH | `/video-notes/:noteId` | Edit a note |
| DELETE | `/video-notes/:noteId` | Delete a note |

## 🗺️ Roadmap

- [x] REST API with JWT authentication, email verification and Google OAuth
- [x] Video upload pipeline with Cloudinary
- [x] Likes, comments, subscriptions, playlists, search and video notes
- [ ] React frontend (in progress)

## 👤 Author

**Meet Pujara**
- GitHub: [@Meet-301](https://github.com/Meet-301)
- LinkedIn: [meetpujara-dev](https://www.linkedin.com/in/meetpujara-dev)

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.
