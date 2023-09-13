# NotiHub

A Twitter clone project i made using NEXT.js to practice my dev skills and enhance my portfolio.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Demo

You can check out the live demo of the app [here](https://notihub.vercel.app/).

## Features

App includes features like:

- creating and account and logging in with email authorization and verification or with social media
- composing and creating posts
- profile management with file upload and edit options
- home feed display of tweets
- liking and replying to posts
- activity feed with replies to your posts
- search for users to see their profiles and posts
- database integration to store user info, posts, images

## Technologies

- next.js
- clerk
- radix-ui
- uploadthing
- lucide-react
- mongoose
- react
- react-dom
- react-hook-form
- svix
- tailwindcss
- typescript
- zod

## Installation

1.  Clone the repository: `git clone https://github.com/kornik6980/notihub`
2.  Navigate to the directory
3.  Install dependencies: `npm install`

## Usage

- Set up your MongoDb, Clerk, and UploadThing
- Add .env.local file with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`, `MONGODB_URL`, `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`
- Run the server in development mode: `npm run dev`
- At browser navigate to `http://localhost:3000` and your app will open

If you have any further questions, feel free to ask!

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
