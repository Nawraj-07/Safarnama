# Safarnama 🛣️🎶

### Memories, Music & Miles.

Safarnama is a small nostalgia-inspired music player that I built around the feeling of an old Indian road trip.

The idea was pretty simple — **a scenic road, some old memories, and the songs that make those moments feel special.**

Instead of building just another music player, I wanted the whole interface to feel like you're sitting in a car on a long drive with your favorite songs playing in the background.

---

## 🎧 What it does

* Play songs directly through YouTube
* Move between songs using **Previous / Next**
* Browse songs from different playlists
* Responsive design for desktop and mobile
* Nostalgia/road-trip inspired UI
* YouTube videos are handled through the official **YouTube IFrame Player API**
* Videos that can't be embedded are automatically skipped


---

## 🛠️ Built With

* Next.js (App Router)
* React 19
* TypeScript
* Tailwind CSS v4
* YouTube IFrame Player API
* Vercel Analytics
* Vercel Speed Insights

---

## 🚀 Run it locally

Clone the repository:

```bash
git clone https://github.com/Nawraj-07/Safarnama.git
```

Go into the project:

```bash
cd Safarnama
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## 📁 Project Structure

```text
Safarnama/
├── app/
├── components/
├── lib/
│   └── playlists.ts
├── public/
├── package.json
└── README.md
```

---

## 📺 How the music works

Safarnama doesn't download or store any music.

The songs are played using YouTube's official embedded player. The app basically controls the player and handles things like playlist navigation and moving to the next/previous song.

If a particular video isn't available for embedding, the app simply skips it.

---

## ⚠️ Copyright Note

This project does not host or distribute any music.

All songs and videos are provided by YouTube through its embedded player. The music, videos, artwork and other third-party content belong to their respective copyright owners.

This project is mainly a **UI/learning project and personal experiment** built around the nostalgia of music and road trips.

---

## 💭 Why I made this

I've always liked the combination of **long drives + old songs**, and I wanted to turn that feeling into a small web project.

So instead of making another generic music player, I tried to build something that feels a little more personal.

**Put on your headphones, press play, and imagine the road ahead. 🚗🎶**

---

## 🔮 Things I might add later

* More playlists
* Search
* Favorite songs
* Recently played songs
* Better mobile experience
* More road-trip themes
* Keyboard shortcuts

---

## 👨‍💻 Made by

**Nawraj Singh**

B.Tech CSE | Full-Stack Developer

Built with Next.js, a lot of music, and probably too much nostalgia.

---

⭐ If you like the idea, feel free to star the repository.
