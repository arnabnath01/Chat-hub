import React from 'react'

const ChatAbout = () => {
  return (
    <div className="flex flex-col items-center justify-center  my-auto text-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to chat-room
      </h1>
      <p className="text-lg text-gray-700">
        Log in through <span className='font-bold'>Google/GitHub</span> to start chatting with your friends.
      </p>
      <p className="text-lg text-gray-700 mt-2">
        Dont worry, nothing other than email id, name, and picture is stored.
      </p>
    </div>
  );
}

export default ChatAbout