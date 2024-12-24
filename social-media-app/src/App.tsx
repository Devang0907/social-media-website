import './App.css';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';
import NewsFeedPage from './pages/NewsFeedPage';
import CreatePostPage from './pages/CreatePostPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const userId = '1'; // Replace with actual user ID after login

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/news-feed" element={<NewsFeedPage  />} />
        <Route path="/create-post" element={<CreatePostPage userId={userId} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;